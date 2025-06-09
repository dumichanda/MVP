# Mavuso - Dating Through Experiences

A modern dating platform that connects people through unique shared experiences rather than traditional swiping.

## Features

- **Experience-Based Dating**: Users create and book unique dating experiences
- **Real-time Chat**: Integrated messaging system for communication
- **Booking Management**: Complete booking flow with payment integration ready
- **User Profiles**: Comprehensive profiles with interests and verification
- **Reviews & Ratings**: Community-driven quality assurance
- **Mobile-First Design**: Responsive design optimized for all devices

## Tech Stack

- **Frontend**: Next.js 13, React, TypeScript, Tailwind CSS
- **Backend**: Node.js API Routes, PostgreSQL (Neon DB)
- **Database**: Neon DB (Serverless PostgreSQL)
- **Authentication**: Custom JWT-based auth
- **UI Components**: shadcn/ui, Radix UI
- **Icons**: Lucide React
- **Styling**: Tailwind CSS with custom design system

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Neon DB account

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd mavuso-dating-app
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.local.example .env.local
```

4. Configure your Neon DB:
   - Create a new Neon project
   - Copy your connection string to `.env.local`
   - Run the database schema and seed scripts

5. Start the development server:
```bash
npm run dev
```

## Database Setup

### Setting up Neon DB

1. Go to [Neon Console](https://console.neon.tech)
2. Create a new project
3. Copy the connection string
4. Update your `.env.local` file

### Running Database Scripts

You can run the SQL scripts directly in the Neon Console SQL Editor:

1. **Schema Setup**: Run `sql/schema.sql` to create all tables
2. **Seed Data**: Run `sql/seed.sql` to add sample data

### Environment Variables

Create a `.env.local` file with the following variables:

```env
DATABASE_URL=postgresql://neondb_owner:npg_PfWQsNtGp7O0@ep-lively-math-a4foihwb-pooler.us-east-1.aws.neon.tech/MV_DC?sslmode=require
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-nextauth-secret-key-here
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Project Structure

```
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   │   ├── auth/          # Authentication endpoints
│   │   ├── experiences/   # Experience management
│   │   ├── bookings/      # Booking management
│   │   └── messages/      # Messaging endpoints
│   ├── auth/              # Authentication pages
│   ├── bookings/          # Booking management
│   ├── chats/             # Messaging interface
│   ├── create/            # Experience creation
│   ├── offers/            # Experience details
│   └── profile/           # User profiles
├── components/            # Reusable UI components
│   └── ui/               # shadcn/ui components
├── contexts/             # React contexts
├── hooks/                # Custom React hooks
├── lib/                  # Utility functions and API
│   ├── api/              # Database API functions
│   ├── auth.ts           # Authentication utilities
│   └── db.ts             # Database connection
├── sql/                  # Database scripts
│   ├── schema.sql        # Database schema
│   └── seed.sql          # Sample data
├── types/                # TypeScript type definitions
└── middleware.ts         # Next.js middleware for auth
```

## Key Features Implementation

### Authentication
- Custom JWT-based authentication
- Secure password hashing with bcrypt
- HTTP-only cookies for token storage
- Protected API routes with middleware

### Database
- PostgreSQL with Neon DB
- Connection pooling for performance
- Transaction support for data consistency
- Optimized queries with proper indexing

### Experiences
- Create, read, update, delete experiences
- Image upload and management
- Category filtering and search
- Time slot management

### Bookings
- Complete booking flow
- Payment integration ready (Stripe)
- Status management (pending, confirmed, completed, cancelled)
- Host and guest perspectives

### Messaging
- Real-time chat capability
- Conversation management
- Message history and persistence
- Unread message tracking

### Reviews & Ratings
- Post-experience review system
- Rating aggregation
- Host reputation tracking

## API Endpoints

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

## Deployment

### Database Setup
1. Create a Neon DB project
2. Run schema and seed scripts
3. Configure connection string

### Vercel Deployment
1. Connect your GitHub repository to Vercel
2. Configure environment variables
3. Deploy with automatic builds

### Environment Configuration
- Set up production environment variables
- Configure custom domain
- Set up analytics and monitoring

## Sample Users

The seed data includes these test users:

- **Email**: nomsa@example.com, **Password**: password123
- **Email**: michael@example.com, **Password**: password123  
- **Email**: sarah@example.com, **Password**: password123

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support and questions:
- Create an issue on GitHub
- Contact the development team
- Check the documentation

## Roadmap

- [x] Database migration to Neon DB
- [x] Custom authentication system
- [x] Core API endpoints
- [ ] Payment integration (Stripe)
- [ ] Real-time messaging with WebSockets
- [ ] Push notifications
- [ ] Advanced matching algorithms
- [ ] Video chat integration
- [ ] Mobile app (React Native)
- [ ] AI-powered experience recommendations

## Database Schema

### Users Table
- User authentication and profile information
- Interests, location, verification status

### Experiences Table
- Experience listings with details, pricing, images
- Host information and categorization

### Time Slots Table
- Available booking times for experiences
- Availability tracking

### Bookings Table
- Booking records with status tracking
- Payment status and guest information

### Conversations & Messages Tables
- Chat functionality between users
- Message history and read status

### Reviews Table
- Experience reviews and ratings
- Host reputation system