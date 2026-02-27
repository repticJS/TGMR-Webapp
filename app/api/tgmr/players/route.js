import { NextResponse } from "next/server";
import { fetchPlayers } from "../../../../lib/tgmr-api";

export async function GET() {
  try {
    const players = await fetchPlayers();
    return NextResponse.json({ data: players });
  } catch (error) {
    return NextResponse.json({ message: error.message || "Failed to fetch players" }, { status: 500 });
  }
}
