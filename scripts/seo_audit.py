#!/usr/bin/env python3
"""Small SEO/indexability audit for the static Tutifrutsy site."""

from __future__ import annotations

import json
import sys
import xml.etree.ElementTree as ET
from html.parser import HTMLParser
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
SITE_URL = "https://tutifrutsy.com/"
EN_URL = "https://tutifrutsy.com/en/"
LEESBURG_URL = "https://tutifrutsy.com/leesburg/"
EN_LEESBURG_URL = "https://tutifrutsy.com/en/leesburg/"
GOOGLE_MAPS_URL = "https://maps.app.goo.gl/EFCsfvaZtR2ZxycMA"
APPLE_MAPS_URL = "https://maps.apple/p/sN~ZwnLskBm_bJ"
MAX_META_DESCRIPTION = 160
MAX_TITLE = 70


class HeadParser(HTMLParser):
    def __init__(self) -> None:
        super().__init__()
        self.in_title = False
        self.in_json_ld = False
        self.title_parts: list[str] = []
        self.meta: dict[tuple[str, str], str] = {}
        self.links: dict[str, str] = {}
        self.alternates: dict[str, str] = {}
        self.img_srcs: list[str] = []
        self.script_srcs: list[str] = []
        self.json_ld_blocks: list[str] = []
        self._json_ld_parts: list[str] = []

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        attr = {key: value or "" for key, value in attrs}
        if tag == "title":
            self.in_title = True
        elif tag == "meta":
            if "name" in attr:
                self.meta[("name", attr["name"])] = attr.get("content", "")
            if "property" in attr:
                self.meta[("property", attr["property"])] = attr.get("content", "")
        elif tag == "link" and "rel" in attr:
            self.links[attr["rel"]] = attr.get("href", "")
            if attr["rel"] == "alternate" and "hreflang" in attr:
                self.alternates[attr["hreflang"]] = attr.get("href", "")
        elif tag == "img" and "src" in attr:
            self.img_srcs.append(attr["src"])
        elif tag == "script" and "src" in attr:
            self.script_srcs.append(attr["src"])
        elif tag == "script" and attr.get("type") == "application/ld+json":
            self.in_json_ld = True
            self._json_ld_parts = []

    def handle_endtag(self, tag: str) -> None:
        if tag == "title":
            self.in_title = False
        elif tag == "script" and self.in_json_ld:
            self.in_json_ld = False
            self.json_ld_blocks.append("".join(self._json_ld_parts).strip())

    def handle_data(self, data: str) -> None:
        if self.in_title:
            self.title_parts.append(data)
        if self.in_json_ld:
            self._json_ld_parts.append(data)

    @property
    def title(self) -> str:
        return " ".join("".join(self.title_parts).split())


def ok(message: str) -> None:
    print(f"OK: {message}")


def fail(message: str, failures: list[str]) -> None:
    print(f"FAIL: {message}")
    failures.append(message)


def require(condition: bool, message: str, failures: list[str]) -> None:
    if condition:
        ok(message)
    else:
        fail(message, failures)


def has_schema_type(value: object, schema_type: str) -> bool:
    if isinstance(value, dict):
        item_type = value.get("@type")
        if item_type == schema_type or (isinstance(item_type, list) and schema_type in item_type):
            return True
        return any(has_schema_type(child, schema_type) for child in value.values())
    if isinstance(value, list):
        return any(has_schema_type(child, schema_type) for child in value)
    return False


