# Movies App

This project is a simple React application bootstrapped with Vite. It includes a basic movie search UI and demonstrates how to configure **Vite**, **Vitest**, and **React Testing Library** together.

---

## 🚀 Getting Started

### Install dependencies

```bash
npm install
```

### Run the application

```bash
npm run dev
```

Open your browser and navigate to `http://localhost:5173` (or the URL shown in the terminal) to view the app with hot‑module reloading.

---

## 🧪 Running Tests

This project uses **Vitest** as the test runner together with **React Testing Library** and **@testing-library/user-event** for DOM interactions.

### Execute tests

```bash
npm test
# or to run once and exit
npm run test:ci
```

Watch mode is enabled by default; the command will re-run tests when files change.

### Test files

All test files live under the `tests/` directory and use the `.test.jsx` extension. Example components covered include `Counter`, `Genre`, and `Search`.

---

## ⚙️ Test Configuration

When setting up testing for a React + Vite project there are a few important pieces:

1. **Vitest**
   - Installed as a dev dependency (`vitest`) and configured in `vite.config.js`.
   - `@testing-library/jest-dom` is included via `setupTests.js` to provide convenient DOM matchers.

2. **React Testing Library**
   - Provides utilities to render React components and query the DOM in tests.
   - Installed via `npm install --save-dev @testing-library/react`

3. **User Event**
   - To simulate user interactions (clicks, typing, etc.) we added `@testing-library/user-event`.

4. **jsdom environment**
   - Vitest defaults to `node` environment; the config overrides this to `jsdom` so that browser APIs are available.
   - This change is made in `vite.config.js`:
     ```js
     test: {
       environment: 'jsdom',
       globals: true,
       setupFiles: './tests/setupTests.js',
     }
     ```

5. **Setup file**
   - `tests/setupTests.js` imports `@testing-library/jest-dom` to enhance Jest-like assertions such as `toBeInTheDocument()`.

By combining these packages and configurations you can run tests seamlessly alongside your development workflow. The `package.json` includes scripts for convenience:

```json
"scripts": {
  "dev": "vite",
  "build": "vite build",
  "preview": "vite preview",
  "test": "vitest",
  "test:ci": "vitest --run --coverage"
}
```

---

## 📦 Dependencies Summary

- **react**, **react-dom** – core library
- **vite** – build tool
- **vitest** – test runner
- **@testing-library/react** – React Testing Library
- **@testing-library/jest-dom** – custom DOM matchers
- **@testing-library/user-event** – for interacting with rendered components

Dev dependencies and configurations were added so that tests run with Vite's native ESM support and leverage the fast startup of Vitest.
