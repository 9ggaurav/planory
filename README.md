# Planory

A modern project management application inspired by Trello, built with a full-stack TypeScript setup. Planory allows teams to organize, track, and collaborate on tasks using an intuitive board-based interface with drag-and-drop functionality.

## Features

- **Boards**: Create and manage multiple project boards with custom titles and cover images
- **Task Lists**: Organize tasks into columns with customizable titles and descriptions
- **Tasks**: Create, update, and track tasks with assignments and completion status
- **Drag & Drop**: Seamless drag-and-drop functionality to move tasks between lists and reorder them
- **User Management**: User authentication, profiles, and avatars with Cloudinary integration
- **Collaboration**: Share boards with team members and manage access
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Public/Private Boards**: Control board visibility and access levels

## Tech Stack

### Frontend
- **Framework**: [Next.js](https://nextjs.org/) 16 with React 19
- **Language**: TypeScript
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) 4
- **UI Components**: [Radix UI](https://www.radix-ui.com/)
- **HTTP Client**: Axios
- **Icons**: Lucide React
- **Form Validation**: Zod
- **Notifications**: React Toastify

### Backend
- **Framework**: [Express.js](https://expressjs.com/) 5
- **Language**: TypeScript
- **Database ORM**: [Prisma](https://www.prisma.io/)
- **Database**: PostgreSQL
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcrypt
- **File Upload**: Multer + [Cloudinary](https://cloudinary.com/)
- **Dev Server**: tsx with watch mode

### Monorepo
- **Package Manager**: [pnpm](https://pnpm.io/) with workspaces
- **Shared Types**: Centralized type definitions package

## Project Structure

```
planory/
├── apps/
│   ├── api/                    # Express backend server
│   │   ├── src/
│   │   │   ├── controllers/    # Route handlers
│   │   │   ├── routes/         # API routes
│   │   │   ├── middleware/     # Express middleware
│   │   │   ├── lib/            # Database and utilities
│   │   │   └── types/          # TypeScript type definitions
│   │   ├── prisma/
│   │   │   ├── schema.prisma   # Database schema
│   │   │   └── migrations/     # Database migrations
│   │   └── package.json
│   │
│   └── web/                    # Next.js frontend client
│       ├── src/
│       │   ├── app/            # Next.js app directory
│       │   ├── components/     # React components
│       │   ├── features/       # Feature-specific logic
│       │   ├── providers/      # Context providers
│       │   └── types/          # TypeScript definitions
│       └── package.json
│
└── packages/
    └── shared/                 # Shared types and utilities
        └── src/types/          # Centralized type definitions
```

## Getting Started

### Prerequisites

- **Node.js**: v18 or higher
- **pnpm**: v10.20.0 or higher (`npm install -g pnpm`)
- **PostgreSQL**: v12 or higher (local or remote instance)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/planory.git
   cd planory
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Setup environment variables**

   Create `.env` files in the API and Web directories:

   **`apps/api/.env`**
   ```env
   # Database
   DATABASE_URL=postgresql://username:password@localhost:5432/planory

   # JWT
   ACCESS_TOKEN_SECRET=your_access_token_secret_here
   REFRESH_TOKEN_SECRET=your_refresh_token_secret_here

   # Cloudinary (for image uploads)
   CLOUDINARY_NAME=your_cloudinary_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret

   # Server
   PORT=5000
   ```

   **`apps/web/.env.local`**
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:5000/api
   ```

4. **Setup the database**

   Generate Prisma client and run migrations:
   ```bash
   cd apps/api
   pnpm dlx prisma migrate deploy
   ```

   (Optional) Seed the database with sample data:
   ```bash
   pnpm db:seed
   ```

## Running the Project

### Development Mode

Start all services with the dev servers:

```bash
# From the root directory
pnpm dev
```

This will start:
- **API Server**: http://localhost:5000 (with hot reload)
- **Web Server**: http://localhost:3000 (with hot reload)

### Individual Services

**Start API only:**
```bash
cd apps/api
pnpm dev
```

**Start Web only:**
```bash
cd apps/web
pnpm dev
```

### Production Build

**Build API:**
```bash
cd apps/api
pnpm build
pnpm start
```

**Build Web:**
```bash
cd apps/web
pnpm build
pnpm start
```

## API Endpoints

### Authentication
- `POST /api/users/signup` - Register a new user
- `POST /api/users/login` - Login and get tokens
- `POST /api/users/refresh` - Refresh access token
- `POST /api/users/logout` - Logout user

### Users
- `GET /api/users/:id` - Get user profile
- `PUT /api/users/:id` - Update user profile
- `GET /api/users/:id/avatar` - Get user avatar

### Boards
- `GET /api/boards` - Get all boards for current user
- `POST /api/boards` - Create a new board
- `GET /api/boards/:id` - Get board details
- `PUT /api/boards/:id` - Update board
- `DELETE /api/boards/:id` - Delete board
- `POST /api/boards/:id/members` - Add board member

### Task Lists
- `GET /api/tasklists/:boardId` - Get task lists for a board
- `POST /api/tasklists` - Create task list
- `PUT /api/tasklists/:id` - Update task list
- `DELETE /api/tasklists/:id` - Delete task list

### Tasks
- `GET /api/tasks/:taskListId` - Get tasks for a list
- `POST /api/tasks` - Create task
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task
- `PATCH /api/tasks/:id/reorder` - Reorder task

### Inbox
- `GET /api/inbox` - Get inbox tasks
- `POST /api/inbox/task` - Create inbox task

## Database Schema

### User
- `id` - Primary key
- `email` - Unique user email
- `name` - User's display name
- `avatar` - Avatar URL (via Cloudinary)
- `hashedPassword` - Bcrypt hashed password
- `refreshToken` - JWT refresh token
- Relations: Created boards, joined boards, assigned tasks

### Board
- `id` - Primary key
- `title` - Board title
- `coverImage` - Board cover image URL
- `tag` - Array of tags for categorization
- `isPublic` - Public/private board flag
- `isTemplate` - Template board flag
- `creator` - User who created the board
- `members` - Users with access to the board
- `taskLists` - Associated task lists
- `createdAt`, `updatedAt` - Timestamps

### TaskList
- `id` - Primary key
- `title` - List title (e.g., "To Do", "In Progress")
- `position` - Column position for ordering
- `description` - Optional list description
- `isArchived` - Archive status
- `board` - Associated board
- `tasks` - Tasks in this list
- `createdAt`, `updatedAt` - Timestamps

### Task
- `id` - Primary key
- `title` - Task title
- `description` - Task description
- `isDone` - Completion status
- `position` - Position within the list (for sorting)
- `taskList` - Parent task list
- `user` - Assigned team member
- `createdAt`, `updatedAt` - Timestamps

## Development

### Database Migrations

Create a new migration after schema changes:
```bash
cd apps/api
pnpm dlx prisma migrate dev --name migration_name
```

View the database with Prisma Studio:
```bash
cd apps/api
pnpm dlx prisma studio
```

### TypeScript Compilation

Compile TypeScript to JavaScript:
```bash
cd apps/api
pnpm build
```

## Scripts

### API Scripts
- `pnpm dev` - Start development server with hot reload
- `pnpm build` - Compile TypeScript to JavaScript
- `pnpm start` - Run production build
- `pnpm db:seed` - Seed database with sample data

### Web Scripts
- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint

## File Uploads

The application uses Cloudinary for image storage. To enable file uploads:

1. Sign up at [Cloudinary](https://cloudinary.com/)
2. Add your credentials to the API `.env` file
3. Configure multer middleware for handling multipart/form-data requests

## Authentication Flow

1. User signs up/logs in via the web app
2. Backend validates credentials and creates access + refresh tokens
3. Access token (short-lived) is used for API requests
4. Refresh token (long-lived) is used to get new access tokens when expired
5. Passwords are hashed with bcrypt before storing in database

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

ISC

## Support

For issues, questions, or feature requests, please open an issue on the GitHub repository.

---

Built with ❤️ using TypeScript, React, Express, and PostgreSQL
