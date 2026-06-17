// Setup script to create required database tables
// Run with: node --env-file-if-exists=/vercel/share/.env.project scripts/setup-tables.js

const { createClient } = require("@supabase/supabase-js");

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("Missing Supabase env vars");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function setupTables() {
  try {
    console.log("Setting up database tables...");

    // Create contact_messages table
    const { error: contactError } = await supabase
      .from("contact_messages")
      .select("id")
      .limit(1);

    if (contactError && contactError.code === "PGRST116") {
      console.log("Creating contact_messages table...");
      
      // Use raw SQL to create the table
      const { error: createError } = await supabase.rpc("exec", {
        sql: `
          CREATE TABLE IF NOT EXISTS contact_messages (
            id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
            name TEXT NOT NULL,
            email TEXT NOT NULL,
            phone TEXT,
            subject TEXT,
            message TEXT NOT NULL,
            status TEXT DEFAULT 'unread',
            created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
          );

          CREATE INDEX IF NOT EXISTS idx_contact_messages_status ON contact_messages(status);
          CREATE INDEX IF NOT EXISTS idx_contact_messages_created_at ON contact_messages(created_at);
        `
      });

      if (createError) {
        console.error("Could not create table via RPC, attempting alternative method...");
        // Table might already exist or require manual setup
        console.log("Please manually create the contact_messages table in Supabase with these columns:");
        console.log("- id (UUID, primary key)");
        console.log("- name (text)");
        console.log("- email (text)");
        console.log("- phone (text, optional)");
        console.log("- subject (text, optional)");
        console.log("- message (text)");
        console.log("- status (text, default: 'unread')");
        console.log("- created_at (timestamp)");
        console.log("- updated_at (timestamp)");
      } else {
        console.log("contact_messages table created successfully!");
      }
    } else {
      console.log("contact_messages table already exists");
    }

    console.log("Database setup complete!");
  } catch (error) {
    console.error("Setup failed:", error.message);
    process.exit(1);
  }
}

setupTables();
