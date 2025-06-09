/*
  # Seed Data for Mavuso Dating App

  1. Sample Data
    - Sample profiles
    - Sample experiences
    - Sample time slots
    - Sample bookings (optional)

  2. Notes
    - This is for development/demo purposes
    - Real production data should be added through the app
*/

-- Insert sample profiles (these will need real auth users first)
-- Note: In production, profiles are created when users sign up

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
  '00000000-0000-0000-0000-000000000001'::uuid, -- Placeholder host ID
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
  '00000000-0000-0000-0000-000000000002'::uuid, -- Placeholder host ID
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
  '00000000-0000-0000-0000-000000000003'::uuid, -- Placeholder host ID
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
  '00000000-0000-0000-0000-000000000001'::uuid, -- Placeholder host ID
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
  '00000000-0000-0000-0000-000000000002'::uuid, -- Placeholder host ID
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
  '00000000-0000-0000-0000-000000000003'::uuid, -- Placeholder host ID
  ARRAY['https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg?auto=compress&cs=tinysrgb&w=800'],
  ARRAY['jazz', 'music', 'cocktails', 'nightlife'],
  'active',
  'flexible'
);

-- Note: Time slots and other data should be added through the application
-- as they depend on real user IDs from Supabase Auth