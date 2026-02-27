"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

export default function UuidFinder() {
  const router = useRouter();
  const [teams, setTeams] = useState([]);
  const [players, setPlayers] = useState([]);
  const [selectedTeamUuid, setSelectedTeamUuid] = useState("");
  const [selectedPlayerUuid, setSelectedPlayerUuid] = useState("");
  const [manualTeamUuid, setManualTeamUuid] = useState("");
  const [manualPlayerUuid, setManualPlayerUuid] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;

    async function load() {
      try {
        setLoading(true);
        const [teamsResponse, playersResponse] = await Promise.all([
          fetch("/api/tgmr/teams", { cache: "no-store" }),
          fetch("/api/tgmr/players", { cache: "no-store" })
        ]);

        if (!teamsResponse.ok || !playersResponse.ok) {
          throw new Error("Could not load teams/players right now.");
        }

        const teamsPayload = await teamsResponse.json();
        const playersPayload = await playersResponse.json();

        if (!mounted) {
          return;
        }

        setTeams(teamsPayload.data ?? []);
        setPlayers(playersPayload.data ?? []);
        setSelectedTeamUuid(teamsPayload.data?.[0]?.uuid ?? "");
        setSelectedPlayerUuid(playersPayload.data?.[0]?.uuid ?? "");
      } catch (loadError) {
        if (mounted) {
          setError(loadError.message || "Failed to load lookup data.");
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    load();

    return () => {
      mounted = false;
    };
  }, []);

  const hasDirectoryData = useMemo(() => teams.length > 0 || players.length > 0, [teams, players]);

  function goToTeam() {
    const uuid = (manualTeamUuid || selectedTeamUuid).trim();
    if (uuid) {
      router.push(`/team/${uuid}`);
    }
  }

  function goToPlayer() {
    const uuid = (manualPlayerUuid || selectedPlayerUuid).trim();
    if (uuid) {
      router.push(`/player/${uuid}`);
    }
  }

  return (
    <section className="panel finder-shell">
      <h2>Jump to your page</h2>
      <p>Select your player or team and go directly to your achievements.</p>

      {loading ? <p>Loading teams and players…</p> : null}
      {error ? <p className="helper-error">{error}</p> : null}

      {hasDirectoryData ? (
        <div className="finder-stack">
          <div className="finder-card">
            <h3>Player</h3>
            <select
              value={selectedPlayerUuid}
              onChange={(event) => setSelectedPlayerUuid(event.target.value)}
            >
              {players.map((player) => (
                <option key={player.uuid} value={player.uuid}>
                  {player.minecraft_username || player.username}
                </option>
              ))}
            </select>
            <button onClick={goToPlayer} disabled={!selectedPlayerUuid}>
              Go to player page
            </button>
          </div>

          <div className="finder-card">
            <h3>Team</h3>
            <select value={selectedTeamUuid} onChange={(event) => setSelectedTeamUuid(event.target.value)}>
              {teams.map((team) => (
                <option key={team.uuid} value={team.uuid}>
                  {team.name}
                </option>
              ))}
            </select>
            <button onClick={goToTeam} disabled={!selectedTeamUuid}>
              Go to team page
            </button>
          </div>
        </div>
      ) : (
        <div className="finder-stack">
          <div className="finder-card">
            <h3>Player UUID</h3>
            <input
              value={manualPlayerUuid}
              onChange={(event) => setManualPlayerUuid(event.target.value)}
              placeholder="Paste player UUID"
            />
            <button onClick={goToPlayer} disabled={!manualPlayerUuid.trim()}>
              Go to player page
            </button>
          </div>

          <div className="finder-card">
            <h3>Team UUID</h3>
            <input
              value={manualTeamUuid}
              onChange={(event) => setManualTeamUuid(event.target.value)}
              placeholder="Paste team UUID"
            />
            <button onClick={goToTeam} disabled={!manualTeamUuid.trim()}>
              Go to team page
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
