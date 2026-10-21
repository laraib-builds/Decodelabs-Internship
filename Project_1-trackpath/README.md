# trackpath

A mobile-first web page that helps beginners pick a computer science track and find free courses for it. Built with plain HTML, CSS and JavaScript. No frameworks, no build step.

## Files

| File | Job |
| --- | --- |
| `index.html` | Page structure and content |
| `style.css` | Design tokens, layout, responsive rules |
| `script.js` | Track data, filtering, progress saving |

## Run it

Open `index.html` in any browser. For a local server: `python -m http.server`, then visit `localhost:8000`.

To publish for free, push the folder to GitHub and turn on GitHub Pages in the repo settings.

## What it does

- Lists six tracks, each with three free resources.
- Filters tracks by level (Beginner or Intermediate).
- Lets you tick off finished resources. Progress saves in `localStorage`.
- Has one clear call to action: **Browse the tracks**, with **Open Foundations** as a second step.

## Layout

- **Mobile first:** the base CSS is the phone layout (one column).
- **Tablet** (`min-width: 640px`): two-column track grid, three-column steps.
- **Desktop** (`min-width: 1024px`): hero splits into two columns, three-column track grid.
- **Flexbox:** header, filter chips, buttons, footer.
- **Grid:** hero, track cards, steps, call-to-action box.

## 2025 practices used

- Semantic landmarks (`header`, `main`, `section`, `footer`), skip link, one `h1`.
- Keyboard focus styles (`:focus-visible`) and 44px touch targets.
- ARIA only where needed: `aria-expanded`, `aria-pressed`, `aria-live`, `role="progressbar"`.
- Colour contrast checked against WCAG AA.
- `prefers-reduced-motion` respected.
- Modern CSS: custom properties, `clamp()`, `dvh`, `color-mix()`, safe-area insets for notched phones.
- External links use `rel="noopener noreferrer"`.

## Add your own track

Open `script.js` and copy one object in the `TRACKS` array. Change its `id`, `name`, `level`, `color` and `resources`. The page updates by itself.

## Concepts to study in the code

1. **Event delegation:** one click listener on the grid handles every card.
2. **Rendering from data:** HTML is generated from the `TRACKS` array.
3. **State and persistence:** a `Set` of finished ids, saved with `localStorage` inside `try/catch`.
4. **CSS custom properties:** each card sets `--tc` and its tints follow.
