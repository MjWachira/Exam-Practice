# Server — Exam Practice

This folder contains the Node/Express backend for the Exam Practice application.

## Purpose

- Serve API endpoints for authentication, question/exam data, and session recording.
- Handle Excel uploads and import questions into the local JSON store.

## Quick Start

1. Install dependencies:

```bash
cd server
npm install
```

2. Run the server:

```bash
npm start
# or: node server.js
```

By default the server listens on `PORT` (check `server.js`); common default is `3000`.

## API Routes (overview)

- `/api/auth` — Authentication endpoints (login, register).
- `/api/exams` — CRUD operations for exams and questions.
- `/api/sessions` — Start/stop exam sessions and record results.

See the route handlers in the `routes/` folder for implementation details.

## Data Storage

- Persistent data lives in `data/db.json` (local JSON file).
- Uploaded Excel files are stored under `data/uploads/` and processed by `services/excelService.js`.

## Environment Variables

- `PORT` — Port to run the server on.
- Any other server-specific variables are documented in `server.js` or `server/package.json` scripts.

## Development Tips

- Use `nodemon` to auto-restart the server during development:

```bash
npm install -g nodemon
nodemon server.js
```

- Check `routes/` and `services/` when adding new endpoints or processing logic.

## Important Files

- `server.js` — server entry point
- `routes/` — Express route handlers (`authRoutes.js`, `examRoutes.js`, `sessionRoutes.js`)
- `services/` — helper services (`dbService.js`, `excelService.js`)
- `data/db.json` — local data store

## Contributing

Add/modify routes or services, run the server locally to test, and open a PR with focused changes.
