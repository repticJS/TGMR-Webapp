const TEAMS_API = "https://api.dev.rsc-community.com/v2/TGMR/teams";
const PLAYERS_API = "https://api.dev.rsc-community.com/v2/TGMR/players";

async function fetchJson(url) {
  const response = await fetch(url, { cache: "no-store" });
  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }

  return response.json();
}

export async function fetchTeams() {
  const payload = await fetchJson(TEAMS_API);

  if (Array.isArray(payload)) {
    return payload;
  }

  if (Array.isArray(payload.data)) {
    return payload.data;
  }

  throw new Error("Unexpected teams payload format");
}

export async function fetchPlayers() {
  const payload = await fetchJson(PLAYERS_API);
  return payload.data ?? [];
}
