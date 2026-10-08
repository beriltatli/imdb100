# 🎟️ 100 Films — Watchlist

A personal watchlist of 100 films, styled as a wall of cinema tickets.
Click a ticket to stamp it **WATCHED**, and track your progress.

![100 Films screenshot](assets/img/screenshot.png)

**Live demo:** `https://<your-username>.github.io/<repo-name>/`

## Features

- **Ticket grid** that adapts from wide desktop screens down to phones
- **Progress saved in your browser** (localStorage), kept in sync across open tabs
- **Search** by title or year (<kbd>/</kbd> focuses search, <kbd>Esc</kbd> clears it)
- **Filter** by status (all / to watch / watched) and by era; **sort** by year, runtime or title
- **🎲 Pick tonight's film**: picks a random unwatched film and lights up its ticket
- Progress bar, hours watched and remaining, and a per-era breakdown
- Four accent colors and a two-step reset
- Keyboard and screen-reader friendly; respects `prefers-reduced-motion`

No frameworks, no build step: plain HTML, CSS and JavaScript.

## Project structure

```
.
├── index.html            # Page markup
├── assets/
│   ├── css/style.css     # All styles
│   ├── js/films.js       # The film list (edit this to change the films)
│   ├── js/app.js         # App logic
│   └── img/              # Favicon, social preview image, README screenshot
├── .nojekyll             # Tells GitHub Pages to serve files as-is
└── README.md
```

## Run locally

Open `index.html` in a browser. That's it.

Or serve the folder if you prefer:

```sh
python3 -m http.server 8000
# then open http://localhost:8000
```

## Publish with GitHub Pages

1. Push this folder to a GitHub repository.
2. In the repo, go to **Settings → Pages**.
3. Under **Build and deployment**, choose **Deploy from a branch**, select `main` and `/ (root)`, then **Save**.
4. After a minute the site is live at `https://<your-username>.github.io/<repo-name>/`.

> For link previews (Slack, X, WhatsApp…) to show the image, change the `og:image` tag in
> `index.html` to the full URL, e.g. `https://<your-username>.github.io/<repo-name>/assets/img/og-image.png`.

## Customize

- **Films:** edit `assets/js/films.js`. Each entry is `["Title", year, runtimeInMinutes]`; tickets are numbered in array order.
- **Eras and their colors:** the `ERAS` list in the same file.
- **Accent colors:** the `ACCENTS` list at the top of `assets/js/app.js`.
- **Theme colors:** the CSS variables in `:root` at the top of `assets/css/style.css`.

## Credits

Fonts: [Big Shoulders Display](https://fonts.google.com/specimen/Big+Shoulders+Display),
[Archivo Narrow](https://fonts.google.com/specimen/Archivo+Narrow) and
[IBM Plex Mono](https://fonts.google.com/specimen/IBM+Plex+Mono) via Google Fonts.
