"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

const LOGO_URL = "https://tgmr.rsc-community.com/Logo.png";

function getPlayerName(player) {
  return player.minecraft_username || player.username || "Unknown player";
}

export default function UuidFinder() {
  const router = useRouter();
  const [teams, setTeams] = useState([]);
  const [players, setPlayers] = useState([]);
  const [selectedTeamUuid, setSelectedTeamUuid] = useState("");
  const [selectedPlayerUuid, setSelectedPlayerUuid] = useState("");
  const [playerSearch, setPlayerSearch] = useState("");
  const [manualTeamUuid, setManualTeamUuid] = useState("");
  const [manualPlayerUuid, setManualPlayerUuid] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;

    async function load() {
      try {
        setLoading(true);
        setError("");

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

  const sortedTeams = useMemo(
    () => [...teams].sort((a, b) => (a.name ?? "").localeCompare(b.name ?? "")),
    [teams]
  );

  const availablePlayers = useMemo(() => {
    const search = playerSearch.trim().toLowerCase();

    return players
      .filter((player) => player.team_id == null)
      .sort((a, b) => getPlayerName(a).localeCompare(getPlayerName(b)))
      .filter((player) => {
        if (!search) {
          return true;
        }

        return getPlayerName(player).toLowerCase().includes(search);
      });
  }, [players, playerSearch]);

  useEffect(() => {
    if (!selectedTeamUuid || !sortedTeams.some((team) => team.uuid === selectedTeamUuid)) {
      setSelectedTeamUuid(sortedTeams[0]?.uuid ?? "");
    }
  }, [sortedTeams, selectedTeamUuid]);

  useEffect(() => {
    if (!selectedPlayerUuid || !availablePlayers.some((player) => player.uuid === selectedPlayerUuid)) {
      setSelectedPlayerUuid(availablePlayers[0]?.uuid ?? "");
    }
  }, [availablePlayers, selectedPlayerUuid]);

  const hasDirectoryData = useMemo(
    () => sortedTeams.length > 0 || availablePlayers.length > 0,
    [sortedTeams.length, availablePlayers.length]
  );

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

      {loading ? (
        <div className="finder-loading" aria-live="polite">
          <img src={LOGO_URL} alt="Loading" className="loading-logo" />
          <p>Loading teams and players…</p>
        </div>
      ) : null}

      {error ? <p className="helper-error">{error}</p> : null}

      {!loading && hasDirectoryData ? (
        <div className="finder-stack">
          <div className="finder-card">
            <h3>Player</h3>
            <input
              value={playerSearch}
              onChange={(event) => setPlayerSearch(event.target.value)}
              placeholder="Search player name"
            />
            <select
              value={selectedPlayerUuid}
              onChange={(event) => setSelectedPlayerUuid(event.target.value)}
              disabled={!availablePlayers.length}
            >
              {availablePlayers.map((player) => (
                <option key={player.uuid} value={player.uuid}>
                  {getPlayerName(player)}
                </option>
              ))}
            </select>
            {!availablePlayers.length ? (
              <p className="helper-error">No unassigned players found for this search.</p>
            ) : null}
            <button onClick={goToPlayer} disabled={!selectedPlayerUuid}>
              Go to player page
            </button>
          </div>

          <div className="finder-card">
            <h3>Team</h3>
            <select value={selectedTeamUuid} onChange={(event) => setSelectedTeamUuid(event.target.value)}>
              {sortedTeams.map((team) => (
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
      ) : !loading ? (
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
      ) : null}
    </section>
  );
}
