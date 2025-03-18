/*
  # Create habits table

  1. New Tables
    - `habits`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `name` (text)
      - `streak` (integer)
      - `completed` (boolean)
      - `timer` (jsonb)
      - `completion_history` (jsonb)
      - `created_at` (timestamp with time zone)

  2. Security
    - Enable RLS on `habits` table
    - Add policies for authenticated users to:
      - Read their own habits
      - Create new habits
      - Update their own habits
      - Delete their own habits
*/

CREATE TABLE IF NOT EXISTS habits (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  name text NOT NULL,
  streak integer DEFAULT 0,
  completed boolean DEFAULT false,
  timer jsonb DEFAULT '{"hours": 0, "minutes": 0}'::jsonb,
  completion_history jsonb DEFAULT '[]'::jsonb,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE habits ENABLE ROW LEVEL SECURITY;

-- Policy for reading habits
CREATE POLICY "Users can read own habits"
  ON habits
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Policy for creating habits
CREATE POLICY "Users can create habits"
  ON habits
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Policy for updating habits
CREATE POLICY "Users can update own habits"
  ON habits
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Policy for deleting habits
CREATE POLICY "Users can delete own habits"
  ON habits
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);