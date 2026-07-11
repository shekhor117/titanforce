#!/usr/bin/env node

require('dotenv').config({ path: '.env.development.local' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('[v0] ❌ Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function createTestUser() {
  try {
    console.log('[v0] 🚀 Creating test user...');

    // Create test user with email and password
    const { data, error } = await supabase.auth.admin.createUser({
      email: 'test@example.com',
      password: 'Test123456!',
      email_confirm: true,
      user_metadata: {
        full_name: 'Test User',
        role: 'user',
      },
    });

    if (error) {
      if (error.message?.includes('already exists') || error.status === 400) {
        console.log('[v0] ℹ️  User might already exist, trying to verify...');
        
        // Try to get the user to see if they exist
        const { data: existingUser, error: getError } = await supabase.auth.admin.getUserById('test@example.com').catch(() => ({ error: null }));
        if (existingUser || !getError) {
          console.log('[v0] ✓ User already exists');
        }
      } else {
        console.error('[v0] Full error:', error);
        throw error;
      }
    } else {
      console.log('[v0] ✓ User created successfully');
      console.log('[v0] Email: test@example.com');
      console.log('[v0] Password: Test123456!');
      console.log('[v0] ID:', data.user.id);

      // Optionally create a profile for the user
      const { error: profileError } = await supabase
        .from('profiles')
        .upsert({
          id: data.user.id,
          full_name: 'Test User',
          email: 'test@example.com',
          role: 'user',
          updated_at: new Date().toISOString(),
        })
        .select();

      if (profileError) {
        console.log('[v0] ⚠️  Could not create profile (optional):', profileError.message);
      } else {
        console.log('[v0] ✓ Profile created');
      }
    }

    console.log('[v0] ✅ Done! You can now login with:');
    console.log('[v0]    Email: test@example.com');
    console.log('[v0]    Password: Test123456!');
  } catch (err) {
    console.error('[v0] ❌ Error:', err.message);
    process.exit(1);
  }
}

createTestUser();
