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

### 4. Set up the database
Run the schema and seed scripts in your Neon Console:

1. Go to [Neon Console](https://console.neon.tech)
2. Create a new project (if you haven't already)
3. Copy your connection string to `.env.local`
4. In the SQL Editor, run:
   - `sql/schema.sql` to create all tables
   - `sql/seed.sql` to add sample data (optional)

### 5. Start the development server
```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to see your application.

## 🔧 Deployment

### Deploy to Vercel (Recommended)

1. Connect your GitHub repository to Vercel
2. Configure environment variables in Vercel dashboard:
   - `DATABASE_URL`
   - `NEXTAUTH_URL` (your production domain)
   - `NEXTAUTH_SECRET`
   - `NEXT_PUBLIC_APP_URL` (your production domain)
3. Deploy with automatic builds

### Deploy to Other Platforms

The app is configured to work with any Node.js hosting platform. Just ensure you:
1. Set up the required environment variables
2. Run `npm run build` to create the production build
3. Start with `npm start`

## 🗂️ Project Structure

```
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   │   ├── auth/          # Authentication endpoints
│   │   ├── experiences/   # Experience management
│   │   ├── bookings/      # Booking management
│   │   └── messages/      # Messaging endpoints
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
│   └── db.ts            # Database connection
├── sql/                  # Database scripts
│   ├── schema.sql       # Database schema
│   └── seed.sql         # Sample data
├── types/                # TypeScript type definitions
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

### Experiences
- `GET /api/experiences` - List experiences with filters
- `POST /api/experiences` - Create new experience
- `GET /api/experiences/[id]` - Get experience details

### Bookings
- `GET /api/bookings` - Get user bookings
- `POST /api/bookings` - Create new booking
- `PUT /api/bookings/[id]` - Update booking status

### Messages
- `GET /api/messages/conversations` - Get user conversations
- `GET /api/messages/[id]` - Get conversation messages
- `POST /api/messages` - Send message

## 🧪 Test Users

The seed data includes these test users:
- Email: nomsa@example.com, Password: password123
- Email: michael@example.com, Password: password123
- Email: sarah@example.com, Password: password123

## 🚧 Known Issues Fixed

✅ **Cloudflare:sockets webpack error** - Fixed with proper webpack configuration
✅ **Database connection issues** - Resolved by using @neondatabase/serverless exclusively
✅ **Authentication token handling** - Implemented secure HTTP-only cookies

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
- Check the documentation
- Contact: [your-email@example.com]

---

Built with ❤️ using Next.js, TypeScript, and Neon DB
