# Recycle Vision Hero

A React application for identifying, categorizing, and tracking recyclable materials using Google Gemini AI.

## Features

- Analyze images and videos for recyclable items
- Classify items via text input
- User authentication and profile management with Supabase
- Real-time feedback with toast notifications
- Dark/light theme switching
- Responsive, accessible UI with shadcn-ui and Radix UI
- Recycling statistics and charts using Recharts
- Customizable settings: email notifications, appearance, privacy, account deletion

## Tech Stack

- Vite + React + TypeScript
- Tailwind CSS with shadcn-ui & Radix UI
- Google Gemini Generative AI
- Supabase (Auth & Database)
- @tanstack/react-query for data fetching
- Zod for schema validation
- Recharts for data visualization

## Setup

### Prerequisites

- Node.js >=14 & npm
- Google Gemini API Key
- Supabase project URL & PUBLISHABLE Key

### Installation

```bash
# Clone repository
git clone 
cd recycle-vision-hero

# Install dependencies
npm install

# Copy environment variables template
cp .env.example .env
# Edit .env: add VITE_GEMINI_API_KEY, VITE_SUPABASE_URL, VITE_SUPABASE_PUBLISHABLE_KEY

# Start development server
npm run dev
```

## Environment Variables

```env
VITE_GEMINI_API_KEY=<your-gemini-api-key>
VITE_SUPABASE_URL=<your-supabase-url>
VITE_SUPABASE_PUBLISHABLE_KEY=<your-supabase-publishable-key>
```

## Available Scripts

- `npm run dev` — start development server
- `npm run build` — build for production
- `npm run lint` — run ESLint checks
- `npm run preview` — preview production build locally

## Contributing

Contributions are welcome! Please open an issue or submit a pull request.

## License

This project is licensed under the MIT License.
