// Seed script to create a test admin user
// Run with: node --env-file-if-exists=/vercel/share/.env.project scripts/seed-admin.js

const { createClient } = require("@supabase/supabase-js");

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("Missing Supabase env vars");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function seedAdmin() {
  try {
    console.log("Creating test admin user...");

    // Sign up as admin (this will create auth user)
    const { data, error } = await supabase.auth.admin.createUser({
      email: "admin@titanforce.com",
      password: "admin123",
      email_confirm: true,
      user_metadata: {
        full_name: "Admin User",
        role: "admin",
      },
    });

    if (error) {
      console.error("Error creating user:", error.message);
      return;
    }

    console.log("Auth user created:", data.user.id);

    // Create profile record
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .insert({
        id: data.user.id,
        name: "Admin User",
        email: "admin@titanforce.com",
        role: "admin",
        avatar_url: null,
      })
      .select();

    if (profileError) {
      console.error("Error creating profile:", profileError.message);
      return;
    }

    console.log("✓ Admin user created successfully!");
    console.log("Email: admin@titanforce.com");
    console.log("Password: admin123");
  } catch (error) {
    console.error("Error:", error);
  }
}

seedAdmin();
