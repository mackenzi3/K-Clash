# Setting Up Google OAuth for K-Clash

This guide will walk you through the process of setting up Google OAuth for your K-Clash platform.

## 1. Create a Google Cloud Project

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Click on the project dropdown at the top of the page
3. Click on "New Project"
4. Enter a name for your project (e.g., "K-Clash")
5. Click "Create"

## 2. Configure OAuth Consent Screen

1. In your Google Cloud project, go to "APIs & Services" > "OAuth consent screen"
2. Select "External" as the user type (unless you have a Google Workspace organization)
3. Click "Create"
4. Fill in the required information:
   - App name: "K-Clash"
   - User support email: Your email address
   - Developer contact information: Your email address
5. Click "Save and Continue"
6. Skip adding scopes by clicking "Save and Continue"
7. Add test users if you're still in development (your email address)
8. Click "Save and Continue"
9. Review your settings and click "Back to Dashboard"

## 3. Create OAuth Credentials

1. In your Google Cloud project, go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "OAuth client ID"
3. Select "Web application" as the application type
4. Name: "K-Clash Web Client"
5. Add authorized JavaScript origins:
   - `https://your-vercel-domain.vercel.app` (your production URL)
   - `http://localhost:3000` (for local development)
6. Add authorized redirect URIs:
   - `https://your-vercel-domain.vercel.app/auth/callback`
   - `http://localhost:3000/auth/callback`
7. Click "Create"
8. Note down the Client ID and Client Secret

## 4. Configure Supabase Auth

1. Go to your Supabase project dashboard
2. Navigate to "Authentication" > "Providers"
3. Find "Google" in the list and click on it
4. Toggle the "Enable" switch to on
5. Enter the Client ID and Client Secret from the previous step
6. Set the Authorized redirect URI to `https://[YOUR_PROJECT_REF].supabase.co/auth/v1/callback`
7. Click "Save"

## 5. Update Environment Variables

Add the following environment variables to your Vercel project:

\`\`\`
NEXT_PUBLIC_SUPABASE_URL=https://your-supabase-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
\`\`\`

## 6. Test the Integration

1. Deploy your application
2. Navigate to the sign-in page
3. Click "Sign in with Google"
4. You should be redirected to Google's authentication page
5. After authenticating, you should be redirected back to your application

## Troubleshooting

If you encounter any issues:

1. Check that your redirect URIs are correctly configured in both Google Cloud and Supabase
2. Ensure your environment variables are correctly set in Vercel
3. Check the browser console for any errors
4. Verify that your Google Cloud project has the necessary APIs enabled
5. Make sure your OAuth consent screen is properly configured

For more detailed information, refer to:
- [Supabase Auth Documentation](https://supabase.com/docs/guides/auth)
- [Google OAuth Documentation](https://developers.google.com/identity/protocols/oauth2)
