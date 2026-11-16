# wanlok-scraper-react

A React + Vite web page for the scraper app. In dev, `/api` is proxied to the phone (see `vite.config.ts`). The API is served by `~/Files/Projects/wanlok-scraper-kotlin`.

## Rules

- **Colours:** write every colour as a 6-character uppercase hex, e.g. `#EEEEEE`. No 3-character hex, no lowercase, no `rgb()` or named colours.
- **HTML:** it must be valid per the HTML spec, e.g. only phrasing content inside `<summary>`. Use a `<span>` with `display: block`, not a `<div>`.
- **Components:** use arrow functions and named exports, no default exports.
- **Wrappers:** the `W` prefix (`WButton`, `WInput`, ...) is for small reusable wrapper components in `src/components`.
- **Braces:** put braces on every `if`, even a one-line body.
- **Styling:** no UI library such as MUI. Use plain HTML, CSS and JavaScript.
- **Edits:** make code changes with the Edit tool so each diff can be approved. Don't edit files through shell commands such as `sed`.
