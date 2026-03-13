# OutfitCreator Frontend

A modern React + TypeScript frontend for the OutfitCreator digital wardrobe management application.

## Tech Stack

- **Framework**: React 18 with TypeScript 5
- **Build Tool**: Vite 5
- **Styling**: Tailwind CSS
- **Routing**: React Router v6
- **HTTP Client**: Axios
- **Form Management**: React Hook Form + Zod
- **File Upload**: React Dropzone
- **Testing**: Vitest + React Testing Library + fast-check
- **Code Quality**: ESLint + Prettier

## Project Structure

```
frontend/
├── src/
│   ├── api/           # API client and service layer
│   ├── components/    # Reusable UI components
│   ├── hooks/         # Custom React hooks
│   ├── pages/         # Page components
│   ├── types/         # TypeScript type definitions
│   ├── utils/         # Utility functions and validation schemas
│   ├── test/          # Test setup and utilities
│   ├── App.tsx        # Root application component
│   ├── main.tsx       # Application entry point
│   └── index.css      # Global styles
├── public/            # Static assets
├── .env.development   # Development environment variables
├── .env.production    # Production environment variables
└── vite.config.ts     # Vite configuration
```

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Backend API running on http://localhost:8080

### Installation

```bash
npm install
```

### Development

Start the development server with hot reload:

```bash
npm run dev
```

The application will be available at http://localhost:3000

### Building for Production

```bash
npm run build
```

The production build will be in the `dist/` directory.

### Testing

Run tests:

```bash
npm test
```

Run tests in watch mode:

```bash
npm run test:watch
```

Run tests with coverage:

```bash
npm run test:coverage
```

### Code Quality

Lint code:

```bash
npm run lint
```

Format code:

```bash
npm run format
```

## Environment Variables

- `VITE_API_BASE_URL`: Backend API base URL
- `VITE_MAX_FILE_SIZE`: Maximum file size for uploads (in bytes)
- `VITE_SUPPORTED_IMAGE_TYPES`: Comma-separated list of supported image MIME types

## API Proxy

The Vite dev server is configured to proxy `/api` requests to `http://localhost:8080` for local development.

## Features

- User authentication with JWT
- Digital closet management
- Photo upload with drag-and-drop
- Outfit creation and management
- AI-powered outfit recommendations
- Responsive design (mobile, tablet, desktop)
- Accessibility compliant (WCAG 2.1 AA)

## License

Private - All rights reserved
