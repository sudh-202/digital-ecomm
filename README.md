# Digital E-commerce Platform

## Overview
A modern, full-stack e-commerce platform built with Next.js 14, featuring a robust admin dashboard, product management, and user authentication.

## Tech Stack
- **Frontend**:
  - Next.js 14 (React Framework)
  - TypeScript
  - Tailwind CSS
  - Radix UI Components
  - Framer Motion (Animations)
  - Lucide React (Icons)

- **Backend**:
  - Next.js API Routes
  - Prisma ORM
  - SQLite Database
  - JWT Authentication
  - BCrypt for Password Hashing

- **Development Tools**:
  - ESLint
  - Prettier
  - TypeScript
  - Drizzle ORM

## Features
### Authentication & Authorization
- Secure user authentication with JWT
- Role-based access control (Admin/User)
- Protected routes and API endpoints

### Admin Dashboard
- Comprehensive product management
  - Create, edit, and delete products
  - Rich text editor for product descriptions
  - Image upload and management
- Order management and tracking
- User management
- Analytics and reporting

### Product Management
- Advanced product categorization
- Multiple product images
- Detailed product specifications
- Stock management
- Price management

### User Features
- User profile management
- Order history
- Shopping cart functionality
- Wishlist management

## Getting Started

### Prerequisites
- Node.js 18+ installed
- Git
- npm or yarn package manager

### Installation Steps
1. Clone the repository
```bash
git clone https://github.com/yourusername/digital-ecomm.git
cd digital-ecomm
```

2. Install dependencies
```bash
npm install
# or
yarn install
```

3. Set up environment variables
Create a `.env` file in the root directory with the following variables:
```env
DATABASE_URL="file:./sqlite.db"
JWT_SECRET=your_jwt_secret_here
NEXT_PUBLIC_API_URL=http://localhost:3000
```

4. Initialize the database
```bash
npx prisma generate
npx prisma db push
```

5. Run the development server
```bash
npm run dev
# or
yarn dev
```

The application will be available at `http://localhost:3000`

## Common Issues and Solutions

### Database Connection Issues
- **Error**: "Cannot connect to database"
  - **Solution**: Ensure your DATABASE_URL in `.env` is correct
  - Check if SQLite file exists and has proper permissions

### Build Errors
- **Error**: "Module not found"
  - **Solution**: Run `npm install` again
  - Clear `.next` folder and rebuild

### Image Upload Issues
- **Error**: "Failed to upload image"
  - **Solution**: Check file size (max 5MB)
  - Ensure proper file formats (JPG, PNG, WebP)

### Authentication Issues
- **Error**: "Invalid token"
  - **Solution**: Clear browser cookies
  - Check if JWT_SECRET is properly set
  - Ensure token hasn't expired

## Development Guidelines
- Follow TypeScript best practices
- Use conventional commits
- Write unit tests for new features
- Follow the existing code structure
- Use provided UI components from the component library

## Project Structure
```
digital-ecomm/
├── app/                  # Next.js app directory
├── components/          # Reusable UI components
├── config/             # Configuration files
├── constant/           # Constants and enums
├── context/            # React context providers
├── lib/                # Utility functions and helpers
├── prisma/             # Database schema and migrations
├── public/             # Static assets
├── styles/             # Global styles
└── types/              # TypeScript type definitions
```

## Contributing
1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License
This project is licensed under the MIT License.

## Support
For support, email support@digital-ecomm.com or create an issue in the repository.
