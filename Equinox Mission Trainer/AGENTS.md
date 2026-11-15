# Project guidance

## Hard constraints

- Use plain HTML and CSS, React only for decorative visual components, and vanilla JavaScript for the game logic. Do not add a build step, backend, or database.
- The app must work by opening `index.html` locally and on GitHub Pages.
- All visible text must be in English.
- Do not use NASA logos, insignia, flags, or mission patches in code, images, or CSS.
- Keep the code simple and commented so beginner students can understand it.
- Use large buttons, high contrast, readable fonts, and layouts that work on phones and laptops.
- Every network call must have a timeout and a saved fallback. Do not add network calls until they are requested.
- Never store or send the player's astronaut name. Do not use photos or names of real people under 18.
- Keep the local React runtime limited to the visual layer, and do not add other libraries or features without a request.

## Working agreement

- Person A owns `js/app.js` (logic) on branch `feature/logica`.
- Person B owns `css/style.css`, `index.html`, `img/`, and `js/data.js` (design and content) on branch `feature/diseno-contenido`.
- `js/react-visuals.js` and `js/vendor/` are for React-based decorative visuals and their local runtime.
- Each person edits only their assigned files.
- Pull before each work session and commit often with clear messages.
- Codex works on one small task at a time and does not modify files outside that task.
- After each task, open the page in a browser, test it, then commit.
- Explain changes in simple words.
