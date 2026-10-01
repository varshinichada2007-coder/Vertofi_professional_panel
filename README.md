# React + TypeScript + Vite

## Netlify deployment security

Set `MONGODB_URI` and `FAST2SMS_API_KEY` in Netlify's environment variable settings, with the Functions scope where available. These credentials are read by server-side code and must never use a `VITE_` prefix or be committed to the repository. Local `.env` files are ignored by Git; example files must contain placeholders only.

Secret scanning remains enabled. The `SECRETS_SCAN_OMIT_KEYS` setting in `netlify.toml` excludes only the non-sensitive database name (`MONGODB_DB_NAME`) and public configuration settings (`VITE_ENABLE_2FA` and `VITE_OTP_EXPIRY_SECONDS`). Database-name defaults and ordinary application literals can otherwise match these environment values. Neither the database connection URI nor SMS API credentials are excluded, and no repository or build-output paths are exempted.

Netlify serves `/.netlify/functions/` endpoints directly; no redirect from that reserved path is needed. The SPA fallback remains configured for frontend routes.

If scanning still blocks a deployment, review the detection entries immediately before the error summary in the deploy log. Remove any exposed credential from the reported files and rotate it with its provider if it was committed or published. Do not disable scanning or add credential variables to the exclusion list.

This template provides a minimal setup to get React working in Vite with HMR and some Oxlint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the Oxlint configuration

If you are developing a production application, we recommend enabling type-aware lint rules by installing `oxlint-tsgolint` and editing `.oxlintrc.json`:

```json
{
  "$schema": "./node_modules/oxlint/configuration_schema.json",
  "plugins": ["react", "typescript", "oxc"],
  "options": {
    "typeAware": true
  },
  "rules": {
    "react/rules-of-hooks": "error",
    "react/only-export-components": ["warn", { "allowConstantExport": true }]
  }
}
```

See the [Oxlint rules documentation](https://oxc.rs/docs/guide/usage/linter/rules) for the full list of rules and categories.
