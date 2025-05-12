-- Create system_settings table if it doesn't exist
CREATE TABLE IF NOT EXISTS system_settings (
  id SERIAL PRIMARY KEY,
  key VARCHAR(255) NOT NULL UNIQUE,
  value TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default settings if they don't exist
INSERT INTO system_settings (key, value, description)
VALUES 
  ('maintenance_mode', 'false', 'Whether the site is in maintenance mode'),
  ('registration_open', 'true', 'Whether new user registration is open'),
  ('platform_name', 'K-Clash', 'The name of the platform'),
  ('platform_description', 'Kenya''s Premier Gaming Platform', 'The description of the platform'),
  ('contact_email', 'support@k-clash.com', 'The contact email for the platform'),
  ('max_upload_size', '10', 'Maximum upload size in MB')
ON CONFLICT (key) DO NOTHING;
