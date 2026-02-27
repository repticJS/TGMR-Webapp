import { NextResponse } from "next/server";
import { fetchTeams } from "../../../../lib/tgmr-api";

export async function GET() {
  try {
    const teams = await fetchTeams();
    return NextResponse.json({ data: teams });
  } catch (error) {
    return NextResponse.json({ message: error.message || "Failed to fetch teams" }, { status: 500 });
  }
}
