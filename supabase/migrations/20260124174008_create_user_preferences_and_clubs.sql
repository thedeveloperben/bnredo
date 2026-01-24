/*
  # User Preferences and Club Bag Schema
  
  1. New Tables
    - `user_preferences`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users, unique)
      - `distance_unit` (text, 'yards' or 'meters')
      - `temperature_unit` (text, 'fahrenheit' or 'celsius')
      - `wind_speed_unit` (text, 'mph' or 'kmh')
      - `hand_preference` (text, 'right' or 'left')
      - `is_premium` (boolean, default false)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
    
    - `user_clubs`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `club_key` (text, e.g., 'driver', '7-iron')
      - `club_name` (text, display name)
      - `is_enabled` (boolean)
      - `custom_distance` (integer, in yards)
      - `sort_order` (integer)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
    
    - `weather_cache`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `location_lat` (double precision)
      - `location_lng` (double precision)
      - `location_name` (text)
      - `weather_data` (jsonb)
      - `cached_at` (timestamptz)
  
  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to manage their own data
*/

-- Create user_preferences table
CREATE TABLE IF NOT EXISTS user_preferences (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
  distance_unit text DEFAULT 'yards' CHECK (distance_unit IN ('yards', 'meters')),
  temperature_unit text DEFAULT 'fahrenheit' CHECK (temperature_unit IN ('fahrenheit', 'celsius')),
  wind_speed_unit text DEFAULT 'mph' CHECK (wind_speed_unit IN ('mph', 'kmh')),
  hand_preference text DEFAULT 'right' CHECK (hand_preference IN ('right', 'left')),
  is_premium boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create user_clubs table
CREATE TABLE IF NOT EXISTS user_clubs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  club_key text NOT NULL,
  club_name text NOT NULL,
  is_enabled boolean DEFAULT true,
  custom_distance integer NOT NULL,
  sort_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, club_key)
);

-- Create weather_cache table
CREATE TABLE IF NOT EXISTS weather_cache (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  location_lat double precision NOT NULL,
  location_lng double precision NOT NULL,
  location_name text,
  weather_data jsonb NOT NULL,
  cached_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_clubs ENABLE ROW LEVEL SECURITY;
ALTER TABLE weather_cache ENABLE ROW LEVEL SECURITY;

-- Policies for user_preferences
CREATE POLICY "Users can view own preferences"
  ON user_preferences FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own preferences"
  ON user_preferences FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own preferences"
  ON user_preferences FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own preferences"
  ON user_preferences FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Policies for user_clubs
CREATE POLICY "Users can view own clubs"
  ON user_clubs FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own clubs"
  ON user_clubs FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own clubs"
  ON user_clubs FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own clubs"
  ON user_clubs FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Policies for weather_cache
CREATE POLICY "Users can view own weather cache"
  ON weather_cache FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own weather cache"
  ON weather_cache FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own weather cache"
  ON weather_cache FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own weather cache"
  ON weather_cache FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_user_clubs_user_id ON user_clubs(user_id);
CREATE INDEX IF NOT EXISTS idx_user_clubs_sort_order ON user_clubs(user_id, sort_order);
CREATE INDEX IF NOT EXISTS idx_weather_cache_user_id ON weather_cache(user_id);
CREATE INDEX IF NOT EXISTS idx_weather_cache_cached_at ON weather_cache(cached_at);

-- Function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updated_at
DROP TRIGGER IF EXISTS update_user_preferences_updated_at ON user_preferences;
CREATE TRIGGER update_user_preferences_updated_at
  BEFORE UPDATE ON user_preferences
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_user_clubs_updated_at ON user_clubs;
CREATE TRIGGER update_user_clubs_updated_at
  BEFORE UPDATE ON user_clubs
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
