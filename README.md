# cesizen-api

REST API built with **Node.js**, **TypeScript**, **Express**, **Prisma**, **PostgreSQL**, and **Zod**.

## 🚀 Tech Stack

- **Node.js** - JavaScript runtime
- **TypeScript** - Type-safe JavaScript
- **Express** - Web framework
- **Prisma** - Database ORM
- **PostgreSQL** - Relational database
- **Zod** - Schema validation

## 📋 Prerequisites

- Node.js (v18 or higher)
- PostgreSQL (v14 or higher)
- npm or yarn

## 🛠️ Installation

1. Clone the repository:
```bash
git clone https://github.com/cesizenIndividuel/cesizen-api.git
cd cesizen-api
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

4. Update the `.env` file with your PostgreSQL connection string:
```env
DATABASE_URL="postgresql://username:password@localhost:5432/cesizen_db?schema=public"
PORT=3000
NODE_ENV=development
```

5. Generate Prisma client:
```bash
npm run prisma:generate
```

6. Run database migrations:
```bash
npm run prisma:migrate
```

## 🚀 Running the Application

### Development mode (with hot reload):
```bash
npm run dev
```

### Production mode:
```bash
npm run build
npm start
```

## 📚 API Endpoints

### Health Check
- **GET** `/api/health` - Check API status

### Users
- **GET** `/api/users` - Get all users
- **GET** `/api/users/:id` - Get user by ID
- **POST** `/api/users` - Create new user
- **PUT** `/api/users/:id` - Update user
- **DELETE** `/api/users/:id` - Delete user

### Example Request (Create User):
```bash
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "name": "John Doe"
  }'
```

## 🗄️ Database Management

### Open Prisma Studio (Database GUI):
```bash
npm run prisma:studio
```

### Create a new migration:
```bash
npm run prisma:migrate
```

## 📁 Project Structure

```
cesizen-api/
├── src/
│   ├── config/         # Configuration files
│   ├── controllers/    # Request handlers
│   ├── middlewares/    # Express middlewares
│   ├── routes/         # API routes
│   ├── schemas/        # Zod validation schemas
│   ├── utils/          # Utility functions
│   ├── app.ts          # Express app setup
│   └── server.ts       # Server entry point
├── prisma/
│   └── schema.prisma   # Database schema
├── .env.example        # Environment variables template
├── tsconfig.json       # TypeScript configuration
└── package.json        # Dependencies and scripts
```

## 🔒 Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| DATABASE_URL | PostgreSQL connection string | - |
| PORT | Server port | 3000 |
| NODE_ENV | Environment (development/production) | development |

## 📝 License

ISC
