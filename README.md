# LazyCopper

A personal blog / profile theme for [Hugo](https://gohugo.io), built with [Tailwind CSS v4](https://tailwindcss.com).

Home page with a profile intro and paginated posts, archive, tags, client-side search, light/dark mode,
Open Graph / Twitter / JSON-LD metadata and Google Analytics 4.

## Requirements

- Hugo 0.146+
- Node.js, with Tailwind installed in the site root:

```sh
npm install -D tailwindcss @tailwindcss/cli @tailwindcss/typography
```

## Site configuration

```yaml
theme: lazycopper

security:
  exec:
    allow: ['^(dart-)?sass$', '^go$', '^git$', '^node$', '^npx$', '^postcss$', '^tailwindcss$']

build:
  buildStats:
    enable: true
  cachebusters:
    - source: assets/notwatching/hugo_stats\.json
      target: css
    - source: (postcss|tailwind)\.config\.js
      target: css

module:
  mounts:
    - source: assets
      target: assets
    - disableWatch: true
      source: hugo_stats.json
      target: assets/notwatching/hugo_stats.json

outputs:
  home: [HTML, RSS, JSON]
```

### Parameters

```yaml
params:
  env: production            # robots "index, follow" only in production builds
  description: "..."
  author: Your Name
  keywords: [blog, software]
  images: ["cover.png"]      # default social image
  defaultTheme: auto         # auto | light | dark
  disableThemeToggle: false
  disableScrollToTop: false
  ShowBreadCrumbs: true
  ShowPostNavLinks: true
  ShowReadingTime: true
  ShowAuthor: true          # author name in post meta (still used for SEO / JSON-LD)
  ShowCodeCopyButtons: true
  ShowToc: false
  mainSections: [posts]
  comments: false
  footer:
    text: "Built with [Hugo](https://gohugo.io)"
    note: "Opinions expressed here are my own"  # optional disclaimer under the footer line
  homeInfoParams:
    Title: "Hi there"
    Subtitle: "Optional tagline"
    ProfilePic: "https://..."
    Content: "Markdown bio"
  socialIcons:
    - name: github
      url: "https://github.com/you"

services:
  googleAnalytics:
    id: G-XXXXXXXXXX
```

Social icons: `github`, `gitlab`, `linkedin`, `x`, `twitter`, `mastodon`, `bluesky`, `stackoverflow`,
`youtube`, `instagram`, `facebook`, `email`, `rss`, `website`.

### Pages

- Archive: `content/archive.md` with `layout: archives`
- Search: `content/search.md` with `layout: search`
- Tags: `/tags/`

### Overrides

`layouts/_partials/extend_head.html`, `extend_footer.html` and `comments.html` are empty hooks you can
override in your site.
