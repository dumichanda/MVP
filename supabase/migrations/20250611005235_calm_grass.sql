-- sql/seed.sql - Demo data with correct credentials

-- Clear existing data
DELETE FROM reviews;
DELETE FROM messages;
DELETE FROM bookings;
DELETE FROM experiences;
DELETE FROM users;

-- Reset sequences if they exist
DO $$ 
BEGIN
    IF EXISTS (SELECT 1 FROM pg_class WHERE relname = 'users_id_seq') THEN
        ALTER SEQUENCE users_id_seq RESTART WITH 1;
    END IF;
    IF EXISTS (SELECT 1 FROM pg_class WHERE relname = 'experiences_id_seq') THEN
        ALTER SEQUENCE experiences_id_seq RESTART WITH 1;
    END IF;
    IF EXISTS (SELECT 1 FROM pg_class WHERE relname = 'bookings_id_seq') THEN
        ALTER SEQUENCE bookings_id_seq RESTART WITH 1;
    END IF;
END $$;

-- Insert demo users with correct credentials
-- Password: password123 (hashed with bcrypt)
INSERT INTO users (email, password, first_name, last_name, bio, interests, location, phone, verified, created_at) VALUES
('thabo.mthembu@gmail.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/VcSforHgK', 'Thabo', 'Mthembu', 'Love exploring the Mother City! Big fan of hiking Table Mountain and enjoying good wine in Stellenbosch.', ARRAY['Hiking', 'Wine Tasting', 'Photography', 'Rugby'], 'Cape Town, Western Cape', '+27 82 123 4567', true, NOW()),
('naledi.williams@outlook.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/VcSforHgK', 'Naledi', 'Williams', 'Proudly from the Western Cape! I enjoy wine tastings, art galleries, and sunset drives along Chapman''s Peak.', ARRAY['Wine Tasting', 'Art', 'Photography', 'Beach Activities'], 'Camps Bay, Cape Town', '+27 83 234 5678', true, NOW()),
('sipho.maharaj@gmail.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/VcSforHgK', 'Sipho', 'Maharaj', 'Joburg entrepreneur with a love for the city''s energy. Enjoy jazz at the Market Theatre and good curry in Fordsburg.', ARRAY['Jazz Music', 'Entrepreneurship', 'Food', 'Networking'], 'Sandton, Johannesburg', '+27 84 345 6789', true, NOW()),
('lerato.sibeko@hotmail.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/VcSforHgK', 'Lerato', 'Sibeko', 'Marketing executive who loves the hustle and bustle of Jozi. Passionate about local art and finding the best bunny chow!', ARRAY['Marketing', 'Art', 'Food', 'City Life'], 'Rosebank, Johannesburg', '+27 85 456 7890', true, NOW()),
('nomsa.dlamini@gmail.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/VcSforHgK', 'Nomsa', 'Dlamini', 'Teacher and community volunteer from Soweto. Love traditional dancing, local music, and sharing stories about our heritage.', ARRAY['Teaching', 'Traditional Dancing', 'Music', 'Community Work'], 'Soweto, Johannesburg', '+27 86 567 8901', true, NOW());

-- Insert demo experiences
INSERT INTO experiences (host_id, title, description, category, price, duration, location, max_participants, images, requirements, active, created_at) VALUES
((SELECT id FROM users WHERE email = 'thabo.mthembu@gmail.com'), 'Table Mountain Sunrise Hike & Coffee', 'Join me for an early morning hike up Table Mountain via Platteklip Gorge. Watch the sunrise over Cape Town and enjoy fresh coffee at the top. Perfect for couples or small groups looking for an unforgettable experience.', 'Adventure', 350.00, 240, 'Table Mountain, Cape Town', 4, '["https://images.pexels.com/photos/1323550/pexels-photo-1323550.jpeg?auto=compress&cs=tinysrgb&w=800"]', 'Basic fitness level required. Bring comfortable hiking shoes and warm clothing.', true, NOW()),

((SELECT id FROM users WHERE email = 'naledi.williams@outlook.com'), 'Chapman''s Peak Sunset Drive & Wine Tasting', 'Experience one of the world''s most scenic drives along Chapman''s Peak. Stop at hidden viewpoints for photos and enjoy a curated wine tasting session with local Western Cape wines.', 'Culture', 680.00, 180, 'Chapman''s Peak, Cape Town', 3, '["https://images.pexels.com/photos/1574653/pexels-photo-1574653.jpeg?auto=compress&cs=tinysrgb&w=800"]', 'Must be 18+ for wine tasting. Valid driver''s license required if you want to drive.', true, NOW()),

