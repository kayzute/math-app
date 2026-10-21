# Math Practice App

A child-friendly, interactive math practice web application designed for students ages 7–12 to practice addition, subtraction, multiplication, and division using interactive flashcards, mistake tracking, and personalized review.

## Tech Stack

- **React 19**
- **TypeScript**
- **Vite**
- **Vitest & React Testing Library**
- **ESLint & Prettier**

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher recommended; v22 LTS tested)
- npm (v9 or higher)

### Installation

Clone the repository and install dependencies:

```bash
git clone https://github.com/kayzute/math-app.git
cd math-app
npm install
```

### Running the Development Server

To start the Vite development server with hot module reloading:

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser to view the application.

### Running Tests

Run the test suite using Vitest:

```bash
npm test
```

To run tests in watch mode:

```bash
npm run test:watch
```

### Code Quality and Formatting

To run ESLint:

```bash
npm run lint
```

To format code with Prettier:

```bash
npm run format
```

To check formatting:

```bash
npm run format:check
```

### Building for Deployment

To compile TypeScript and create a production build in `dist/`:

```bash
npm run build
```

To preview the production build locally:

```bash
npm run preview
```
