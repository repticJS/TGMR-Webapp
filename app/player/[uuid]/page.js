import Link from "next/link";
import { notFound } from "next/navigation";
import AchievementProgress from "../../components/achievement-progress";
import AutoRefreshControls from "../../components/auto-refresh-controls";
import { buildAchievementCatalog } from "../../../lib/achievement-catalog";
import { fetchPlayers, fetchTeams } from "../../../lib/tgmr-api";
import { ErrorPanel } from "../../../lib/ui";

export default async function PlayerPage({ params }) {
  const { uuid } = params;

  try {
    const [players, teams] = await Promise.all([fetchPlayers(), fetchTeams()]);
    const player = players.find((item) => item.uuid === uuid);

    if (!player) {
      notFound();
    }

    const team = teams.find((item) => Number(item.id) === Number(player.team_id));
    const completedAchievements = player.achievements ?? [];
    const allAchievements = buildAchievementCatalog();

    return (
      <>
        <div className="page-controls">
          <Link className="back-link" href="/">
            ← Back to Home
          </Link>
          <AutoRefreshControls />
        </div>
        <section className="panel">
          <h2>Player: {player.minecraft_username || player.username}</h2>
          <ul className="meta-list">
            <li>
              <strong>UUID:</strong> {player.uuid}
            </li>
            <li>
              <strong>Discord ID:</strong> {player.discord_id}
            </li>
            <li>
              <strong>Team:</strong> {team?.name ?? "No team"}
            </li>
            <li>
              <strong>Captain:</strong> {player.captain ? "Yes" : "No"}
            </li>
          </ul>
        </section>
        <AchievementProgress
          allAchievements={allAchievements}
          completedAchievements={completedAchievements}
        />
      </>
    );
  } catch (error) {
    if (error?.digest === "NEXT_NOT_FOUND") {
      throw error;
    }

    return (
      <>
        <div className="page-controls">
          <Link className="back-link" href="/">
            ← Back to Home
          </Link>
          <AutoRefreshControls />
        </div>
        <ErrorPanel message={error.message || "Player request failed."} />
        <AchievementProgress allAchievements={buildAchievementCatalog()} completedAchievements={[]} />
      </>
    );
  }
}
