# Vrajatian Frontend

React + TypeScript + Vite frontend with Tailwind CSS and shadcn/ui.

## Tech Stack

- **Framework:** React 19
- **Build Tool:** Vite 8
- **Language:** TypeScript 6
- **Styling:** Tailwind CSS 3 + PostCSS + Autoprefixer
- **Components:** shadcn/ui (Radix UI primitives + Lucide icons)
- **Utilities:** clsx, tailwind-merge, class-variance-authority
- **Linting:** Oxlint
- **Color Space:** OKLCH (light & dark themes)

## Getting Started

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint
npm run lint
```

## Docker

### Build

```bash
docker build -t vrajatian-frontend .
```

### Run

```bash
docker run -p 5173:5173 vrajatian-frontend
```

Open [http://localhost:5173](http://localhost:5173).

### Development with Docker

```bash
docker build -t vrajatian-frontend .
docker run -p 5173:5173 -v $(pwd)/src:/app/src vrajatian-frontend
```

## Project Structure

```
src/
├── components/ui/   # shadcn/ui components
├── lib/             # Utility functions (cn, etc.)
├── App.tsx          # Root component
├── main.tsx         # Entry point
└── index.css        # Global styles + theme variables
```
