const TEAMS_API = "https://api.dev.rsc-community.com/v2/TGMR/teams";
const PLAYERS_API = "https://api.dev.rsc-community.com/v2/TGMR/players";

const routeHelpEl = document.getElementById("routeHelp");
const profileEl = document.getElementById("profile");
const achievementsEl = document.getElementById("achievements");
const achievementTemplate = document.getElementById("achievementCardTemplate");

init();

async function init() {
  const { type, uuid } = getRoute(window.location.pathname);

  if (!type || !uuid) {
    renderRouteHelp();
    return;
  }

  routeHelpEl.classList.add("hidden");

  try {
    if (type === "team") {
      const teams = await fetchTeams();
      const team = teams.find((item) => item.uuid === uuid);

      if (!team) {
        throw new Error(`Team ${uuid} was not found.`);
      }

      renderTeamProfile(team);
      renderAchievements(team.achievements ?? []);
      return;
    }

    const players = await fetchPlayers();
    const teams = await fetchTeams();
    const player = players.find((item) => item.uuid === uuid);

    if (!player) {
      throw new Error(`Player ${uuid} was not found.`);
    }

    const team = teams.find((item) => Number(item.id) === Number(player.team_id));
    renderPlayerProfile(player, team);
    renderAchievements(player.achievements ?? []);
  } catch (error) {
    renderError(error);
  }
}

function getRoute(pathname) {
  const parts = pathname.split("/").filter(Boolean);
  if (parts.length !== 2) {
    return { type: null, uuid: null };
  }

  const [type, uuid] = parts;
  if (!["team", "player"].includes(type)) {
    return { type: null, uuid: null };
  }

  return { type, uuid };
}

function renderRouteHelp() {
  routeHelpEl.innerHTML = `
    <h2>How to use</h2>
    <p>Open one of the following routes:</p>
    <ul>
      <li><code>/team/{uuid}</code> to view a team's achievements.</li>
      <li><code>/player/{uuid}</code> to view an individual player's achievements.</li>
    </ul>
    <p>Example achievement payload:</p>
    <pre class="code-block">[\n  {\n    "achievement_id": "minecraft:story/root",\n    "name": "Minecraft",\n    "description": "The heart and story of the game",\n    "background": "minecraft:gui/advancements/backgrounds/stone",\n    "type": "TASK",\n    "icon": "GRASS_BLOCK"\n  }\n]</pre>
  `;
}

function renderTeamProfile(team) {
  profileEl.classList.remove("hidden");
  profileEl.innerHTML = `
    <h2>Team: ${escapeHtml(team.name)}</h2>
    <div class="profile-grid">
      <img class="profile-logo" src="${escapeAttribute(team.logo)}" alt="${escapeAttribute(team.name)} logo" />
      <div>
        <ul class="meta-list">
          <li><strong>UUID:</strong> ${escapeHtml(team.uuid)}</li>
          <li><strong>Total players:</strong> ${escapeHtml(String(team.total_players ?? 0))}</li>
          <li><strong>Players:</strong> ${(team.players ?? []).map((player) => escapeHtml(player.minecraft_username || player.name)).join(", ") || "None"}</li>
        </ul>
      </div>
    </div>
  `;
}

function renderPlayerProfile(player, team) {
  profileEl.classList.remove("hidden");
  profileEl.innerHTML = `
    <h2>Player: ${escapeHtml(player.minecraft_username || player.username)}</h2>
    <ul class="meta-list">
      <li><strong>UUID:</strong> ${escapeHtml(player.uuid)}</li>
      <li><strong>Discord ID:</strong> ${escapeHtml(player.discord_id)}</li>
      <li><strong>Team:</strong> ${escapeHtml(team?.name ?? "No team")}</li>
      <li><strong>Captain:</strong> ${player.captain ? "Yes" : "No"}</li>
    </ul>
  `;
}

function renderAchievements(achievements) {
  achievementsEl.classList.remove("hidden");

  if (!achievements.length) {
    achievementsEl.innerHTML = `
      <h2>Achievements</h2>
      <p>No achievements have been recorded yet.</p>
    `;
    return;
  }

  const list = document.createElement("div");
  list.className = "achievement-list";

  for (const achievement of achievements) {
    const card = achievementTemplate.content.firstElementChild.cloneNode(true);
    card.querySelector(".achievement-title").textContent = achievement.name ?? achievement.achievement_id;
    card.querySelector(".achievement-description").textContent = achievement.description ?? "No description provided.";

    const meta = [
      achievement.achievement_id ? `ID: ${achievement.achievement_id}` : null,
      achievement.type ? `Type: ${achievement.type}` : null,
      achievement.icon ? `Icon: ${achievement.icon}` : null
    ]
      .filter(Boolean)
      .join(" • ");

    card.querySelector(".achievement-meta").textContent = meta;
    list.appendChild(card);
  }

  achievementsEl.innerHTML = "<h2>Achievements</h2>";
  achievementsEl.appendChild(list);
}

function renderError(error) {
  routeHelpEl.classList.remove("hidden");
  routeHelpEl.classList.add("error");
  routeHelpEl.innerHTML = `
    <h2>Unable to load data</h2>
    <p>${escapeHtml(error.message || "Unknown error")}</p>
    <p>Check your UUID and try again.</p>
  `;
}

async function fetchTeams() {
  const response = await fetch(TEAMS_API);
  if (!response.ok) {
    throw new Error(`Teams API failed with status ${response.status}`);
  }

  const payload = await response.json();
  if (Array.isArray(payload)) {
    return payload;
  }

  if (Array.isArray(payload.data)) {
    return payload.data;
  }

  throw new Error("Unexpected teams payload format");
}

async function fetchPlayers() {
  const response = await fetch(PLAYERS_API);
  if (!response.ok) {
    throw new Error(`Players API failed with status ${response.status}`);
  }

  const payload = await response.json();
  return payload.data ?? [];
}

function escapeHtml(value = "") {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function escapeAttribute(value = "") {
  return escapeHtml(value);
}
