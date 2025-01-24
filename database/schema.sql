-- Create the user_points table
CREATE TABLE user_points (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  points INTEGER DEFAULT 10,
  last_reset TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  completed_tasks TEXT[] DEFAULT '{}',
  is_pro BOOLEAN DEFAULT false,
  tasks_completed INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id)
);

-- Set up Row Level Security (RLS)
ALTER TABLE user_points ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own points"
  ON user_points FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own points"
  ON user_points FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own points"
  ON user_points FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Add policy for deduct_point function
CREATE POLICY "Allow point deduction through function"
  ON user_points
  FOR UPDATE
  USING (true)
  WITH CHECK (true);

-- Create function for atomic point deduction
CREATE OR REPLACE FUNCTION deduct_point(user_id_input UUID, points_to_deduct INTEGER)
RETURNS BOOLEAN
AS $$
DECLARE
  rows_affected INTEGER;
  current_points INTEGER;
  is_pro_user BOOLEAN;
BEGIN
  -- First get current points and pro status
  SELECT points, is_pro INTO current_points, is_pro_user
  FROM user_points
  WHERE user_id = user_id_input;
  
  RAISE NOTICE 'User ID: %, Current Points: %, Is Pro: %, Points to Deduct: %', 
    user_id_input, current_points, is_pro_user, points_to_deduct;

  UPDATE user_points
  SET points = points - points_to_deduct
  WHERE user_id = user_id_input
    AND points >= points_to_deduct
    AND NOT is_pro;
    
  GET DIAGNOSTICS rows_affected = ROW_COUNT;
  
  RAISE NOTICE 'Rows affected: %', rows_affected;
  
  RETURN rows_affected > 0;
END;
$$
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public; 