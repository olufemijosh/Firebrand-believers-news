# Firebrand Believers News — Netlify + Admin CMS edition

This edition keeps the public site on Netlify and adds a GitHub-backed content editor using Pages CMS.

## What is included
- Responsive blog with article images, search, categories, article reader and social sharing.
- Articles stored as Markdown files in `content/posts/`.
- `.pages.yml` configures the Pages CMS article editor, image uploads, category selector and publish toggle.
- `build.js` turns Markdown articles into `dist/articles.json` during each Netlify build.
- Netlify can automatically rebuild the site after a CMS change is committed to GitHub.

## Step 1 — Put these files in GitHub
1. Download and unzip this package.
2. Open your GitHub account and create a repository named `firebrand-believers-news` (or use an existing repository if that is where the current site lives).
3. Upload the *contents* of this folder into the repository root, including the hidden `.pages.yml` file and the `content` folder.
4. Commit the files to your main branch.

If you already deployed the previous version, replace the old website files with these and keep any custom domain settings in Netlify.

## Step 2 — Connect the repository to Netlify
1. Sign in to Netlify.
2. Choose **Add new project → Import an existing project → GitHub**.
3. Authorize Netlify and select the `firebrand-believers-news` repository.
4. Set **Build command** to `node build.js`.
5. Set **Publish directory** to `dist`.
6. Deploy the site. Netlify will show the public `netlify.app` URL when it finishes.
7. In Netlify's site settings, confirm the repository and production branch are connected. Future commits to that branch should trigger a new deploy.

Official guide: https://docs.netlify.com/start/quickstarts/deploy-from-repository/

## Step 3 — Open the editor dashboard
1. Visit https://pagescms.org/ and sign in with the GitHub account that owns or has write access to the website repository.
2. Select the `firebrand-believers-news` repository and its production branch (usually `main`).
3. Pages CMS reads the `.pages.yml` file and displays the **Articles** collection.
4. Create or edit an article, upload a featured image, choose its category, and set **Published on website**.
5. Save/commit the change to GitHub. Netlify should automatically rebuild and publish the change.

The dashboard is hosted separately by Pages CMS; your public website remains on Netlify. This approach does not depend on the deprecated Netlify Git Gateway.

## Security notes
- Sign in only through the official Pages CMS site and verify the domain before authorizing GitHub.
- Give repository write access only to people you trust. Anyone with write access to the production branch may be able to change the public site.
- Do not put passwords, GitHub tokens, or other secrets into this repository.
- Use a strong, unique GitHub password and enable two-factor authentication on GitHub.
- Pages CMS access is controlled by GitHub sign-in and repository permissions; it is not a separate password stored in this website.
- The admin/editor URL is https://pagescms.org/ (choose your repo after signing in), not a private `/admin/` page on the public site.

## Editing and publishing articles
In Pages CMS, use the Articles collection:
- Headline: article title
- Category: Faith, Christian Living, News & Society, or Bible Study
- Publication date: date shown on the article
- Summary: short card excerpt
- Featured image: upload/select image (uploaded images are stored in `media/images`)
- Published on website: turn off to hide an article from the public listing
- Article body: main story

The sample articles are demonstration content. Replace them with your own writing and verify news claims before publishing.

## Local preview (optional)
Requires Node.js installed:
1. Run `node build.js`
2. Open `dist/index.html` in your browser.

## Notes
- This is a lightweight static blog, not a full database-driven platform. CMS saves content into GitHub, and Netlify rebuilds the public site.
- Build time depends on your Netlify account and plan limits. Check your account's current usage and pricing for the latest details.
