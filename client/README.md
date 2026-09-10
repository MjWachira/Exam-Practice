# Exam Practice App

A **React** based exam preparation platform with a Node.js backend. The app lets users practice multiple‑choice questions loaded from Excel files, track session history, and view detailed results.

## Features
- Responsive UI for desktop, tablet, and mobile.
- Light/dark theme support with a violet‑indigo‑cyan colour palette.
- Upload an Excel (`.xlsx`) question bank.
- Session history, results, and analytics.
- Authentication (login/register) integration.

## Tech Stack
- **Frontend:** React, Vite, Tailwind CSS
- **Backend:** Node.js, Express
- **Data:** Excel files parsed server‑side

## Getting Started
```sh
# Clone the repository (if not already)
git clone https://github.com/MjWachira/Exam-Practice.git
cd Exam-Practice/client

# Install dependencies
npm install

# Run the development server
npm run dev
```
Open http://localhost:5173 in your browser.

## Building for Production
```sh
npm run build   # Creates a static bundle in the `dist` folder
```

## Contributing
Feel free to open issues or PRs. Follow the existing code style and run `npm run lint` before submitting.

## License
MIT – see `LICENSE` file for details.
