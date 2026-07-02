// Seed script to create demo player and demo match
// Run with: node --env-file-if-exists=/vercel/share/.env.project scripts/seed-demo-data.js

const { createClient } = require("@supabase/supabase-js");
const { v4: uuidv4 } = require("uuid");

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("Missing Supabase env vars");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function seedDemoData() {
  try {
    console.log("🎬 Creating demo player and match...\n");

    // Create a demo player
    const playerId = uuidv4();
    const demoPlayer = {
      id: playerId,
      name: "Alex Sterling",
      num: 7,
      position: "Forward",
      status: "active",
      goals: 12,
      assists: 5,
      appearances: 18,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const { data: playerData, error: playerError } = await supabase
      .from("players")
      .insert([demoPlayer])
      .select()
      .single();

    if (playerError) {
      console.error("Error creating player:", playerError.message);
      return;
    }

    console.log("✓ Demo player created:");
    console.log(`  Name: ${playerData.name}`);
    console.log(`  Number: ${playerData.num}`);
    console.log(`  Position: ${playerData.position}`);
    console.log(`  Status: ${playerData.status}`);
    console.log(`  Goals: ${playerData.goals}`);
    console.log(`  Assists: ${playerData.assists}\n`);

    // Create a demo match
    const matchId = uuidv4();
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const demoMatch = {
      id: matchId,
      home: "Titan Force",
      away: "Phoenix United",
      date: tomorrow.toISOString().split("T")[0],
      time: "19:30",
      venue: "Thunder Stadium",
      home_score: null,
      away_score: null,
      status: "upcoming",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const { data: matchData, error: matchError } = await supabase
      .from("matches")
      .insert([demoMatch])
      .select()
      .single();

    if (matchError) {
      console.error("Error creating match:", matchError.message);
      return;
    }

    console.log("✓ Demo match created:");
    console.log(`  Home: ${matchData.home}`);
    console.log(`  Away: ${matchData.away}`);
    console.log(`  Date: ${matchData.date}`);
    console.log(`  Time: ${matchData.time}`);
    console.log(`  Venue: ${matchData.venue}`);
    console.log(`  Status: ${matchData.status}\n`);

    console.log("✅ Demo data seeded successfully!");
  } catch (error) {
    console.error("Error:", error);
  }
}

seedDemoData();
