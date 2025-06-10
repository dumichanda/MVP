// scripts/setup-database.js
const { Client } = require('pg')
const fs = require('fs')
const path = require('path')

// Load environment variables manually
function loadEnv() {
  try {
    const envPath = path.join(process.cwd(), '.env.local')
    if (fs.existsSync(envPath)) {
      const envContent = fs.readFileSync(envPath, 'utf8')
      envContent.split('\n').forEach(line => {
        const [key, ...values] = line.split('=')
        if (key && values.length) {
          process.env[key.trim()] = values.join('=').trim()
        }
      })
    }
  } catch (error) {
    console.log('No .env.local file found, using system environment variables')
  }
}

// Database schema as string (embedded)
const SCHEMA_SQL = `
-- Drop existing tables if they exist
DROP TABLE IF EXISTS reviews CASCADE;
DROP TABLE IF EXISTS messages CASCADE;
DROP TABLE IF EXISTS bookings CASCADE;
DROP TABLE IF EXISTS experience_images CASCADE;
DROP TABLE IF EXISTS experiences CASCADE;
DROP TABLE IF EXISTS user_interests CASCADE;
DROP TABLE IF EXISTS interests CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Create users table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    bio TEXT,
    age INTEGER,
    gender VARCHAR(20),
    sexual_preference VARCHAR(50),
    location VARCHAR(255),
    city VARCHAR(100),
    province VARCHAR(100),
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    profile_image VARCHAR(500),
    is_verified BOOLEAN DEFAULT FALSE,
    fame_rating INTEGER DEFAULT 0,
    last_seen TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_online BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create interests table
CREATE TABLE interests (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    category VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create user_interests junction table
CREATE TABLE user_interests (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    interest_id INTEGER REFERENCES interests(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, interest_id)
);

-- Create experiences table
CREATE TABLE experiences (
    id SERIAL PRIMARY KEY,
    host_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    category VARCHAR(100) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'ZAR',
    duration VARCHAR(100),
    max_guests INTEGER DEFAULT 1,
    location VARCHAR(255) NOT NULL,
    city VARCHAR(100),
    province VARCHAR(100),
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    is_active BOOLEAN DEFAULT TRUE,
    rating DECIMAL(3, 2) DEFAULT 0,
    total_bookings INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create experience_images table
CREATE TABLE experience_images (
    id SERIAL PRIMARY KEY,
    experience_id INTEGER REFERENCES experiences(id) ON DELETE CASCADE,
    image_url VARCHAR(500) NOT NULL,
    is_primary BOOLEAN DEFAULT FALSE,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create bookings table
CREATE TABLE bookings (
    id SERIAL PRIMARY KEY,
    experience_id INTEGER REFERENCES experiences(id) ON DELETE CASCADE,
    guest_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    host_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    booking_date DATE NOT NULL,
    booking_time TIME,
    guests_count INTEGER DEFAULT 1,
    total_amount DECIMAL(10, 2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'ZAR',
    status VARCHAR(20) DEFAULT 'pending',
    payment_status VARCHAR(20) DEFAULT 'pending',
    special_requests TEXT,
    cancellation_reason TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT booking_status_check CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled')),
    CONSTRAINT payment_status_check CHECK (payment_status IN ('pending', 'paid', 'refunded', 'failed'))
);

-- Create messages table
CREATE TABLE messages (
    id SERIAL PRIMARY KEY,
    sender_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    receiver_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    booking_id INTEGER REFERENCES bookings(id) ON DELETE SET NULL,
    content TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    message_type VARCHAR(20) DEFAULT 'text',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT message_type_check CHECK (message_type IN ('text', 'image', 'system'))
);

-- Create reviews table
CREATE TABLE reviews (
    id SERIAL PRIMARY KEY,
    booking_id INTEGER REFERENCES bookings(id) ON DELETE CASCADE,
    reviewer_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    reviewee_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    experience_id INTEGER REFERENCES experiences(id) ON DELETE CASCADE,
    rating INTEGER NOT NULL,
    comment TEXT,
    is_public BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT rating_check CHECK (rating >= 1 AND rating <= 5),
    UNIQUE(booking_id, reviewer_id)
);

-- Create indexes for better performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_location ON users(city, province);
CREATE INDEX idx_users_last_seen ON users(last_seen);
CREATE INDEX idx_experiences_host_id ON experiences(host_id);
CREATE INDEX idx_experiences_category ON experiences(category);
CREATE INDEX idx_experiences_location ON experiences(city, province);
CREATE INDEX idx_experiences_active ON experiences(is_active);
CREATE INDEX idx_bookings_guest_id ON bookings(guest_id);
CREATE INDEX idx_bookings_host_id ON bookings(host_id);
CREATE INDEX idx_bookings_date ON bookings(booking_date);
CREATE INDEX idx_bookings_status ON bookings(status);
CREATE INDEX idx_messages_sender_receiver ON messages(sender_id, receiver_id);
CREATE INDEX idx_messages_unread ON messages(receiver_id, is_read);
CREATE INDEX idx_reviews_experience_id ON reviews(experience_id);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply updated_at triggers
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_experiences_updated_at BEFORE UPDATE ON experiences FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_bookings_updated_at BEFORE UPDATE ON bookings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
`

