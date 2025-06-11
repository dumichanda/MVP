# MVP Dating App - Experience-Based Dating Platform

A modern dating platform that connects people through unique shared experiences rather than traditional swiping.

## 🎯 Features

- **Experience-Based Dating**: Users create and book unique dating experiences
- **Real-time Chat**: Integrated messaging system for communication
- **Booking Management**: Complete booking flow with payment integration ready
- **User Profiles**: Comprehensive profiles with interests and verification
- **Reviews & Ratings**: Community-driven quality assurance
- **Mobile-First Design**: Responsive design optimized for all devices

## 🚀 Tech Stack

- **Frontend**: Next.js 13, React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Node.js
- **Database**: Neon DB (Serverless PostgreSQL)
- **Authentication**: Custom JWT-based auth with HTTP-only cookies
- **UI Components**: shadcn/ui, Radix UI
- **Icons**: Lucide React
- **Styling**: Tailwind CSS with custom design system

## 📋 Prerequisites

- Node.js 18+
- npm or yarn
- Neon DB account

## 🏁 Quick Start

### 1. Clone the repository
```bash
git clone https://github.com/dumichanda/MVP.git
cd MVP
```

### 2. Install dependencies
```bash
npm install
```

### 3. Set up environment variables
Copy `.env.local.example` to `.env.local` and update the values:

```bash
cp .env.local.example .env.local
```

Required environment variables:
```env
DATABASE_URL="your-neon-db-connection-string"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-minimum-32-characters"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### 4. Start the development server
```bash
npm run dev
```

**🎉 That's it!** The startup script will automatically:
- ✅ Check your database connection
- ✅ Create tables if they don't exist
- ✅ Insert demo data if the database is empty
- ✅ Start the Next.js development server

Visit [http://localhost:3000](http://localhost:3000) to see your application.

## 🧪 Demo Accounts

The app comes with pre-configured demo accounts:

| Email | Password | Location |
|-------|----------|----------|
| thabo.mthembu@gmail.com | password123 | Cape Town |
| naledi.williams@outlook.com | password123 | Cape Town |
| sipho.maharaj@gmail.com | password123 | Johannesburg |
| nomsa.dlamini@gmail.com | password123 | Soweto |

## 🛠️ Available Scripts

- `npm run dev` - Start development server with automatic database setup
- `npm run build` - Create production build
- `npm run start` - Start production server
- `npm run db:check` - Check database connection and status
- `npm run db:setup` - Setup database schema and demo data
- `npm run lint` - Run ESLint

## 🗂️ Project Structure

```
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   │   ├── auth/          # Authentication endpoints
│   │   ├── experiences/   # Experience management
│   │   ├── messages/      # Messaging endpoints
│   │   └── profile/       # Profile management
│   ├── auth/              # Authentication pages
│   ├── bookings/          # Booking management pages
│   ├── chats/             # Messaging interface
│   ├── create/            # Experience creation
│   ├── offers/            # Experience browsing
│   └── profile/           # User profiles
├── components/            # Reusable UI components
│   └── ui/               # shadcn/ui components
├── contexts/             # React contexts
├── hooks/                # Custom React hooks
├── lib/                  # Utility functions and API
│   ├── auth.ts          # Authentication utilities
│   ├── db.ts            # Database connection
│   └── logger.ts        # Logging utility
├── scripts/              # Database and setup scripts
│   ├── check-database.js # Database health check
│   └── dev-with-db-check.js # Development startup script
├── sql/                  # Database scripts
│   └── schema.sql       # Database schema
└── middleware.ts         # Next.js middleware for auth
```

## 🔐 Authentication

The app uses a custom JWT-based authentication system with:
- Secure password hashing with bcryptjs
- HTTP-only cookies for token storage
- Protected API routes with middleware
- Automatic token refresh

## 💾 Database

- **PostgreSQL** with Neon DB (serverless)
- **Automatic setup** on first run
- **Connection pooling** for performance
- **Transaction support** for data consistency
- **Optimized queries** with proper indexing

## 🎨 UI Components

Built with modern, accessible components:
- **shadcn/ui** for base components
- **Radix UI** for advanced interactions
- **Tailwind CSS** for styling
- **Lucide React** for icons

## 📱 API Endpoints

### Authentication
- `POST /api/auth/signin` - User sign in
- `POST /api/auth/signup` - User registration
- `POST /api/auth/signout` - User sign out
- `GET /api/auth/me` - Get current user

### Experiences
- `GET /api/experiences` - List experiences with filters
- `POST /api/experiences` - Create new experience
- `GET /api/experiences/[id]` - Get experience details

### Profile
- `GET /api/profile` - Get user profile
- `PUT /api/profile` - Update user profile

### Messages
- `GET /api/messages/conversations` - Get user conversations
- `GET /api/messages/[id]` - Get conversation messages
- `POST /api/messages` - Send message

## 🔧 Troubleshooting

### Database Connection Issues
If you see database connection errors:

1. **Check your .env.local file**:
   ```bash
   cat .env.local
   ```

2. **Verify your Neon DB connection string**:
   - Go to [Neon Console](https://console.neon.tech)
   - Copy the connection string from your dashboard
   - Make sure it includes the password

3. **Test the connection manually**:
   ```bash
   npm run db:check
   ```

### Build Errors
If you encounter build errors:

1. **Clear Next.js cache**:
   ```bash
   rm -rf .next
   npm run build
   ```

2. **Check for TypeScript errors**:
   ```bash
   npm run lint
   ```

## 🚧 Known Issues Fixed

✅ **Database setup automation** - Now handled automatically on startup
✅ **Authentication flow** - Secure JWT implementation with HTTP-only cookies
✅ **API route errors** - All endpoints properly implemented
✅ **Environment configuration** - Automatic detection and validation

## 🔮 Future Features

- [ ] Payment integration (Stripe)
- [ ] Real-time messaging with WebSockets
- [ ] Push notifications
- [ ] Advanced matching algorithms
- [ ] Video chat integration
- [ ] Mobile app (React Native)
- [ ] AI-powered experience recommendations

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📞 Support

For support and questions:
- Create an issue on GitHub
- Check the troubleshooting section above
- Contact: [your-email@example.com]

---

Built with ❤️ using Next.js, TypeScript, and Neon DB

**🎉 Ready to start dating through experiences!**