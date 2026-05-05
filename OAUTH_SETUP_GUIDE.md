# OAuth Setup Guide - Google & Facebook Authentication

## Overview
Your Titan Force app now supports OAuth login/signup with both Google and Facebook. This guide walks you through enabling these providers in Supabase.

---

## Part 1: Enable Google OAuth

### Step 1: Go to Supabase Dashboard
1. Open your [Supabase Dashboard](https://app.supabase.com)
2. Select your project
3. Go to **Authentication** → **Providers**

### Step 2: Enable Google
1. Find **Google** in the provider list
2. Click to expand it
3. Toggle **Enabled** to ON
4. You'll see two required fields:
   - **Client ID**
   - **Client Secret**

### Step 3: Get Google OAuth Credentials
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable **Google+ API**:
   - Search "Google+ API" in the search bar
   - Click **Enable**

4. Create OAuth 2.0 Credentials:
   - Go to **Credentials** (left sidebar)
   - Click **Create Credentials** → **OAuth client ID**
   - Choose **Web application**
   - Add Authorized redirect URIs:
     ```
     https://<your-supabase-project-id>.supabase.co/auth/v1/callback?provider=google
     ```
   - Click **Create**

5. Copy the **Client ID** and **Client Secret**

### Step 4: Add to Supabase
1. Return to Supabase Dashboard → **Google** provider
2. Paste **Client ID** in the Client ID field
3. Paste **Client Secret** in the Client Secret field
4. Click **Save**

---

## Part 2: Enable Facebook OAuth

### Step 1: Create Facebook App
1. Go to [Facebook Developers](https://developers.facebook.com/)
2. Log in or sign up
3. Go to **My Apps** → **Create App**
4. Choose **Consumer** app type
5. Fill in app details:
   - **App Name**: Your app name (e.g., "Titan Force")
   - **App Contact Email**: Your email
   - **App Purpose**: Select appropriate category

### Step 2: Add Facebook Login Product
1. In your app dashboard, click **+ Add Product**
2. Find **Facebook Login** and click **Set Up**
3. Choose **Web** as the platform

### Step 3: Configure OAuth Settings
1. Go to **Settings** → **Basic**
2. Copy your **App ID** and **App Secret** (you'll need these)

3. Go to **Facebook Login** → **Settings**
4. Add Valid OAuth Redirect URIs:
   ```
   https://<your-supabase-project-id>.supabase.co/auth/v1/callback?provider=facebook
   ```

5. In the same page, find **Valid OAuth Redirect URIs** section
6. Add your redirect URL and save

### Step 4: Add to Supabase
1. Go to Supabase Dashboard → **Authentication** → **Providers**
2. Find **Facebook**
3. Toggle **Enabled** to ON
4. Paste your **App ID** in the Client ID field
5. Paste your **App Secret** in the Client Secret field
6. Click **Save**

---

## Part 3: Test Your Setup

### Test Google Login
1. Go to your app's `/auth/login` page
2. Click **Login with Google**
3. You should be redirected to Google's login
4. After authentication, you should be logged in and redirected to home page

### Test Facebook Login
1. Go to your app's `/auth/login` page
2. Click **Login with Facebook**
3. You should be redirected to Facebook's login
4. After authentication, you should be logged in and redirected to home page

### Test Google Signup
1. Go to your app's `/auth/sign-up` page
2. Click **Sign up with Google**
3. Complete Google authentication
4. New account should be created automatically

### Test Facebook Signup
1. Go to your app's `/auth/sign-up` page
2. Click **Sign up with Facebook**
3. Complete Facebook authentication
4. New account should be created automatically

---

## Part 4: Troubleshooting

### "Invalid Client ID"
- Double-check that you've copied the correct Client ID and Secret
- Make sure there are no extra spaces or characters

### "Redirect URI mismatch"
- Verify the redirect URI exactly matches:
  ```
  https://<your-supabase-project-id>.supabase.co/auth/v1/callback?provider=google
  https://<your-supabase-project-id>.supabase.co/auth/v1/callback?provider=facebook
  ```
- The project ID must be your actual Supabase project ID

### "App not set up"
- Make sure you enabled the provider in Supabase
- For Google: Make sure Google+ API is enabled in Google Cloud Console
- For Facebook: Make sure Facebook Login product is added to your app

### Users can't authenticate
- Check browser console for error messages
- Verify environment variables are set correctly
- Make sure the callback URL matches in both provider dashboard and Supabase

---

## Environment Variables (Already Set)

Your app uses these environment variables (already configured):
```
NEXT_PUBLIC_SUPABASE_URL=<your-supabase-url>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-anon-key>
NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL=<your-redirect-url>
```

These are automatically handled by the OAuth flow.

---

## Code Changes Made

### Login Page (`app/auth/login/page.tsx`)
- Added `handleFacebookLogin()` function
- Added Facebook login button with loading state
- Maintains existing Google login functionality

### Signup Page (`app/auth/sign-up/page.tsx`)
- Added `handleFacebookSignUp()` function
- Added Facebook signup button with loading state
- Maintains existing Google signup functionality

Both use Supabase's built-in `signInWithOAuth()` API for secure authentication.

---

## Next Steps

1. Follow the setup instructions above to enable Google and Facebook OAuth
2. Test both login and signup flows
3. Deploy when ready - the code is production-ready

Your users can now authenticate with Google or Facebook in addition to traditional email/password!
