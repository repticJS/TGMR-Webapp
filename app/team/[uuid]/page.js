import { notFound } from "next/navigation";
import { fetchTeams } from "../../../lib/tgmr-api";
import { AchievementList, ErrorPanel } from "../../../lib/ui";

export default async function TeamPage({ params }) {
  const { uuid } = params;

  try {
    const teams = await fetchTeams();
    const team = teams.find((item) => item.uuid === uuid);

    if (!team) {
      notFound();
    }

    return (
      <>
        <section className="panel">
          <h2>Team: {team.name}</h2>
          <div className="profile-grid">
            <img className="profile-logo" src={team.logo} alt={`${team.name} logo`} />
            <ul className="meta-list">
              <li>
                <strong>UUID:</strong> {team.uuid}
              </li>
              <li>
                <strong>Total players:</strong> {team.total_players ?? 0}
              </li>
              <li>
                <strong>Players:</strong>{" "}
                {(team.players ?? [])
                  .map((player) => player.minecraft_username || player.name)
                  .join(", ") || "None"}
              </li>
            </ul>
          </div>
        </section>
        <AchievementList achievements={team.achievements ?? []} />
      </>
    );
  } catch (error) {
    return <ErrorPanel message={error.message || "Team request failed."} />;
  }
}