// Seed data as string (embedded)
const SEED_SQL = `
-- Clear existing data
DELETE FROM reviews;
DELETE FROM messages;
DELETE FROM bookings;
DELETE FROM experience_images;
DELETE FROM experiences;
DELETE FROM user_interests;
DELETE FROM interests;
DELETE FROM users;

-- Reset sequences
ALTER SEQUENCE users_id_seq RESTART WITH 1;
ALTER SEQUENCE interests_id_seq RESTART WITH 1;
ALTER SEQUENCE user_interests_id_seq RESTART WITH 1;
ALTER SEQUENCE experiences_id_seq RESTART WITH 1;
ALTER SEQUENCE experience_images_id_seq RESTART WITH 1;
ALTER SEQUENCE bookings_id_seq RESTART WITH 1;
ALTER SEQUENCE messages_id_seq RESTART WITH 1;
ALTER SEQUENCE reviews_id_seq RESTART WITH 1;

-- Insert South African interests
INSERT INTO interests (name, category) VALUES
('Hiking', 'Adventure'),
('Rock Climbing', 'Adventure'),
('Bungee Jumping', 'Adventure'),
('Shark Cage Diving', 'Adventure'),
('Safari', 'Adventure'),
('Surfing', 'Adventure'),
('Skydiving', 'Adventure'),
('Mountain Biking', 'Adventure'),
('Township Tours', 'Cultural'),
('Wine Tasting', 'Cultural'),
('Braai Culture', 'Cultural'),
('Traditional Dancing', 'Cultural'),
('Art Galleries', 'Cultural'),
('Jazz Music', 'Cultural'),
('Boerewors', 'Food'),
('Biltong Making', 'Food'),
('Bunny Chow', 'Food'),
('Rooibos Tea', 'Food'),
('Rugby', 'Sports'),
('Cricket', 'Sports'),
('Soccer', 'Sports'),
('Golf', 'Sports'),
('Live Music', 'Entertainment'),
('Festivals', 'Entertainment'),
('Big Five', 'Nature'),
('Whale Watching', 'Nature'),
('Beach Activities', 'Nature'),
('Conservation', 'Nature');

-- Insert South African users with realistic data
INSERT INTO users (email, password, name, bio, age, gender, sexual_preference, location, city, province, latitude, longitude, profile_image, is_verified, fame_rating, last_seen, is_online) VALUES
('thabo.mthembu@gmail.com', '$2a$10$XB3w.6xY8l6XQ9XdW7X7K.ZRrqR5RzFjNaJ3GKVpQ2mZmN8PdVKo6', 'Thabo Mthembu', 'Love exploring the Mother City! Big fan of hiking Table Mountain and enjoying good wine in Stellenbosch.', 28, 'male', 'women', 'Cape Town City Centre, Cape Town', 'Cape Town', 'Western Cape', -33.9249, 18.4241, 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400', true, 75, CURRENT_TIMESTAMP - INTERVAL '2 hours', false),
('naledi.williams@outlook.com', '$2a$10$XB3w.6xY8l6XQ9XdW7X7K.ZRrqR5RzFjNaJ3GKVpQ2mZmN8PdVKo6', 'Naledi Williams', 'Proudly from the Western Cape! I enjoy wine tastings, art galleries, and sunset drives along Chapman''s Peak.', 26, 'female', 'men', 'Camps Bay, Cape Town', 'Cape Town', 'Western Cape', -33.9551, 18.3770, 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400', true, 82, CURRENT_TIMESTAMP - INTERVAL '30 minutes', true),
('sipho.maharaj@gmail.com', '$2a$10$XB3w.6xY8l6XQ9XdW7X7K.ZRrqR5RzFjNaJ3GKVpQ2mZmN8PdVKo6', 'Sipho Maharaj', 'Joburg entrepreneur with a love for the city''s energy. Enjoy jazz at the Market Theatre and good curry in Fordsburg.', 31, 'male', 'women', 'Sandton, Johannesburg', 'Johannesburg', 'Gauteng', -26.1076, 28.0567, 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400', true, 79, CURRENT_TIMESTAMP - INTERVAL '1 hour', true),
('lerato.sibeko@hotmail.com', '$2a$10$XB3w.6xY8l6XQ9XdW7X7K.ZRrqR5RzFjNaJ3GKVpQ2mZmN8PdVKo6', 'Lerato Sibeko', 'Marketing executive who loves the hustle and bustle of Jozi. Passionate about local art and finding the best bunny chow!', 27, 'female', 'men', 'Rosebank, Johannesburg', 'Johannesburg', 'Gauteng', -26.1486, 28.0436, 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400', true, 84, CURRENT_TIMESTAMP - INTERVAL '3 hours', false),
('nomsa.dlamini@gmail.com', '$2a$10$XB3w.6xY8l6XQ9XdW7X7K.ZRrqR5RzFjNaJ3GKVpQ2mZmN8PdVKo6', 'Nomsa Dlamini', 'Teacher and community volunteer from Soweto. Love traditional dancing, local music, and sharing stories about our heritage.', 25, 'female', 'men', 'Soweto, Johannesburg', 'Johannesburg', 'Gauteng', -26.2678, 27.8546, 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=400', true, 76, CURRENT_TIMESTAMP - INTERVAL '2 hours', true),
('ravi.patel@outlook.com', '$2a$10$XB3w.6xY8l6XQ9XdW7X7K.ZRrqR5RzFjNaJ3GKVpQ2mZmN8PdVKo6', 'Ravi Patel', 'Software developer living in Durban. Love the beach lifestyle, curry cooking, and exploring the Drakensberg mountains.', 30, 'male', 'women', 'Umhlanga, Durban', 'Durban', 'KwaZulu-Natal', -29.7216, 31.0775, 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400', true, 80, CURRENT_TIMESTAMP - INTERVAL '1 hour', false),
('thandiwe.ngcobo@gmail.com', '$2a$10$XB3w.6xY8l6XQ9XdW7X7K.ZRrqR5RzFjNaJ3GKVpQ2mZmN8PdVKo6', 'Thandiwe Ngcobo', 'Proud Zulu woman working as a marine biologist. Love whale watching, surfing at Ballito, and exploring Zulu culture.', 28, 'female', 'men', 'Ballito, Durban', 'Ballito', 'KwaZulu-Natal', -29.5391, 31.2064, 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=400', true, 85, CURRENT_TIMESTAMP - INTERVAL '30 minutes', true),
('andre.botha@gmail.com', '$2a$10$XB3w.6xY8l6XQ9XdW7X7K.ZRrqR5RzFjNaJ3GKVpQ2mZmN8PdVKo6', 'André Botha', 'Government advisor who loves the Jacaranda City. Enjoy rugby matches at Loftus and weekend trips to the Bushveld.', 35, 'male', 'women', 'Hatfield, Pretoria', 'Pretoria', 'Gauteng', -25.7479, 28.2293, 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400', true, 73, CURRENT_TIMESTAMP - INTERVAL '6 hours', false),
('keitumetse.mogale@yahoo.com', '$2a$10$XB3w.6xY8l6XQ9XdW7X7K.ZRrqR5RzFjNaJ3GKVpQ2mZmN8PdVKo6', 'Keitumetse Mogale', 'Doctor working at Steve Biko Hospital. Love exploring the Union Buildings gardens and local craft markets.', 29, 'female', 'men', 'Brooklyn, Pretoria', 'Pretoria', 'Gauteng', -25.7615, 28.2122, 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400', true, 87, CURRENT_TIMESTAMP - INTERVAL '2 hours', false),
('michael.oosthuizen@gmail.com', '$2a$10$XB3w.6xY8l6XQ9XdW7X7K.ZRrqR5RzFjNaJ3GKVpQ2mZmN8PdVKo6', 'Michael Oosthuizen', 'Marine engineer in the Friendly City. Love kite surfing at Algoa Bay and visiting Addo Elephant Park.', 33, 'male', 'women', 'Summerstrand, Port Elizabeth', 'Port Elizabeth', 'Eastern Cape', -33.9715, 25.6464, 'https://images.unsplash.com/photo-1507591064344-4c6ce005b128?w=400', true, 78, CURRENT_TIMESTAMP - INTERVAL '4 hours', false);

-- Insert user interests
INSERT INTO user_interests (user_id, interest_id) VALUES
(1, 1), (1, 3), (1, 10), (1, 19), (1, 25),
(2, 10), (2, 13), (2, 23), (2, 26), (2, 27),
(3, 14), (3, 19), (3, 23), (3, 10), (3, 13),
(4, 13), (4, 12), (4, 17), (4, 23), (4, 24),
(5, 12), (5, 14), (5, 24), (5, 13), (5, 25),
(6, 6), (6, 3), (6, 8), (6, 18), (6, 26),
(7, 26), (7, 6), (7, 12), (7, 25), (7, 28),
(8, 19), (8, 13), (8, 15), (8, 25), (8, 22),
(9, 13), (9, 12), (9, 25), (9, 23), (9, 28),
(10, 6), (10, 26), (10, 28), (10, 25), (10, 8);

-- Insert South African experiences
INSERT INTO experiences (host_id, title, description, category, price, duration, max_guests, location, city, province, latitude, longitude, is_active, rating) VALUES
(1, 'Table Mountain Sunrise Hike & Coffee', 'Join me for an early morning hike up Table Mountain via Platteklip Gorge. Watch the sunrise over Cape Town and enjoy fresh coffee at the top.', 'Adventure', 350.00, '4 hours', 6, 'Table Mountain, Cape Town', 'Cape Town', 'Western Cape', -33.9626, 18.4097, true, 4.8),
(2, 'Chapman''s Peak Sunset Drive & Wine', 'Experience one of the world''s most scenic drives along Chapman''s Peak. Stop at hidden viewpoints and enjoy local wine tasting.', 'Cultural', 680.00, '3 hours', 4, 'Chapman''s Peak, Cape Town', 'Cape Town', 'Western Cape', -34.0875, 18.3512, true, 4.9),
(3, 'Johannesburg Gold Rush History Tour', 'Explore the fascinating history of Johannesburg''s gold mining heritage. Visit historic sites and enjoy traditional SA cuisine.', 'Cultural', 480.00, '7 hours', 12, 'Johannesburg CBD', 'Johannesburg', 'Gauteng', -26.2041, 28.0473, true, 4.5),
(4, 'Soweto Cultural Experience & Traditional Lunch', 'Authentic township tour led by a local resident. Visit Nelson Mandela''s house and share a meal with a local family.', 'Cultural', 380.00, '5 hours', 8, 'Soweto, Johannesburg', 'Johannesburg', 'Gauteng', -26.2678, 27.8546, true, 4.9),
(5, 'Traditional African Dancing Workshop', 'Learn traditional African dances and drumming techniques from expert instructors. Perfect for team building.', 'Cultural', 320.00, '3 hours', 15, 'Soweto Cultural Centre', 'Johannesburg', 'Gauteng', -26.2678, 27.8546, true, 4.8),
(6, 'Durban Shark Cage Diving Experience', 'Heart-pounding shark cage diving adventure off the KwaZulu-Natal coast. No diving experience required.', 'Adventure', 1200.00, '8 hours', 12, 'Umhlanga, Durban', 'Durban', 'KwaZulu-Natal', -29.7216, 31.0775, true, 4.9),
(7, 'Drakensberg Hiking & Zulu Cultural Experience', 'Multi-day hiking adventure in the Drakensberg mountains combined with authentic Zulu cultural experiences.', 'Adventure', 2400.00, '3 days', 8, 'Drakensberg Mountains', 'Bergville', 'KwaZulu-Natal', -28.7282, 29.4281, true, 4.8),
(8, 'Pretoria Jacaranda Festival Tour', 'Celebrate Pretoria''s famous jacaranda season with guided tours of the city''s most beautiful purple-lined streets.', 'Cultural', 450.00, '5 hours', 10, 'Pretoria City Centre', 'Pretoria', 'Gauteng', -25.7479, 28.2293, true, 4.6),
(9, 'Traditional Healing & Medicinal Plants Workshop', 'Learn about traditional African healing practices and medicinal plants from qualified healers.', 'Cultural', 280.00, '4 hours', 12, 'Mamelodi, Pretoria', 'Pretoria', 'Gauteng', -25.7081, 28.3559, true, 4.7),
(10, 'Addo Elephant Park Safari & Marine Experience', 'Full day safari in Addo Elephant Park followed by whale watching at Algoa Bay. See the Big 7.', 'Adventure', 950.00, '10 hours', 8, 'Addo Elephant Park, PE', 'Port Elizabeth', 'Eastern Cape', -33.4814, 25.7549, true, 4.8);

-- Insert experience images
INSERT INTO experience_images (experience_id, image_url, is_primary, display_order) VALUES
(1, 'https://images.unsplash.com/photo-1580060839134-75a5edca2e99?w=800', true, 1),
(2, 'https://images.unsplash.com/photo-1583309624962-2bea71d52a37?w=800', true, 1),
(3, 'https://images.unsplash.com/photo-1577717903315-1691ae25ab3f?w=800', true, 1),
(4, 'https://images.unsplash.com/photo-1559124041-4c4c5c82634a?w=800', true, 1),
(5, 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800', true, 1),
(6, 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800', true, 1),
(7, 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800', true, 1),
(8, 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800', true, 1),
(9, 'https://images.unsplash.com/photo-1607166452427-7e4477079cb9?w=800', true, 1),
(10, 'https://images.unsplash.com/photo-1516426122078-c23e76319801?w=800', true, 1);

-- Insert bookings
INSERT INTO bookings (experience_id, guest_id, host_id, booking_date, booking_time, guests_count, total_amount, status, payment_status, special_requests) VALUES
(1, 2, 1, '2025-06-15', '05:30:00', 2, 700.00, 'confirmed', 'paid', 'Please bring extra water bottles'),
(2, 3, 2, '2025-06-18', '16:00:00', 3, 2040.00, 'confirmed', 'paid', 'Celebrating anniversary'),
(3, 4, 3, '2025-06-20', '10:00:00', 4, 1920.00, 'pending', 'pending', 'Educational focus please'),
(4, 1, 4, '2025-05-15', '11:00:00', 2, 760.00, 'completed', 'paid', 'First time visiting Soweto'),
(5, 5, 5, '2025-05-25', '14:00:00', 10, 3200.00, 'completed', 'paid', 'Team building event'),
(6, 7, 6, '2025-05-28', '06:00:00', 6, 7200.00, 'completed', 'paid', 'Birthday celebration'),
(7, 8, 7, '2025-05-30', '07:00:00', 4, 9600.00, 'completed', 'paid', 'Honeymoon adventure'),
(8, 9, 8, '2025-06-28', '10:00:00', 6, 2700.00, 'confirmed', 'paid', 'Interested in jacaranda history'),
(9, 10, 9, '2025-07-02', '10:00:00', 8, 2240.00, 'pending', 'pending', 'Traditional medicine interest'),
(10, 1, 10, '2025-07-05', '07:00:00', 5, 4750.00, 'confirmed', 'paid', 'Wildlife photography');

-- Insert messages
INSERT INTO messages (sender_id, receiver_id, booking_id, content, is_read, message_type) VALUES
(2, 1, 1, 'Hi Thabo! Excited about our Table Mountain hike tomorrow. What should I bring?', true, 'text'),
(1, 2, 1, 'Hey Naledi! Bring hiking boots, water, and a warm jacket. Weather looks perfect! 🌅', true, 'text'),
(3, 2, 2, 'Looking forward to the Chapman''s Peak experience! My first time on that road.', true, 'text'),
(2, 3, 2, 'You''re in for a treat! It''s one of the most beautiful drives in the world 📸', true, 'text'),
(1, 4, 4, 'Nomsa, that Soweto tour was incredible! Thank you for sharing your community 🙏', true, 'text'),
(4, 1, 4, 'So glad you enjoyed it! Ubuntu spirit - you''re always welcome back 😊', true, 'text');

-- Insert reviews
INSERT INTO reviews (booking_id, reviewer_id, reviewee_id, experience_id, rating, comment, is_public) VALUES
(4, 1, 4, 4, 5, 'An absolutely authentic and moving experience! Nomsa was incredible. The family lunch was unforgettable - true Ubuntu spirit!', true),
(5, 5, 5, 5, 4, 'Such a fun team building experience! Our team loved learning traditional dances. Great instructors!', true),
(6, 7, 6, 6, 5, 'Bucket list item checked off! Seeing Great Whites up close was incredible. Professional team and delicious curry lunch!', true),
(7, 8, 7, 7, 5, 'What an adventure! Amazing knowledge of Zulu culture and the mountains. Perfect honeymoon activity!', true);

-- Update experience ratings and booking counts
UPDATE experiences SET rating = 4.8, total_bookings = 2 WHERE id = 1;
UPDATE experiences SET rating = 4.9, total_bookings = 1 WHERE id = 2;
UPDATE experiences SET rating = 4.5, total_bookings = 1 WHERE id = 3;
UPDATE experiences SET rating = 4.9, total_bookings = 1 WHERE id = 4;
UPDATE experiences SET rating = 4.8, total_bookings = 1 WHERE id = 5;
UPDATE experiences SET rating = 4.9, total_bookings = 1 WHERE id = 6;
UPDATE experiences SET rating = 4.8, total_bookings = 1 WHERE id = 7;
UPDATE experiences SET rating = 4.6, total_bookings = 1 WHERE id = 8;
UPDATE experiences SET rating = 4.7, total_bookings = 1 WHERE id = 9;
UPDATE experiences SET rating = 4.8, total_bookings = 1 WHERE id = 10;

-- Update user fame ratings
UPDATE users SET fame_rating = 85 WHERE id = 1;
UPDATE users SET fame_rating = 88 WHERE id = 2;
UPDATE users SET fame_rating = 79 WHERE id = 3;
UPDATE users SET fame_rating = 92 WHERE id = 4;
UPDATE users SET fame_rating = 86 WHERE id = 5;
UPDATE users SET fame_rating = 89 WHERE id = 6;
UPDATE users SET fame_rating = 87 WHERE id = 7;
UPDATE users SET fame_rating = 81 WHERE id = 8;
UPDATE users SET fame_rating = 83 WHERE id = 9;
UPDATE users SET fame_rating = 83 WHERE id = 10;
`

async function setupDatabase() {
  loadEnv()
  
  if (!process.env.DATABASE_URL) {
    console.error('❌ DATABASE_URL environment variable is required')
    process.exit(1)
  }

  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  })

  try {
    console.log('🗄️  Starting database setup...')
    
    await client.connect()
    console.log('✅ Connected to database')
    
    // Execute schema
    console.log('🔨 Creating database schema...')
    await client.query(SCHEMA_SQL)
    console.log('✅ Schema created successfully!')
    
    // Execute see
