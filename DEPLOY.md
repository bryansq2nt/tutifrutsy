# Tutifrutsy Deploy

This project deploys the static site to SiteGround over FTP/FTPS using the same pattern as the Virginia Wired deploy workflow.

## FTP Settings From SiteGround

Current SiteGround FTP account details shown in Site Tools:

```text
Host: ftp.tutifrutsy.com
Username: admin@tutifrutsy.com
Port: 21
Home Path: /
```

Do not commit the FTP password. Keep it in `.deploy.env`, or leave it blank and the script will ask securely in the terminal.

## First-Time Setup

Copy the example env file:

```bash
cp .deploy.env.example .deploy.env
```

Then edit `.deploy.env` and set:

```text
FTP_PASSWORD=your-password-here
```

The deploy target is explicitly set to:

```text
/tutifrutsy.com/public_html
```

This avoids uploading into the SiteGround account root.

## Preview Deploy

Run a dry-run first:

```bash
python3 scripts/deploy_ftp.py --dry-run
```

The script will connect, list what would upload, and print the remote directory it is using.

## Deploy

```bash
python3 scripts/deploy_ftp.py
```

The script uploads only changed files from the public static site:

```text
index.html
styles.css
script.js
robots.txt
sitemap.xml
llms.txt
llms-full.txt
b8f6e1b7d2a5469aa9c01f2d7f1e6a43.txt
assets/
```

It excludes local docs, deploy scripts, Git files, `.DS_Store`, and `.deploy.env`.

## Optional Remote Cleanup

Normal deploy is non-destructive and does not delete remote-only files. That is safer for hosting folders and server files.

After a major rebuild, preview cleanup first:

```bash
python3 scripts/deploy_ftp.py --dry-run --prune
```

Only if the delete list looks safe, run:

```bash
python3 scripts/deploy_ftp.py --prune
```

Prune mode protects `.env`, `.ftpquota`, `.well-known`, `cgi-bin`, `logs`, and `webstats`.

## If FTPS Fails

The script uses explicit FTPS by default so credentials are not sent as plain FTP. If SiteGround rejects FTPS for this account, set this in `.deploy.env`:

```text
FTP_TLS=0
```

## After Deploy: Indexing

Before deploying, run the local SEO audit:

```bash
python3 scripts/seo_audit.py
```

After deploying, verify the public indexing files:

```bash
curl -I -L https://tutifrutsy.com/robots.txt
curl -I -L https://tutifrutsy.com/sitemap.xml
curl -I -L https://tutifrutsy.com/llms.txt
curl -I -L https://tutifrutsy.com/b8f6e1b7d2a5469aa9c01f2d7f1e6a43.txt
```

Once the IndexNow key file returns HTTP 200, submit the sitemap URLs:

```bash
python3 scripts/submit_indexnow.py --from-sitemap
```

## Full Release Flow

Use this command for the normal production release path:

```bash
python3 scripts/release_deploy.py -m "chore: update Tutifrutsy site"
```

The release script intentionally runs in this order:

1. Local SEO audit.
2. Git add, commit, and push.
3. FTP deploy.
4. Public URL verification.
5. IndexNow sitemap submission.

IndexNow is not called until the deploy finishes and the live URLs respond successfully. If Git push fails or the site verification fails, the script stops.
