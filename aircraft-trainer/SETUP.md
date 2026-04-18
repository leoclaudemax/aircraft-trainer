# Deploy to your own GitHub Pages site

You don't need Node.js installed. GitHub will build the app for you in the cloud.

## One-time setup (10 minutes)

### 1. Create the GitHub repo

1. Go to <https://github.com/new>
2. **Repository name:** `aircraft-trainer` (or anything you like)
3. **Visibility:** Public (required for free GitHub Pages on a personal account)
4. Leave everything else unchecked. Click **Create repository**.
5. On the next page, GitHub shows a URL like `https://github.com/YOUR-USERNAME/aircraft-trainer.git` — copy it.

### 2. Push the code

Open Terminal and paste these commands one block at a time. Replace `YOUR-USERNAME` with your GitHub username.

```bash
cd ~/Documents/Leo/aircraft-trainer
git remote add origin https://github.com/YOUR-USERNAME/aircraft-trainer.git
git branch -M main
git push -u origin main
```

If git asks for credentials, GitHub will open a browser for you to log in (or you can use a Personal Access Token — Settings → Developer settings → Tokens (classic) → "repo" scope).

### 3. Turn on GitHub Pages

1. In your new GitHub repo, click **Settings** (top right).
2. In the left sidebar, click **Pages**.
3. Under **Build and deployment** → **Source**, choose **GitHub Actions**.
4. Done. No other settings needed.

### 4. Wait for the first build

1. Click the **Actions** tab in your repo.
2. You'll see a workflow called **"Build and deploy to GitHub Pages"** running. It takes ~1–2 minutes.
3. When it finishes (green check), refresh **Settings → Pages**. The URL will appear at the top, something like:

   `https://YOUR-USERNAME.github.io/aircraft-trainer/`

That's your app. Bookmark it on your phone and laptop.

---

## Updating the app

Whenever the code changes:

```bash
cd ~/Documents/Leo/aircraft-trainer
git add -A
git commit -m "your message"
git push
```

GitHub rebuilds and redeploys in ~1 minute. No other steps.

---

## Notes

- **Progress is per-browser.** Your data lives in `localStorage` — separate per device. Use **Settings → Export backup** to move data between phone and laptop.
- **Aircraft images** are fetched live from Wikipedia/Wikimedia. They cache in your browser after the first view.
- **The repo can be public, your training data stays private** — it's never sent anywhere, just stored in your browser.
- **Custom domain:** if you own a domain, GitHub Pages can serve from it. Settings → Pages → Custom domain.
