#!/usr/bin/env python3
"""Submit Tutifrutsy URLs to IndexNow after deployment."""

from __future__ import annotations

import argparse
import json
import sys
import urllib.error
import urllib.request
import xml.etree.ElementTree as ET
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
DEFAULT_HOST = "tutifrutsy.com"
DEFAULT_ENDPOINT = "https://api.indexnow.org/IndexNow"


def find_key_file() -> Path:
    candidates: list[Path] = []
    for path in ROOT.glob("*.txt"):
        if path.name in {"llms.txt", "llms-full.txt"}:
            continue
        content = path.read_text(encoding="utf-8").strip()
        if path.stem == content and 8 <= len(content) <= 128:
            candidates.append(path)
    if not candidates:
        raise FileNotFoundError("No IndexNow key file found at the site root")
    if len(candidates) > 1:
        names = ", ".join(path.name for path in candidates)
        raise RuntimeError(f"Multiple possible IndexNow key files found: {names}")
    return candidates[0]


def urls_from_sitemap(path: Path) -> list[str]:
    tree = ET.parse(path)
    root = tree.getroot()
    namespace = {"sm": "http://www.sitemaps.org/schemas/sitemap/0.9"}
    return [node.text.strip() for node in root.findall(".//sm:loc", namespace) if node.text]


def urls_from_file(path: Path) -> list[str]:
    urls: list[str] = []
    for raw_line in path.read_text(encoding="utf-8").splitlines():
        line = raw_line.strip()
        if line and not line.startswith("#"):
            urls.append(line)
    return urls


def unique_urls(urls: list[str]) -> list[str]:
    seen: set[str] = set()
    result: list[str] = []
    for url in urls:
        if url not in seen:
            seen.add(url)
            result.append(url)
    return result


def submit(endpoint: str, payload: dict[str, object]) -> tuple[int, str]:
    data = json.dumps(payload).encode("utf-8")
    request = urllib.request.Request(
        endpoint,
        data=data,
        headers={"Content-Type": "application/json; charset=utf-8"},
        method="POST",
    )
    try:
        with urllib.request.urlopen(request, timeout=30) as response:
            return response.status, response.read().decode("utf-8", errors="replace")
    except urllib.error.HTTPError as exc:
        return exc.code, exc.read().decode("utf-8", errors="replace")


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Submit Tutifrutsy URLs to IndexNow.")
    parser.add_argument("--host", default=DEFAULT_HOST)
    parser.add_argument("--endpoint", default=DEFAULT_ENDPOINT)
    parser.add_argument("--from-sitemap", action="store_true", help="Submit every URL in sitemap.xml")
    parser.add_argument("--url", action="append", default=[], help="Submit one URL; can be repeated")
    parser.add_argument("--urls-file", type=Path, help="Submit URLs listed in a text file")
    parser.add_argument("--dry-run", action="store_true")
    return parser.parse_args()


def main() -> int:
    args = parse_args()
    key_file = find_key_file()
    key = key_file.read_text(encoding="utf-8").strip()

    urls: list[str] = []
    if args.from_sitemap:
        urls.extend(urls_from_sitemap(ROOT / "sitemap.xml"))
    if args.urls_file:
        urls.extend(urls_from_file(args.urls_file))
    urls.extend(args.url)
    urls = unique_urls(urls)

    if not urls:
        print("No URLs selected. Use --from-sitemap, --url, or --urls-file.", file=sys.stderr)
        return 2

    payload = {
        "host": args.host,
        "key": key,
        "keyLocation": f"https://{args.host}/{key_file.name}",
        "urlList": urls,
    }

    if args.dry_run:
        print(json.dumps(payload, indent=2, ensure_ascii=False))
        return 0

    status, body = submit(args.endpoint, payload)
    print(f"HTTP {status}: submitted {len(urls)} URL(s)")
    if body:
        print(body)
    return 0 if 200 <= status < 300 else 1


if __name__ == "__main__":
    sys.exit(main())
