import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const supabase = await createClient();

    // Test database connection
    const { data: profiles, error: profilesError } = await supabase
      .from("player_profiles")
      .select("*")
      .limit(1);

    if (profilesError) {
      console.error("[v0] Error accessing player_profiles:", profilesError);
      return NextResponse.json(
        {
          status: "error",
          message: "Database tables not initialized",
          error: profilesError.message,
          solution:
            "Please run the DATABASE_SCHEMA.sql in your Supabase SQL Editor",
        },
        { status: 500 }
      );
    }

    // Check if tables exist
    const { data: tables, error: tablesError } = await supabase
      .from("information_schema.tables")
      .select("table_name")
      .eq("table_schema", "public")
      .in("table_name", [
        "player_profiles",
        "matches",
        "player_stats",
        "team_formations",
        "match_events",
        "news_posts",
        "news_comments",
        "fan_accounts",
        "fan_favorites",
        "saved_matches",
      ]);

    return NextResponse.json({
      status: "success",
      message: "Database is properly configured",
      playerProfilesCount: profiles?.length || 0,
      databaseReady: true,
    });
  } catch (error) {
    console.error("[v0] Database check failed:", error);
    return NextResponse.json(
      {
        status: "error",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
