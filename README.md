# Benubina Portfolio

A modern portfolio and blog application built with Next.js 15, Prisma, PostgreSQL, and Tailwind CSS.

## Prerequisites

Before you begin, ensure you have the following installed:
- [Node.js](https://nodejs.org/) (v18 or higher)
- [PostgreSQL](https://www.postgresql.org/) (running locally or a cloud instance)
- npm or pnpm

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd benubina-portfolio
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   pnpm install
   ```

## Configuration

1. Create a `.env` file in the root directory:
   ```bash
   cp .env.example .env 2>/dev/null || touch .env
   ```

2. Add the following environment variables to your `.env` file:
   ```env
   # Database Connection
   # Replace with your actual PostgreSQL connection string
   DATABASE_URL="postgresql://user:password@localhost:5432/benubina_db?schema=public"

   # NextAuth Configuration
   # Generate a secret with: openssl rand -base64 32
   AUTH_SECRET="your-secret-key-at-least-32-chars"
   
   # Setup for production/deployment URL
   NEXTAUTH_URL="http://localhost:3000"
   ```

## Database Setup

1. **Generate Prisma Client**
   ```bash
   npx prisma generate
   ```

2. **Push Schema to Database**
   ```bash
   npx prisma db push
   # or for migrations
   npx prisma migrate dev --name init
   ```

3. **Seed Database (Optional)**
   Populate the database with initial data (like the default user).
   ```bash
   npx prisma db seed
   ```

## Running the Application

1. **Start the development server**
   ```bash
   npm run dev
   ```

2. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Login Credentials (Default Seed)

If you ran the seed script, you can log in with:
- **Email:** `admin@benubina.com` (or check `prisma/seed.js`)
- **Password:** `password123` (or check `prisma/seed.js`)

## Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Database:** PostgreSQL
- **ORM:** Prisma
- **Auth:** NextAuth.js (v5)
- **Styling:** Tailwind CSS
