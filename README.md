# Recycle Vision Hero

A React application for identifying, categorizing, and tracking recyclable materials using Google Gemini AI. Scan items to determine recyclability, get detailed recycling instructions, and maintain your personal recycling history.

## Features

- **AI-Powered Item Analysis**: Analyze images and videos for recyclable items using Google Gemini AI
- **QR Code Support**: Enhanced QR code detection at multiple angles and orientations
- **Real-time Process Feedback**: Detailed visual feedback during scanning and analysis
- **Secure Authentication**: User authentication with JWT tokens and custom Express backend
- **Persistent History**: Track all your scanned items in a personal recycling history
- **Detailed Recycling Instructions**: Get specific instructions on how to recycle each item
- **Dark/Light Theme**: Customizable appearance with theme switching
- **Responsive Design**: Mobile-friendly UI with shadcn-ui and Radix UI components
- **Statistics Dashboard**: Visualize your recycling impact with charts and metrics
- **User Settings**: Customizable preferences for notifications, appearance, and privacy

## Tech Stack

### Frontend
- Vite + React + TypeScrip
- Tailwind CSS with shadcn-ui & Radix UI
- Framer Motion for animations
- Google Gemini Generative AI integration
- @tanstack/react-query for data fetching
- JSQR for QR code detection and processing

### Backend
- Express.js with TypeScript
- Prisma ORM with SQLite database
- JSON Web Tokens (JWT) for authentication
- Multer & Express-fileupload for file handling
- Sharp for image processing and optimization
- File-type for secure MIME type validation
- FS-extra for enhanced file system operations

## Setup

### Prerequisites

- Node.js >=14 & npm
- Google Gemini API Key (for AI image analysis)
- FetchAI API Key (optional, for chat assistant)

### Installation

```bash
# Clone repository
git clone https://github.com/spicyrollbyte/recycle-vision-hero.git
cd recycle-vision-hero

# Install frontend dependencies
npm install

# Copy frontend environment variables template
cp .env.example .env
# Edit .env: add VITE_GEMINI_API_KEY and VITE_API_BASE_URL

# Install backend dependencies
cd backend
npm install

# Copy backend environment variables template
cp .env.example .env
# Edit backend .env: add GEMINI_API_KEY, JWT_SECRET, etc.

# Initialize the database
npx prisma migrate dev

# Start development servers
# In one terminal (backend):
cd backend && npm run dev

# In another terminal (frontend):
cd .. && npm run dev
```

## Environment Variables

### Frontend (.env in root directory)
```env
VITE_GEMINI_API_KEY=<your-gemini-api-key>
VITE_API_BASE_URL=http://localhost:4000
```

### Backend (.env in /backend directory)
```env
GEMINI_API_KEY=<your-gemini-api-key>
JWT_SECRET=<your-jwt-secret>
PORT=4000
FETCHAI_API_KEY=<your-fetchai-key> # Optional for chatbot
```

## Available Scripts

### Frontend
- `npm run dev` — start frontend development server
- `npm run build` — build frontend for production
- `npm run lint` — run ESLint checks
- `npm run preview` — preview production build locally

### Backend
- `cd backend && npm run dev` — start backend development server with hot-reload
- `cd backend && npm run build` — build backend for production
- `cd backend && npm run start` — start production backend server
- `cd backend && npm run migrate` — run Prisma migrations
- `cd backend && npm run generate` — generate Prisma client

## Recent Updates

- Enhanced QR code detection with multi-angle support
- Added real-time visual feedback during image processing
- Migrated from Supabase to custom Express backend with SQLite database
- Improved file upload with better error handling and processing
- Fixed history display with proper image retrieval
- Added detailed logs during processing for better debugging

## Contributing

Contributions are welcome! Please open an issue or submit a pull request.

## License

This project is licensed under the MIT License.
