#!/usr/bin/env node

// Script to create a test admin user in Supabase
const { createClient } = require("@supabase/supabase-js");

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error(
    "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY"
  );
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function createAdminUser() {
  try {
    console.log("[v0] Creating admin user...");

    // Create auth user with admin role
    const { data, error: authError } = await supabase.auth.admin.createUser({
      email: "admin@titanforce.com",
      password: "Admin123!",
      email_confirm: true,
      user_metadata: {
        full_name: "Admin User",
        role: "admin",
      },
    });

    if (authError) {
      console.error("[v0] Auth error:", authError);
      // If user already exists, that's ok
      if (!authError.message.includes("already exists")) {
        throw authError;
      }
      console.log("[v0] User already exists");
      
      // Get the existing user
      const { data: existingUser, error: getError } =
        await supabase.auth.admin.getUserById(
          "550e8400-e29b-41d4-a716-446655440000"
        );
      
      // Find by email instead
      const { data: users } = await supabase.auth.admin.listUsers();
      const adminUser = users?.find((u) => u.email === "admin@titanforce.com");
      
      if (adminUser) {
        console.log("[v0] Found existing admin user:", adminUser.id);
        return adminUser.id;
      }
    } else if (data.user) {
      console.log("[v0] Admin user created:", data.user.id);
      return data.user.id;
    }
  } catch (error) {
    console.error("[v0] Error creating admin user:", error);
    throw error;
  }
}

createAdminUser()
  .then((userId) => {
    console.log("[v0] Setup complete! Admin user ID:", userId);
    console.log("[v0] Email: admin@titanforce.com");
    console.log("[v0] Password: Admin123!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("[v0] Setup failed:", error);
    process.exit(1);
  });