def audit_page(relative_path: str, expected_url: str, expected_lang: str, failures: list[str]) -> None:
    path = ROOT / relative_path
    parser = HeadParser()
    html = path.read_text(encoding="utf-8")
    parser.feed(html)

    title = parser.title
    description = parser.meta.get(("name", "description"), "")
    robots = parser.meta.get(("name", "robots"), "")
    canonical = parser.links.get("canonical", "")

    require(f'<html lang="{expected_lang}">' in html, f"{relative_path} html lang is {expected_lang}", failures)
    require(bool(title), f"{relative_path} title tag exists", failures)
    require(len(title) <= MAX_TITLE, f"{relative_path} title is {len(title)} chars (<= {MAX_TITLE})", failures)
    require(bool(description), f"{relative_path} meta description exists", failures)
    require(
        50 <= len(description) <= MAX_META_DESCRIPTION,
        f"{relative_path} meta description is {len(description)} chars (50-{MAX_META_DESCRIPTION})",
        failures,
    )
    require("index" in robots and "follow" in robots, f"{relative_path} robots meta allows indexing and following", failures)
    require(canonical == expected_url, f"{relative_path} canonical URL is correct", failures)
    require(parser.alternates.get("es-US") == SITE_URL, f"{relative_path} has es-US hreflang", failures)
    require(parser.alternates.get("en-US") == EN_URL, f"{relative_path} has en-US hreflang", failures)
    require(parser.alternates.get("x-default") == SITE_URL, f"{relative_path} has x-default hreflang", failures)
    require(GOOGLE_MAPS_URL in html, f"{relative_path} includes real Google Maps URL", failures)
    require(APPLE_MAPS_URL in html, f"{relative_path} includes Apple Maps URL", failures)

    if relative_path.startswith("en/"):
        require(
            any(href.startswith("/styles.css") for href in parser.links.values()),
            "English page loads root stylesheet",
            failures,
        )
        require('src="/script.js"' in html, "English page loads root script", failures)
        require(all(not src.startswith("assets/") for src in parser.img_srcs), "English page image paths are root-relative", failures)

    for key in ["og:title", "og:description", "og:url", "og:image", "og:site_name"]:
        require(bool(parser.meta.get(("property", key))), f"{relative_path} {key} exists", failures)

    for key in ["twitter:card", "twitter:title", "twitter:description", "twitter:image"]:
        require(bool(parser.meta.get(("name", key))), f"{relative_path} {key} exists", failures)

    require(bool(parser.json_ld_blocks), f"{relative_path} JSON-LD structured data exists", failures)
    for block in parser.json_ld_blocks:
        data = json.loads(block)
        graph = data.get("@graph", [])
        types = {item.get("@type") for item in graph if isinstance(item, dict)}
        require("FoodEstablishment" in types, f"{relative_path} JSON-LD includes FoodEstablishment", failures)
        require("WebSite" in types, f"{relative_path} JSON-LD includes WebSite", failures)
        require("WebPage" in types, f"{relative_path} JSON-LD includes WebPage", failures)
        require(not has_schema_type(data, "Product"), f"{relative_path} JSON-LD avoids Product markup without offer/review/rating data", failures)
        require(has_schema_type(data, "Menu"), f"{relative_path} JSON-LD includes menu structured data", failures)
        require(has_schema_type(data, "MenuItem"), f"{relative_path} JSON-LD includes menu items", failures)
        require(any(item.get("availableLanguage") == ["es-US", "en-US"] for item in graph if isinstance(item, dict)), f"{relative_path} JSON-LD lists available languages", failures)


def audit_html(failures: list[str]) -> None:
    audit_page("index.html", SITE_URL, "es-US", failures)
    audit_page("en/index.html", EN_URL, "en-US", failures)

    relative_path = "leesburg/index.html"
    path = ROOT / relative_path
    parser = HeadParser()
    html = path.read_text(encoding="utf-8")
    parser.feed(html)
    title = parser.title
    description = parser.meta.get(("name", "description"), "")

    require('<html lang="es-US">' in html, f"{relative_path} html lang is es-US", failures)
    require(bool(title), f"{relative_path} title tag exists", failures)
    require(len(title) <= MAX_TITLE, f"{relative_path} title is {len(title)} chars (<= {MAX_TITLE})", failures)
    require(50 <= len(description) <= MAX_META_DESCRIPTION, f"{relative_path} meta description is {len(description)} chars (50-{MAX_META_DESCRIPTION})", failures)
    require(parser.links.get("canonical") == LEESBURG_URL, f"{relative_path} canonical URL is correct", failures)
    require(parser.alternates.get("es-US") == LEESBURG_URL, f"{relative_path} has Leesburg es-US hreflang", failures)
    require(parser.alternates.get("en-US") == EN_LEESBURG_URL, f"{relative_path} has Leesburg en-US hreflang", failures)
    require(parser.alternates.get("x-default") == LEESBURG_URL, f"{relative_path} has Leesburg x-default hreflang", failures)
    require(parser.meta.get(("property", "og:url")) == LEESBURG_URL, f"{relative_path} Open Graph URL is correct", failures)
    require('data-expire-after="2026-07-30"' in html, f"{relative_path} special closure has an expiration date", failures)
    require("10:00 a.m. – 8:00 p.m." in html, f"{relative_path} includes Leesburg hours", failures)
    require("Cerrado a partir del 15 de agosto" in html, f"{relative_path} includes Saturday closure", failures)
    require('src="/leesburg/script.js"' in html, f"{relative_path} loads its script", failures)
    require('href="/leesburg/styles.css' in html, f"{relative_path} loads its stylesheet", failures)
    require('href="/en/leesburg/"' in html and 'data-target-lang="en"' in html, f"{relative_path} links to English", failures)
    require(bool(parser.json_ld_blocks), f"{relative_path} JSON-LD structured data exists", failures)

    for block in parser.json_ld_blocks:
        data = json.loads(block)
        require(has_schema_type(data, "FoodEstablishment"), f"{relative_path} JSON-LD includes FoodEstablishment", failures)
        require(has_schema_type(data, "WebPage"), f"{relative_path} JSON-LD includes WebPage", failures)
        require(has_schema_type(data, "Menu"), f"{relative_path} JSON-LD includes menu structured data", failures)
        require(has_schema_type(data, "MenuItem"), f"{relative_path} JSON-LD includes menu items", failures)

    relative_path = "en/leesburg/index.html"
    path = ROOT / relative_path
    parser = HeadParser()
    html = path.read_text(encoding="utf-8")
    parser.feed(html)
    title = parser.title
    description = parser.meta.get(("name", "description"), "")

    require('<html lang="en-US">' in html, f"{relative_path} html lang is en-US", failures)
    require(bool(title), f"{relative_path} title tag exists", failures)
    require(len(title) <= MAX_TITLE, f"{relative_path} title is {len(title)} chars (<= {MAX_TITLE})", failures)
    require(50 <= len(description) <= MAX_META_DESCRIPTION, f"{relative_path} meta description is {len(description)} chars (50-{MAX_META_DESCRIPTION})", failures)
    require(parser.links.get("canonical") == EN_LEESBURG_URL, f"{relative_path} canonical URL is correct", failures)
    require(parser.alternates.get("es-US") == LEESBURG_URL, f"{relative_path} has Leesburg es-US hreflang", failures)
    require(parser.alternates.get("en-US") == EN_LEESBURG_URL, f"{relative_path} has Leesburg en-US hreflang", failures)
    require(parser.alternates.get("x-default") == LEESBURG_URL, f"{relative_path} has Leesburg x-default hreflang", failures)
    require(parser.meta.get(("property", "og:url")) == EN_LEESBURG_URL, f"{relative_path} Open Graph URL is correct", failures)
    require('data-expire-after="2026-07-30"' in html, f"{relative_path} special closure has an expiration date", failures)
    require("10:00 a.m. – 8:00 p.m." in html, f"{relative_path} includes Leesburg hours", failures)
    require("Closed starting August 15" in html, f"{relative_path} includes Saturday closure", failures)
    require('src="/leesburg/script.js"' in html, f"{relative_path} loads its script", failures)
    require('href="/leesburg/styles.css' in html, f"{relative_path} loads its stylesheet", failures)
    require('href="/leesburg/"' in html and 'data-target-lang="es"' in html, f"{relative_path} links to Spanish", failures)
    require(bool(parser.json_ld_blocks), f"{relative_path} JSON-LD structured data exists", failures)

    for block in parser.json_ld_blocks:
        data = json.loads(block)
        require(has_schema_type(data, "FoodEstablishment"), f"{relative_path} JSON-LD includes FoodEstablishment", failures)
        require(has_schema_type(data, "WebPage"), f"{relative_path} JSON-LD includes WebPage", failures)
        require(has_schema_type(data, "Menu"), f"{relative_path} JSON-LD includes menu structured data", failures)
        require(has_schema_type(data, "MenuItem"), f"{relative_path} JSON-LD includes menu items", failures)


