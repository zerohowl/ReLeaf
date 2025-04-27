# Changelog

## [Unreleased]
### Added
- Initial backend folder (`/backend`) with Node + Express + Prisma setup for SQL-based auth.
  - `package.json`, `tsconfig.json`, `prisma/schema.prisma`, and `src/index.ts` added.
- Basic REST endpoints: `/api/register`, `/api/login`, `/api/profile` with JWT auth.
- Media upload system with SQLite database storage:
  - Added `Upload` and `UploadHistory` models to Prisma schema
  - Created API endpoints: `/api/uploads`, `/api/uploads/:id`, `/api/uploads/:id/history`
  - Implemented file storage for both images and videos
  - Added history tracking for all uploaded media
- Frontend integration for SQLite-based media storage:
  - Updated History page to use real database data instead of mock data
  - Added direct upload functionality in the Upload page
  - Created uploadService.ts to communicate with backend API
- Personalized onboarding survey system:
  - Added `UserSurvey` model to Prisma schema to store user preferences
  - Created API endpoints: `/api/survey`, `/api/personalization`
  - Implemented personalized tips and points multipliers based on user preferences
  - Created TipCard component to display personalized recycling tips
  - Added error handling and connection retry logic
- Instructions to run dev server and migrations.
