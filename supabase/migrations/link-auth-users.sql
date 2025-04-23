-- This migration links existing auth.users with user_profiles
-- It should be run after the initial schema creation

-- Add auth_user_id column to user_profiles if it doesn't exist
ALTER TABLE user_profiles 
ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

-- Create a trigger to automatically create a profile when a new user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_profiles (user_id, username, email, display_name)
  VALUES (
    NEW.id, 
    'user' || floor(random() * 10000)::text, 
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'New User')
  );
  
  -- Create default settings for the new user
  INSERT INTO public.user_notification_settings (user_id)
  VALUES (currval('user_profiles_id_seq'));
  
  INSERT INTO public.user_privacy_settings (user_id)
  VALUES (currval('user_profiles_id_seq'));
  
  INSERT INTO public.user_appearance_settings (user_id)
  VALUES (currval('user_profiles_id_seq'));
  
  INSERT INTO public.user_stats (user_id)
  VALUES (currval('user_profiles_id_seq'));
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create the trigger if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'on_auth_user_created'
  ) THEN
    CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();
  END IF;
END
$$;
