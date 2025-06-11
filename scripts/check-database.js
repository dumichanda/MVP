#!/usr/bin/env node

// scripts/check-database.js - Database health check and setup with correct schema handling
const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

// Load environment variables
function loadEnv() {
  try {
    const envPath = path.join(process.cwd(), '.env.local');
    if (fs.existsSync(envPath)) {
      const envContent = fs.readFileSync(envPath, 'utf8');
      envContent.split('\n').forEach(line => {
        const [key, ...values] = line.split('=');
        if (key && values.length) {
          process.env[key.trim()] = values.join('=').trim().replace(/^["']|["']$/g, '');
        }
      });
    }
  } catch (error) {
    console.log('⚠️  Could not load .env.local file');
  }
}

async function checkDatabaseConnection() {
  loadEnv();
  
  const DATABASE_URL = process.env.DATABASE_URL;
  
  if (!DATABASE_URL) {
    console.error('❌ DATABASE_URL environment variable is not set');
    console.log('💡 Please check your .env.local file');
    process.exit(1);
  }

  const pool = new Pool({
    connectionString: DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  });

  try {
    console.log('🔍 Checking database connection...');
    
    // Test basic connection
    const client = await pool.connect();
    await client.query('SELECT 1');
    client.release();
    
    console.log('✅ Database connection successful');
    
    // Check if users table exists
    const tableCheck = await pool.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'users'
      );
    `);
    
    const tablesExist = tableCheck.rows[0].exists;
    
    if (!tablesExist) {
      console.log('⚠️  Database tables not found');
      return { connected: true, tablesExist: false };
    }
    
    // Check if we have demo data
    const userCount = await pool.query('SELECT COUNT(*) FROM users');
    const experienceCount = await pool.query('SELECT COUNT(*) FROM experiences');
    
    // Check other tables safely
    let bookingCount = { rows: [{ count: 0 }] };
    let conversationCount = { rows: [{ count: 0 }] };
    let messageCount = { rows: [{ count: 0 }] };
    
    try {
      // Check if bookings table exists
      const bookingsTableExists = await pool.query(`
        SELECT EXISTS (
          SELECT FROM information_schema.tables 
          WHERE table_schema = 'public' 
          AND table_name = 'bookings'
        );
      `);
      
      if (bookingsTableExists.rows[0].exists) {
        bookingCount = await pool.query('SELECT COUNT(*) FROM bookings');
      }
      
      // Check if conversations table exists
      const conversationsTableExists = await pool.query(`
        SELECT EXISTS (
          SELECT FROM information_schema.tables 
          WHERE table_schema = 'public' 
          AND table_name = 'conversations'
        );
      `);
      
      if (conversationsTableExists.rows[0].exists) {
        conversationCount = await pool.query('SELECT COUNT(*) FROM conversations');
      }
      
      // Check if messages table exists
      const messagesTableExists = await pool.query(`
        SELECT EXISTS (
          SELECT FROM information_schema.tables 
          WHERE table_schema = 'public' 
          AND table_name = 'messages'
        );
      `);
      
      if (messagesTableExists.rows[0].exists) {
        messageCount = await pool.query('SELECT COUNT(*) FROM messages');
      }
      
    } catch (error) {
      console.log('ℹ️  Some tables don\'t exist yet, will be created');
    }
    
    console.log(`📊 Database status:`);
    console.log(`   Users: ${userCount.rows[0].count}`);
    console.log(`   Experiences: ${experienceCount.rows[0].count}`);
    console.log(`   Bookings: ${bookingCount.rows[0].count}`);
    console.log(`   Conversations: ${conversationCount.rows[0].count}`);
    console.log(`   Messages: ${messageCount.rows[0].count}`);
    
    return { 
      connected: true, 
      tablesExist: true, 
      hasData: parseInt(userCount.rows[0].count) > 0,
      hasCompleteData: parseInt(bookingCount.rows[0].count) > 0 && parseInt(conversationCount.rows[0].count) > 0
    };
    
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    return { connected: false, error: error.message };
  } finally {
    await pool.end();
  }
}

async function createSchemaOnly() {
  loadEnv();
  
  const DATABASE_URL = process.env.DATABASE_URL;
  const pool = new Pool({
    connectionString: DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  });

  try {
    console.log('🔨 Creating database schema safely...');
    
    // Create schema without triggers first - using the EXACT schema from sql/schema.sql
    const safeSchema = `
      -- Enable UUID extension
      CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

      -- Users table
      CREATE TABLE IF NOT EXISTS users (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          email VARCHAR(255) UNIQUE NOT NULL,
          password VARCHAR(255) NOT NULL,
          first_name VARCHAR(100) NOT NULL,
          last_name VARCHAR(100) NOT NULL,
          profile_picture TEXT,
          bio TEXT,
          interests TEXT[], -- Array of interests
          location VARCHAR(255),
          phone VARCHAR(20),
          date_of_birth DATE,
          verified BOOLEAN DEFAULT FALSE,
          active BOOLEAN DEFAULT TRUE,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );

      -- Experiences table
      CREATE TABLE IF NOT EXISTS experiences (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          host_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
          title VARCHAR(255) NOT NULL,
          description TEXT NOT NULL,
          category VARCHAR(100) NOT NULL,
          price DECIMAL(10,2) NOT NULL,
          duration INTEGER NOT NULL, -- in minutes
          location VARCHAR(255) NOT NULL,
          max_participants INTEGER,
          images JSONB DEFAULT '[]'::jsonb, -- Array of image URLs
          requirements TEXT,
          active BOOLEAN DEFAULT TRUE,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );

      -- Bookings table
      CREATE TABLE IF NOT EXISTS bookings (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          experience_id UUID NOT NULL REFERENCES experiences(id) ON DELETE CASCADE,
          guest_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
          host_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
          booking_date TIMESTAMP WITH TIME ZONE NOT NULL,
          status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled')),
          total_amount DECIMAL(10,2) NOT NULL,
          special_requests TEXT,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );

      -- Conversations table (using participant_1 and participant_2 as expected)
      CREATE TABLE IF NOT EXISTS conversations (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          participant_1 UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
          participant_2 UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
          last_message_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          UNIQUE(participant_1, participant_2)
      );

      -- Messages table
      CREATE TABLE IF NOT EXISTS messages (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
          sender_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
          content TEXT NOT NULL,
          message_type VARCHAR(20) DEFAULT 'text' CHECK (message_type IN ('text', 'image', 'booking')),
          read_at TIMESTAMP WITH TIME ZONE,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );

      -- Reviews table
      CREATE TABLE IF NOT EXISTS reviews (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
          reviewer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
          reviewee_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
          rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
          comment TEXT,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );

      -- Availability table (for experience scheduling)
      CREATE TABLE IF NOT EXISTS availability (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          experience_id UUID NOT NULL REFERENCES experiences(id) ON DELETE CASCADE,
          available_date DATE NOT NULL,
          start_time TIME NOT NULL,
          end_time TIME NOT NULL,
          is_available BOOLEAN DEFAULT TRUE,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );

      -- Indexes for better performance
      CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
      CREATE INDEX IF NOT EXISTS idx_experiences_host_id ON experiences(host_id);
      CREATE INDEX IF NOT EXISTS idx_experiences_category ON experiences(category);
      CREATE INDEX IF NOT EXISTS idx_experiences_location ON experiences(location);
      CREATE INDEX IF NOT EXISTS idx_experiences_price ON experiences(price);
      CREATE INDEX IF NOT EXISTS idx_experiences_active ON experiences(active);
      CREATE INDEX IF NOT EXISTS idx_bookings_experience_id ON bookings(experience_id);
      CREATE INDEX IF NOT EXISTS idx_bookings_guest_id ON bookings(guest_id);
      CREATE INDEX IF NOT EXISTS idx_bookings_host_id ON bookings(host_id);
      CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);
      CREATE INDEX IF NOT EXISTS idx_bookings_booking_date ON bookings(booking_date);
      CREATE INDEX IF NOT EXISTS idx_conversations_participants ON conversations(participant_1, participant_2);
      CREATE INDEX IF NOT EXISTS idx_messages_conversation_id ON messages(conversation_id);
      CREATE INDEX IF NOT EXISTS idx_messages_sender_id ON messages(sender_id);
      CREATE INDEX IF NOT EXISTS idx_reviews_booking_id ON reviews(booking_id);
      CREATE INDEX IF NOT EXISTS idx_reviews_reviewer_id ON reviews(reviewer_id);
      CREATE INDEX IF NOT EXISTS idx_reviews_reviewee_id ON reviews(reviewee_id);
      CREATE INDEX IF NOT EXISTS idx_availability_experience_id ON availability(experience_id);
      CREATE INDEX IF NOT EXISTS idx_availability_date ON availability(available_date);
    `;
    
    await pool.query(safeSchema);
    console.log('✅ Schema created successfully');
    
    // Now handle triggers separately and safely
    console.log('🔧 Setting up triggers safely...');
    
    try {
      // Create the function if it doesn't exist
      await pool.query(`
        CREATE OR REPLACE FUNCTION update_updated_at_column()
        RETURNS TRIGGER AS $$
        BEGIN
            NEW.updated_at = NOW();
            RETURN NEW;
        END;
        $$ language 'plpgsql';
      `);
      
      // Check and create triggers one by one
      const triggers = [
        { table: 'users', trigger: 'update_users_updated_at' },
        { table: 'experiences', trigger: 'update_experiences_updated_at' },
        { table: 'bookings', trigger: 'update_bookings_updated_at' }
      ];
      
      for (const { table, trigger } of triggers) {
        // Check if trigger exists
        const triggerExists = await pool.query(`
          SELECT EXISTS (
            SELECT 1 FROM information_schema.triggers 
            WHERE trigger_name = $1 AND event_object_table = $2
          );
        `, [trigger, table]);
        
        if (!triggerExists.rows[0].exists) {
          await pool.query(`
            CREATE TRIGGER ${trigger}
                BEFORE UPDATE ON ${table}
                FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
          `);
          console.log(`✅ Created trigger: ${trigger}`);
        } else {
          console.log(`ℹ️  Trigger already exists: ${trigger}`);
        }
      }
      
      console.log('✅ Triggers setup completed');
      
    } catch (triggerError) {
      console.log('⚠️  Trigger setup had issues, but continuing (triggers are optional)');
      console.log(`   Error: ${triggerError.message}`);
    }
    
    return true;
    
  } catch (error) {
    console.error('❌ Schema creation failed:', error.message);
    throw error;
  } finally {
    await pool.end();
  }
}

async function runMigrations() {
  loadEnv();
  
  const DATABASE_URL = process.env.DATABASE_URL;
  const pool = new Pool({
    connectionString: DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  });

  try {
    console.log('🔨 Running database migrations...');
    
    // Create schema safely
    await createSchemaOnly();
    
    // Check if we need to run seed data
    const userCount = await pool.query('SELECT COUNT(*) FROM users');
    
    if (parseInt(userCount.rows[0].count) === 0) {
      console.log('🌱 No users found, inserting demo data...');
      
      // Insert demo users with hashed passwords
      const bcrypt = require('bcryptjs');
      const hashedPassword = await bcrypt.hash('password123', 12);
      
      await pool.query(`
        INSERT INTO users (email, password, first_name, last_name, bio, interests, location, phone, verified, created_at) VALUES
        ('thabo.mthembu@gmail.com', $1, 'Thabo', 'Mthembu', 'Love exploring the Mother City! Big fan of hiking Table Mountain and enjoying good wine in Stellenbosch.', ARRAY['Hiking', 'Wine Tasting', 'Photography', 'Rugby'], 'Cape Town, Western Cape', '+27 82 123 4567', true, NOW()),
        ('naledi.williams@outlook.com', $1, 'Naledi', 'Williams', 'Proudly from the Western Cape! I enjoy wine tastings, art galleries, and sunset drives along Chapman''s Peak.', ARRAY['Wine Tasting', 'Art', 'Photography', 'Beach Activities'], 'Camps Bay, Cape Town', '+27 83 234 5678', true, NOW()),
        ('sipho.maharaj@gmail.com', $1, 'Sipho', 'Maharaj', 'Joburg entrepreneur with a love for the city''s energy. Enjoy jazz at the Market Theatre and good curry in Fordsburg.', ARRAY['Jazz Music', 'Entrepreneurship', 'Food', 'Networking'], 'Sandton, Johannesburg', '+27 84 345 6789', true, NOW()),
        ('nomsa.dlamini@gmail.com', $1, 'Nomsa', 'Dlamini', 'Teacher and community volunteer from Soweto. Love traditional dancing, local music, and sharing stories about our heritage.', ARRAY['Teaching', 'Traditional Dancing', 'Music', 'Community Work'], 'Soweto, Johannesburg', '+27 86 567 8901', true, NOW())
        ON CONFLICT (email) DO NOTHING
      `, [hashedPassword]);
      
      // Insert demo experiences
      await pool.query(`
        INSERT INTO experiences (host_id, title, description, category, price, duration, location, max_participants, images, requirements, active, created_at) VALUES
        ((SELECT id FROM users WHERE email = 'thabo.mthembu@gmail.com'), 'Table Mountain Sunrise Hike & Coffee', 'Join me for an early morning hike up Table Mountain via Platteklip Gorge. Watch the sunrise over Cape Town and enjoy fresh coffee at the top.', 'Adventure', 350.00, 240, 'Table Mountain, Cape Town', 4, '["https://images.pexels.com/photos/1323550/pexels-photo-1323550.jpeg?auto=compress&cs=tinysrgb&w=800"]', 'Basic fitness level required. Bring comfortable hiking shoes and warm clothing.', true, NOW()),
        ((SELECT id FROM users WHERE email = 'naledi.williams@outlook.com'), 'Chapman''s Peak Sunset Drive & Wine', 'Experience one of the world''s most scenic drives along Chapman''s Peak. Stop at hidden viewpoints and enjoy local wine tasting.', 'Culture', 680.00, 180, 'Chapman''s Peak, Cape Town', 3, '["https://images.pexels.com/photos/1574653/pexels-photo-1574653.jpeg?auto=compress&cs=tinysrgb&w=800"]', 'Must be 18+ for wine tasting.', true, NOW()),
        ((SELECT id FROM users WHERE email = 'sipho.maharaj@gmail.com'), 'Johannesburg Gold Rush History Tour', 'Explore the fascinating history of Johannesburg''s gold mining heritage. Visit historic sites and enjoy traditional SA cuisine.', 'Culture', 480.00, 420, 'Johannesburg CBD', 8, '["https://images.pexels.com/photos/2026324/pexels-photo-2026324.jpeg?auto=compress&cs=tinysrgb&w=800"]', 'Comfortable walking shoes recommended.', true, NOW()),
        ((SELECT id FROM users WHERE email = 'nomsa.dlamini@gmail.com'), 'Soweto Cultural Experience & Traditional Lunch', 'Authentic township tour led by a local resident. Visit Nelson Mandela house and share a meal with a local family.', 'Culture', 380.00, 300, 'Soweto, Johannesburg', 6, '["https://images.pexels.com/photos/1559124041/pexels-photo-1559124041.jpeg?auto=compress&cs=tinysrgb&w=800"]', 'Open mind and heart required!', true, NOW())
        ON CONFLICT DO NOTHING
      `);
      
      console.log('✅ Demo data inserted successfully');
    }
    
    // Check if we need to add additional demo data (bookings, conversations, messages)
    const bookingCount = await pool.query('SELECT COUNT(*) FROM bookings');
    
    if (parseInt(bookingCount.rows[0].count) === 0) {
      console.log('🔗 Adding demo bookings, conversations, and messages...');
      
      // Get user IDs
      const users = await pool.query('SELECT id, email FROM users ORDER BY created_at');
      const experiences = await pool.query('SELECT id, title, host_id FROM experiences ORDER BY created_at');
      
      if (users.rows.length >= 4 && experiences.rows.length >= 4) {
        const [thabo, naledi, sipho, nomsa] = users.rows;
        const [exp1, exp2, exp3, exp4] = experiences.rows;
        
        // Insert demo bookings
        await pool.query(`
          INSERT INTO bookings (experience_id, guest_id, host_id, booking_date, status, total_amount, special_requests, created_at) VALUES
          ($1, $2, $3, NOW() + INTERVAL '5 days', 'confirmed', 350.00, 'First time hiking Table Mountain, please bring extra water!', NOW()),
          ($4, $5, $6, NOW() + INTERVAL '8 days', 'confirmed', 680.00, 'Celebrating a business milestone!', NOW()),
          ($7, $8, $9, NOW() + INTERVAL '10 days', 'pending', 380.00, 'Very interested in learning about local history and culture.', NOW())
        `, [
          exp1.id, naledi.id, thabo.id,  // Naledi books Thabo's hike
          exp2.id, sipho.id, naledi.id,  // Sipho books Naledi's drive
          exp4.id, thabo.id, nomsa.id    // Thabo books Nomsa's cultural tour
        ]);
        
        // Insert demo conversations
        await pool.query(`
          INSERT INTO conversations (participant_1, participant_2, last_message_at, created_at) VALUES
          ($1, $2, NOW() - INTERVAL '2 hours', NOW() - INTERVAL '1 day'),
          ($3, $4, NOW() - INTERVAL '1 hour', NOW() - INTERVAL '2 days'),
          ($5, $6, NOW() - INTERVAL '30 minutes', NOW() - INTERVAL '3 days')
        `, [
          thabo.id, naledi.id,  // Thabo and Naledi
          sipho.id, naledi.id,  // Sipho and Naledi  
          thabo.id, nomsa.id    // Thabo and Nomsa
        ]);
        
        // Get conversation IDs
        const conversations = await pool.query('SELECT id, participant_1, participant_2 FROM conversations ORDER BY created_at');
        
        // Insert demo messages
        for (const conv of conversations.rows) {
          await pool.query(`
            INSERT INTO messages (conversation_id, sender_id, content, created_at) VALUES
            ($1, $2, 'Hi! I''m excited about our upcoming experience booking!', NOW() - INTERVAL '2 hours'),
            ($1, $3, 'Hello! Yes, I''ve prepared something special. Looking forward to it!', NOW() - INTERVAL '1 hour 30 minutes'),
            ($1, $2, 'Perfect! What time should we meet?', NOW() - INTERVAL '1 hour'),
            ($1, $3, 'Let''s meet 15 minutes before the scheduled time. I''ll send you the exact location.', NOW() - INTERVAL '30 minutes')
          `, [conv.id, conv.participant_1, conv.participant_2]);
        }
        
        // Insert demo reviews
        const bookings = await pool.query('SELECT id, guest_id, host_id FROM bookings WHERE status = $1', ['confirmed']);
        
        if (bookings.rows.length > 0) {
          await pool.query(`
            INSERT INTO reviews (booking_id, reviewer_id, reviewee_id, rating, comment, created_at) VALUES
            ($1, $2, $3, 5, 'Absolutely incredible experience! Amazing guide and the location was breathtaking. Highly recommended!', NOW() - INTERVAL '1 day'),
            ($4, $5, $6, 5, 'What a fantastic way to explore! Perfect knowledge of the area and excellent hospitality. Will definitely book again!', NOW() - INTERVAL '2 days')
          `, [
            bookings.rows[0].id, bookings.rows[0].guest_id, bookings.rows[0].host_id,
            bookings.rows[1] ? bookings.rows[1].id : bookings.rows[0].id, 
            bookings.rows[1] ? bookings.rows[1].guest_id : bookings.rows[0].guest_id, 
            bookings.rows[1] ? bookings.rows[1].host_id : bookings.rows[0].host_id
          ]);
        }
        
        console.log('✅ Complete demo data inserted successfully');
      }
    }
    
    const finalUserCount = await pool.query('SELECT COUNT(*) FROM users');
    const finalExperienceCount = await pool.query('SELECT COUNT(*) FROM experiences');
    const finalBookingCount = await pool.query('SELECT COUNT(*) FROM bookings');
    const finalConversationCount = await pool.query('SELECT COUNT(*) FROM conversations');
    const finalMessageCount = await pool.query('SELECT COUNT(*) FROM messages');
    
    console.log('🎉 Database setup completed!');
    console.log(`📊 Final counts:`);
    console.log(`   Users: ${finalUserCount.rows[0].count}`);
    console.log(`   Experiences: ${finalExperienceCount.rows[0].count}`);
    console.log(`   Bookings: ${finalBookingCount.rows[0].count}`);
    console.log(`   Conversations: ${finalConversationCount.rows[0].count}`);
    console.log(`   Messages: ${finalMessageCount.rows[0].count}`);
    
    return true;
    
  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    throw error;
  } finally {
    await pool.end();
  }
}

async function main() {
  try {
    const status = await checkDatabaseConnection();
    
    if (!status.connected) {
      console.error('💥 Cannot proceed without database connection');
      process.exit(1);
    }
    
    if (!status.tablesExist) {
      console.log('🔧 Setting up database schema and data...');
      await runMigrations();
    } else if (!status.hasData) {
      console.log('🌱 Database exists but no data found, adding demo data...');
      await runMigrations();
    } else if (!status.hasCompleteData) {
      console.log('📝 Adding missing demo data (bookings, conversations, messages)...');
      await runMigrations();
    } else {
      console.log('✅ Database is ready!');
    }
    
    console.log('');
    console.log('🚀 Database check completed successfully!');
    console.log('💡 Demo accounts available:');
    console.log('   • thabo.mthembu@gmail.com (password: password123)');
    console.log('   • naledi.williams@outlook.com (password: password123)');
    console.log('   • sipho.maharaj@gmail.com (password: password123)');
    console.log('   • nomsa.dlamini@gmail.com (password: password123)');
    
  } catch (error) {
    console.error('💥 Database setup failed:', error.message);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = { checkDatabaseConnection, runMigrations };