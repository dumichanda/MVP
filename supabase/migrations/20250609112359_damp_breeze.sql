-- Insert sample users (with hashed passwords for 'password123')
INSERT INTO users (
  id,
  email,
  password_hash,
  full_name,
  avatar_url,
  bio,
  location,
  verified,
  interests
) VALUES 
(
  '00000000-0000-0000-0000-000000000001',
  'nomsa@example.com',
  '$2a$12$LQv3c1yqBw2LeOI.UKNOSuOiUiIxpnxreleqiI2nJLFIGAhGy3oHu', -- password123
  'Nomsa Dlamini',
  '',
  'Passionate chef and food enthusiast. I love creating memorable dining experiences.',
  'Sandton, Johannesburg',
  true,
  ARRAY['cooking', 'wine', 'hospitality']
),
(
  '00000000-0000-0000-0000-000000000002',
  'michael@example.com',
  '$2a$12$LQv3c1yqBw2LeOI.UKNOSuOiUiIxpnxreleqiI2nJLFIGAhGy3oHu', -- password123
  'Michael Chen',
  '',
  'Art curator and wine connoisseur. Combining culture with great experiences.',
  'Cape Town Waterfront',
  true,
  ARRAY['art', 'wine', 'culture']
),
(
  '00000000-0000-0000-0000-000000000003',
  'sarah@example.com',
  '$2a$12$LQv3c1yqBw2LeOI.UKNOSuOiUiIxpnxreleqiI2nJLFIGAhGy3oHu', -- password123
  'Sarah Johnson',
  '',
  'Adventure seeker and pilot. Love showing people the beauty from above.',
  'Johannesburg CBD',
  true,
  ARRAY['adventure', 'flying', 'photography']
);

-- Insert sample experiences
INSERT INTO experiences (
  id,
  title,
  description,
  location,
  category,
  price,
  max_guests,
  host_id,
  images,
  tags,
  status,
  cancellation_policy
) VALUES 
(
  gen_random_uuid(),
  'Romantic Dinner at Sunset',
  'A beautiful dinner experience with city views and gourmet cuisine. Perfect for couples looking for an intimate evening together. Enjoy a carefully curated menu featuring local ingredients and international flavors.',
  'Sandton City, Johannesburg',
  'Dining',
  450.00,
  2,
  '00000000-0000-0000-0000-000000000001',
  ARRAY['https://images.pexels.com/photos/3201921/pexels-photo-3201921.jpeg?auto=compress&cs=tinysrgb&w=800'],
  ARRAY['romantic', 'dinner', 'sunset', 'gourmet'],
  'active',
  'moderate'
),
(
  gen_random_uuid(),
  'Wine Tasting & Art Gallery',
  'Explore local art while enjoying premium wine selections in an intimate gallery setting. Learn about wine pairing and discover emerging local artists.',
  'Cape Town Waterfront',
  'Culture',
  320.00,
  4,
  '00000000-0000-0000-0000-000000000002',
  ARRAY['https://images.pexels.com/photos/1574653/pexels-photo-1574653.jpeg?auto=compress&cs=tinysrgb&w=800'],
  ARRAY['wine', 'art', 'culture', 'tasting'],
  'active',
  'flexible'
),
(
  gen_random_uuid(),
  'Helicopter City Tour',
  'See the city from above on this exclusive helicopter tour designed for couples. Experience breathtaking views and create unforgettable memories.',
  'Johannesburg CBD',
  'Adventure',
  1200.00,
  2,
  '00000000-0000-0000-0000-000000000003',
  ARRAY['https://images.pexels.com/photos/723240/pexels-photo-723240.jpeg?auto=compress&cs=tinysrgb&w=800'],
  ARRAY['helicopter', 'adventure', 'scenic', 'luxury'],
  'active',
  'strict'
),
(
  gen_random_uuid(),
  'Cooking Class & Market Tour',
  'Start with a guided tour of local markets, then learn to cook traditional South African dishes together. Perfect for food lovers!',
  'Bo-Kaap, Cape Town',
  'Dining',
  280.00,
  6,
  '00000000-0000-0000-0000-000000000001',
  ARRAY['https://images.pexels.com/photos/2474661/pexels-photo-2474661.jpeg?auto=compress&cs=tinysrgb&w=800'],
  ARRAY['cooking', 'market', 'traditional', 'food'],
  'active',
  'moderate'
),
(
  gen_random_uuid(),
  'Sunset Safari Drive',
  'Experience the African wilderness on a private sunset safari. Spot wildlife while enjoying champagne and canapés.',
  'Pilanesberg National Park',
  'Adventure',
  850.00,
  4,
  '00000000-0000-0000-0000-000000000002',
  ARRAY['https://images.pexels.com/photos/631317/pexels-photo-631317.jpeg?auto=compress&cs=tinysrgb&w=800'],
  ARRAY['safari', 'wildlife', 'sunset', 'champagne'],
  'active',
  'moderate'
),
(
  gen_random_uuid(),
  'Jazz Club & Cocktails',
  'Enjoy live jazz music in an intimate venue while sipping craft cocktails. Perfect for music lovers and a sophisticated night out.',
  'Newtown, Johannesburg',
  'Entertainment',
  180.00,
  8,
  '00000000-0000-0000-0000-000000000003',
  ARRAY['https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg?auto=compress&cs=tinysrgb&w=800'],
  ARRAY['jazz', 'music', 'cocktails', 'nightlife'],
  'active',
  'flexible'
);