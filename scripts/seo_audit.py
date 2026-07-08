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


def audit_html(failures: list[str]) -> None:
    parser = HeadParser()
    parser.feed((ROOT / "index.html").read_text(encoding="utf-8"))

    title = parser.title
    description = parser.meta.get(("name", "description"), "")
    robots = parser.meta.get(("name", "robots"), "")
    canonical = parser.links.get("canonical", "")

    require(bool(title), "title tag exists", failures)
    require(len(title) <= MAX_TITLE, f"title is {len(title)} chars (<= {MAX_TITLE})", failures)
    require(bool(description), "meta description exists", failures)
    require(
        50 <= len(description) <= MAX_META_DESCRIPTION,
        f"meta description is {len(description)} chars (50-{MAX_META_DESCRIPTION})",
        failures,
    )
    require("index" in robots and "follow" in robots, "robots meta allows indexing and following", failures)
    require(canonical == SITE_URL, "canonical URL is the production home page", failures)

    for key in ["og:title", "og:description", "og:url", "og:image", "og:site_name"]:
        require(bool(parser.meta.get(("property", key))), f"{key} exists", failures)

    for key in ["twitter:card", "twitter:title", "twitter:description", "twitter:image"]:
        require(bool(parser.meta.get(("name", key))), f"{key} exists", failures)

    require(bool(parser.json_ld_blocks), "JSON-LD structured data exists", failures)
    for block in parser.json_ld_blocks:
        data = json.loads(block)
        graph = data.get("@graph", [])
        types = {item.get("@type") for item in graph if isinstance(item, dict)}
        require("FoodEstablishment" in types, "JSON-LD includes FoodEstablishment", failures)
        require("WebSite" in types, "JSON-LD includes WebSite", failures)
        require("WebPage" in types, "JSON-LD includes WebPage", failures)


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
    for url in [SITE_URL, f"{SITE_URL}llms.txt", f"{SITE_URL}llms-full.txt"]:
        require(url in locs, f"sitemap includes {url}", failures)


def audit_llms(failures: list[str]) -> None:
    for filename in ["llms.txt", "llms-full.txt"]:
        path = ROOT / filename
        require(path.exists(), f"{filename} exists", failures)
        text = path.read_text(encoding="utf-8")
        require("Tutifrutsy" in text, f"{filename} names Tutifrutsy", failures)
        require("46859 Leesburg Pike" in text, f"{filename} includes address", failures)
        require("10:00 AM - 9:30 PM" in text, f"{filename} includes hours", failures)


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
