import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { artist_name, song_title, genre, release_date, audio_url } = body;

    if (!artist_name || !song_title || !genre || !release_date || !audio_url) {
      return NextResponse.json(
        { error: "Missing required fields." },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("releases")
      .insert({ artist_name, song_title, genre, release_date, audio_url, status: "Pending Review" })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ release: data }, { status: 201 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Server error.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const artistName = searchParams.get("artist_name");

    if (!artistName) {
      return NextResponse.json({ error: "artist_name is required." }, { status: 400 });
    }

    const { data, error } = await supabase
      .from("releases")
      .select("*")
      .eq("artist_name", artistName)
      .order("created_at", { ascending: false });

    if (error) throw error;

    return NextResponse.json({ releases: data });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Server error.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
