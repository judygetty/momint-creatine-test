# MoMint — momintcreatine.com

Two product pages, one brand, one domain. The sugar vs sugar-free test is
still live; the Mint Condition brand name is retired.

```
index.html             → Classic (sugar) — served at the domain root
sugar/index.html       → Classic (sugar) — same content, explicit path for ad links
sugar-free/index.html  → Sugar-free
assets/style.css       → shared stylesheet
assets/tracking.js     → shared UTM capture + form handler + tracking events
generate.py            → regenerates all three HTML files from one template —
                          edit copy here, not in the HTML files, so the two
                          variants can't drift out of parity
```

## Before you deploy

Same three tracking stubs and Formspree placeholder as before, now just
across two pages instead of four — see each page's `<head>` for `G-XXXXXXXXXX`
(GA4), `XXXXXXXXXXXXXXX` (Meta Pixel), `XXXXXXXXX` (Bing UET), and
`FORMSPREE_ENDPOINT` in `assets/tracking.js`.

Each page also has `<meta name="robots" content="noindex, nofollow">` and
the yellow `.dev-banner` strip — both intentional placeholders, remove both
right before you point ads at it.

## Deploy: GitHub + Cloudflare Pages

1. Unzip this folder, then from inside it:
   ```
   git init
   git add .
   git commit -m "MoMint launch pages"
   git branch -M main
   git remote add origin https://github.com/<your-username>/momint-creatine.git
   git push -u origin main
   ```
2. Cloudflare dashboard → **Workers & Pages → Create → Pages → Connect to Git** → select the repo.
3. Build settings: Framework preset **None**, build command blank, build output directory **`/`** (repo root — the pages reference `assets/` with relative paths, so it has to be root, not a subfolder).
4. Deploy, check the `*.pages.dev` preview URL works first.
5. **Custom domains** → add `momintcreatine.com`. If the domain's DNS isn't on Cloudflare yet, add it as a site in Cloudflare first (free plan) and update the nameservers at your registrar — then the custom-domain step is one click.
6. Once SSL provisions, check all three URLs:
   - `momintcreatine.com/`
   - `momintcreatine.com/sugar/`
   - `momintcreatine.com/sugar-free/`

## Alternative: Cloudflare Pages direct upload (no GitHub)

Dashboard → **Workers & Pages → Create → Pages → Upload assets**, drag this
folder in, deploy, then the same custom-domain step above. Works fine, but
every future edit means re-uploading by hand rather than me pushing a commit.
