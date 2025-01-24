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