def audit_robots(failures: list[str]) -> None:
    robots = (ROOT / "robots.txt").read_text(encoding="utf-8")
    for token in ["Googlebot", "Bingbot", "OAI-SearchBot", "GPTBot", "ChatGPT-User", "Google-Extended"]:
        require(f"User-agent: {token}" in robots, f"robots.txt includes {token}", failures)
    require("Sitemap: https://tutifrutsy.com/sitemap.xml" in robots, "robots.txt links sitemap", failures)


def audit_sitemap(failures: list[str]) -> None:
    tree = ET.parse(ROOT / "sitemap.xml")
    root = tree.getroot()
    namespace = {"sm": "http://www.sitemaps.org/schemas/sitemap/0.9"}
    locs = [item.text for item in root.findall(".//sm:loc", namespace)]
    for url in [SITE_URL, EN_URL, LEESBURG_URL, EN_LEESBURG_URL, f"{SITE_URL}llms.txt", f"{SITE_URL}llms-full.txt"]:
        require(url in locs, f"sitemap includes {url}", failures)


def audit_llms(failures: list[str]) -> None:
    for filename in ["llms.txt", "llms-full.txt"]:
        path = ROOT / filename
        require(path.exists(), f"{filename} exists", failures)
        text = path.read_text(encoding="utf-8")
        require("Tutifrutsy" in text, f"{filename} names Tutifrutsy", failures)
        require("46859 Leesburg Pike" in text, f"{filename} includes address", failures)
        require("10:00 AM - 9:30 PM" in text, f"{filename} includes hours", failures)
        require("10:00 AM - 8:00 PM" in text, f"{filename} includes Leesburg hours", failures)
        require(LEESBURG_URL in text, f"{filename} includes Leesburg page", failures)
        require(EN_LEESBURG_URL in text, f"{filename} includes English Leesburg page", failures)
        require("https://tutifrutsy.com/en/" in text, f"{filename} includes English URL", failures)
        require(GOOGLE_MAPS_URL in text, f"{filename} includes Google Maps URL", failures)
        require(APPLE_MAPS_URL in text, f"{filename} includes Apple Maps URL", failures)


def main() -> int:
    failures: list[str] = []
    audit_html(failures)
    audit_robots(failures)
    audit_sitemap(failures)
    audit_llms(failures)
    if failures:
        print(f"\n{len(failures)} SEO audit check(s) failed.")
        return 1
    print("\nAll SEO audit checks passed.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