((SELECT id FROM users WHERE email = 'sipho.maharaj@gmail.com'), 'Johannesburg Gold Rush History Tour', 'Explore the fascinating history of Johannesburg''s gold mining heritage. Visit historic sites in the CBD, learn about the city''s origins, and enjoy traditional South African cuisine.', 'Culture', 480.00, 420, 'Johannesburg CBD', 8, '["https://images.pexels.com/photos/2026324/pexels-photo-2026324.jpeg?auto=compress&cs=tinysrgb&w=800"]', 'Comfortable walking shoes recommended. Tour includes lunch.', true, NOW()),

((SELECT id FROM users WHERE email = 'nomsa.dlamini@gmail.com'), 'Soweto Cultural Experience & Traditional Lunch', 'Authentic township tour led by a local resident. Visit Nelson Mandela''s house, learn about our rich history, and share a traditional meal with a local family. Experience true Ubuntu spirit.', 'Culture', 380.00, 300, 'Soweto, Johannesburg', 6, '["https://images.pexels.com/photos/1559124041/pexels-photo-1559124041.jpeg?auto=compress&cs=tinysrgb&w=800"]', 'Open mind and heart required! Vegetarian options available.', true, NOW()),

((SELECT id FROM users WHERE email = 'lerato.sibeko@hotmail.com'), 'Johannesburg Art Gallery & Coffee Tour', 'Discover Johannesburg''s vibrant art scene! Visit local galleries in Maboneng and Braamfontein, meet local artists, and enjoy artisanal coffee at hidden gems around the city.', 'Arts & Culture', 320.00, 180, 'Maboneng, Johannesburg', 5, '["https://images.pexels.com/photos/1407846/pexels-photo-1407846.jpeg?auto=compress&cs=tinysrgb&w=800"]', 'Interest in art and culture. Camera recommended for photos.', true, NOW());

-- Insert some demo bookings
INSERT INTO bookings (experience_id, guest_id, host_id, booking_date, status, total_amount, special_requests, created_at) VALUES
((SELECT id FROM experiences WHERE title = 'Table Mountain Sunrise Hike & Coffee'), (SELECT id FROM users WHERE email = 'naledi.williams@outlook.com'), (SELECT id FROM users WHERE email = 'thabo.mthembu@gmail.com'), '2025-06-15 05:30:00', 'confirmed', 350.00, 'First time hiking Table Mountain, please bring extra water!', NOW()),

((SELECT id FROM experiences WHERE title = 'Chapman''s Peak Sunset Drive & Wine Tasting'), (SELECT id FROM users WHERE email = 'sipho.maharaj@gmail.com'), (SELECT id FROM users WHERE email = 'naledi.williams@outlook.com'), '2025-06-18 16:00:00', 'confirmed', 680.00, 'Celebrating a business milestone!', NOW()),

((SELECT id FROM experiences WHERE title = 'Soweto Cultural Experience & Traditional Lunch'), (SELECT id FROM users WHERE email = 'thabo.mthembu@gmail.com'), (SELECT id FROM users WHERE email = 'nomsa.dlamini@gmail.com'), '2025-06-20 11:00:00', 'pending', 380.00, 'Very interested in learning about local history and culture.', NOW());

-- Insert demo reviews
INSERT INTO reviews (booking_id, reviewer_id, reviewee_id, rating, comment, created_at) VALUES
((SELECT id FROM bookings WHERE total_amount = 350.00), (SELECT id FROM users WHERE email = 'naledi.williams@outlook.com'), (SELECT id FROM users WHERE email = 'thabo.mthembu@gmail.com'), 5, 'Absolutely incredible experience! Thabo was an amazing guide and the sunrise was breathtaking. The coffee at the top was the perfect touch. Highly recommended!', NOW()),

((SELECT id FROM bookings WHERE total_amount = 680.00), (SELECT id FROM users WHERE email = 'sipho.maharaj@gmail.com'), (SELECT id FROM users WHERE email = 'naledi.williams@outlook.com'), 5, 'What a fantastic way to see Cape Town! Naledi knows all the best spots and the wine selection was excellent. Perfect for a special occasion.', NOW());