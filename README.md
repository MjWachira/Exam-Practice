# Exam Practice

> A small full-stack application for creating and running exam practice sessions.

## Project Overview

- **Client**: A Vite + React frontend (under `client/`) that provides UI components for authentication, creating exam sessions, uploading questions via Excel, running timed sessions, and viewing results.
- **Server**: A Node/Express backend (root `server/` and `server.js`) exposing API endpoints for auth, exam data, and session recording.
- **Data**: Local JSON storage under `data/db.json` and uploaded Excel files in `data/uploads/`.

## Features

- Email/password authentication.
- Upload Excel files to import questions.
- Start timed exam sessions with per-question UI and progress tracking.
- View session history and results.
- 

## Repo Structure

- `client/` — React app (Vite) with components, pages, contexts, and services.
- `server/` — Backend package with `server.js` and an API layer.
- `routes/` — Express route handlers (e.g. `routes/authRoutes.js`, `routes/examRoutes.js`, `routes/sessionRoutes.js`).
- `services/` — Server-side helper services (e.g. `services/dbService.js`, `services/excelService.js`).
- `data/` — `db.json` (storage) and `uploads/` (Excel files).

## Prerequisites

- Node.js 16+ and npm (or Yarn).

## Quick Start

1. Install and run the frontend:

```bash
cd client
npm install
npm run dev
```

2. Install and run the backend:

```bash
cd server
npm install
npm start
# or: node server.js
```

3. Open the frontend URL shown by Vite (usually `http://localhost:5173`). The backend typically runs on `http://localhost:3000` unless configured otherwise.

## Important Files

- Frontend entry: `client/src/main.jsx`
- Key components: `client/src/components/QuestionCard.jsx`, `client/src/components/ExcelUploaderModal.jsx`
- Backend entry: `server/server.js`
- Routes: `routes/authRoutes.js`, `routes/examRoutes.js`, `routes/sessionRoutes.js`
- Services: `services/dbService.js`, `services/excelService.js`

## Environment & Configuration

- If the server uses environment variables, set `PORT` or any other variables before running. Check `server/package.json` or `server.js` for specifics.

## Development Tips

- When updating backend routes, restart the server (or use `nodemon`).
- Frontend hot-reloads via Vite during development.

## Contributing

PRs and issues are welcome. Keep changes focused, run the app locally, and add notes to this README if you add or change features.

## License

This project has no license file by default. Add a `LICENSE` file if you intend to open-source the code.
