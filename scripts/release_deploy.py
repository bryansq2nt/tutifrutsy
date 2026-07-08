#!/usr/bin/env python3
"""Commit, push, deploy, verify, and submit IndexNow for Tutifrutsy."""

from __future__ import annotations

import argparse
import datetime as dt
import subprocess
import sys
import urllib.error
import urllib.request
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
PUBLIC_URLS = [
    "https://tutifrutsy.com/",
    "https://tutifrutsy.com/en/",
    "https://tutifrutsy.com/robots.txt",
    "https://tutifrutsy.com/sitemap.xml",
    "https://tutifrutsy.com/llms.txt",
    "https://tutifrutsy.com/llms-full.txt",
]


class ReleaseError(RuntimeError):
    pass


def run(command: list[str], *, check: bool = True) -> subprocess.CompletedProcess[str]:
    print("$ " + " ".join(command))
    result = subprocess.run(command, cwd=ROOT, text=True, capture_output=True)
    if result.stdout:
        print(result.stdout, end="")
    if result.stderr:
        print(result.stderr, end="", file=sys.stderr)
    if check and result.returncode != 0:
        raise ReleaseError(f"Command failed with exit code {result.returncode}: {' '.join(command)}")
    return result


def git_output(command: list[str]) -> str:
    return run(command).stdout.strip()


def has_git_remote() -> bool:
    result = run(["git", "remote"], check=False)
    remotes = [line.strip() for line in result.stdout.splitlines() if line.strip()]
    return bool(remotes)


def has_changes() -> bool:
    return bool(git_output(["git", "status", "--porcelain"]))


def current_branch() -> str:
    branch = git_output(["git", "branch", "--show-current"])
    if not branch:
        raise ReleaseError("Cannot push from detached HEAD. Check out a branch first.")
    return branch


def commit_and_push(message: str) -> None:
    branch = current_branch()
    if not has_git_remote():
        raise ReleaseError("No git remote is configured. Add an origin remote before running release deploy.")

    if has_changes():
        run(["git", "add", "-A"])
        run(["git", "commit", "-m", message])
    else:
        print("No local changes to commit.")

    upstream = run(["git", "rev-parse", "--abbrev-ref", "--symbolic-full-name", "@{u}"], check=False)
    if upstream.returncode == 0:
        run(["git", "push"])
    else:
        run(["git", "push", "-u", "origin", branch])


def indexnow_key_url() -> str:
    candidates: list[Path] = []
    for path in ROOT.glob("*.txt"):
        if path.name in {"llms.txt", "llms-full.txt"}:
            continue
        content = path.read_text(encoding="utf-8").strip()
        if path.stem == content and 8 <= len(content) <= 128:
            candidates.append(path)
    if len(candidates) != 1:
        names = ", ".join(path.name for path in candidates) or "none"
        raise ReleaseError(f"Expected exactly one IndexNow key file, found: {names}")
    return f"https://tutifrutsy.com/{candidates[0].name}"


def fetch_url(url: str) -> tuple[int, str]:
    request = urllib.request.Request(url, method="GET", headers={"User-Agent": "TutifrutsyReleaseDeploy/1.0"})
    try:
        with urllib.request.urlopen(request, timeout=30) as response:
            body = response.read().decode("utf-8", errors="replace")
            return response.status, body
    except urllib.error.HTTPError as exc:
        body = exc.read().decode("utf-8", errors="replace")
        return exc.code, body


def verify_public_urls() -> None:
    urls = [*PUBLIC_URLS, indexnow_key_url()]
    for url in urls:
        status, body = fetch_url(url)
        if not 200 <= status < 400:
            raise ReleaseError(f"Public verification failed for {url}: HTTP {status}")
        print(f"OK public: HTTP {status} {url}")

        if url.endswith("robots.txt") and "Sitemap: https://tutifrutsy.com/sitemap.xml" not in body:
            raise ReleaseError("robots.txt is live but does not include the sitemap URL.")
        if url.endswith("sitemap.xml"):
            if "https://tutifrutsy.com/" not in body:
                raise ReleaseError("sitemap.xml is live but does not include the Spanish home page URL.")
            if "https://tutifrutsy.com/en/" not in body:
                raise ReleaseError("sitemap.xml is live but does not include the English page URL.")
        if url.endswith("llms.txt") and "Tutifrutsy" not in body:
            raise ReleaseError("llms.txt is live but does not include Tutifrutsy content.")
        if url.rsplit("/", 1)[-1].endswith(".txt") and "llms" not in url:
            key = url.rsplit("/", 1)[-1].removesuffix(".txt")
            if body.strip() != key:
                raise ReleaseError("IndexNow key file is live but its content does not match the file name.")


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Run the full Tutifrutsy release deploy flow.")
    parser.add_argument(
        "-m",
        "--message",
        default=f"chore: update Tutifrutsy site {dt.date.today().isoformat()}",
        help="Git commit message to use when there are local changes.",
    )
    parser.add_argument("--prune", action="store_true", help="Pass --prune to the FTP deploy script.")
    parser.add_argument("--force", action="store_true", help="Pass --force to the FTP deploy script.")
    return parser.parse_args()


def main() -> int:
    args = parse_args()
    try:
        print("Step 1/5: local SEO audit")
        run([sys.executable, "scripts/seo_audit.py"])

        print("Step 2/5: git commit and push")
        commit_and_push(args.message)

        print("Step 3/5: FTP deploy")
        deploy_command = [sys.executable, "scripts/deploy_ftp.py"]
        if args.force:
            deploy_command.append("--force")
        if args.prune:
            deploy_command.append("--prune")
        run(deploy_command)

        print("Step 4/5: public verification")
        verify_public_urls()

        print("Step 5/5: IndexNow submission")
        run([sys.executable, "scripts/submit_indexnow.py", "--from-sitemap"])
    except ReleaseError as exc:
        print(f"Release deploy stopped: {exc}", file=sys.stderr)
        return 1
    print("Release deploy completed: committed, pushed, deployed, verified, and submitted to IndexNow.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
