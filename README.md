# English Learning App

A web application for learning English words through interactive study modes and tests. Built with React and Vite.

## Features

- **Study Mode**:
  - Flashcards: View words on one side and translations with examples on the other.
  - Words and examples are played using speech synthesis on click.
  - Standard mode for simple word listing.

- **Test Mode**:
  - Manual input: Type the correct translation.
  - Multiple-choice: Select the correct word.
  - Incorrect answers are saved to an error list for further review.

- **Data Management**:
  - Words are loaded from a CSV file in the project root.
  - Additional words can be added via Google Sheets.

- **Additional features**:
  - Clicking on the last "n" in the Logo enables API examples mode for selection.
  - Clicking on the word count in test mode toggles the animation (show or hide).

## Installation

1. Clone the repository:
```sh
   git clone <repository-url>
```
2. Install all modules and run project:
```sh
    cd <project-folder>
    npm install
    npm run dev
```

## Publishing

1. Publish to github pages: 
```sh
    npm run build
    npm run deploy
```

2. Publish to netlify:
- Edit path in App.jsx: `export const routeEnglishman = "";`.
- `npm run build`.
- Compress files in `/dist` directory and load on netlify.
