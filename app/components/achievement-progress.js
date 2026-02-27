"use client";

import { useMemo, useState } from "react";

const NO_WORLD_LABEL = "None";

function normalizeWorldId(value) {
  return value || NO_WORLD_LABEL;
}

export default function AchievementProgress({ allAchievements, completedAchievements }) {
  const worlds = useMemo(() => {
    const worldIds = new Set(
      completedAchievements
        .map((achievement) => achievement.world_id)
        .filter((worldId) => Boolean(worldId))
    );

    return worldIds.size ? [...worldIds].sort() : [NO_WORLD_LABEL];
  }, [completedAchievements]);

  const [selectedWorldId, setSelectedWorldId] = useState(worlds[0]);

  const completedForSelectedWorld = useMemo(() => {
    const map = new Map();

    for (const achievement of completedAchievements) {
      const worldId = normalizeWorldId(achievement.world_id);

      if (worldId === selectedWorldId) {
        map.set(achievement.achievement_id, achievement);
      }
    }

    return map;
  }, [completedAchievements, selectedWorldId]);

  return (
    <section className="panel">
      <div className="achievement-header-row">
        <h2>Achievements</h2>
        <label className="world-filter-label">
          World ID:
          <select value={selectedWorldId} onChange={(event) => setSelectedWorldId(event.target.value)}>
            {worlds.map((worldId) => (
              <option value={worldId} key={worldId}>
                {worldId}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="achievement-list">
        {allAchievements.map((achievement) => {
          const isCompleted = completedForSelectedWorld.has(achievement.achievement_id);
          const meta = [
            achievement.achievement_id ? `ID: ${achievement.achievement_id}` : null,
            achievement.type ? `Type: ${achievement.type}` : null,
            achievement.icon ? `Icon: ${achievement.icon}` : null,
            `World ID: ${selectedWorldId}`
          ]
            .filter(Boolean)
            .join(" • ");

          return (
            <article key={achievement.achievement_id} className="achievement-card">
              <div className={`achievement-status ${isCompleted ? "completed" : "pending"}`}>
                {isCompleted ? "✓" : "○"}
              </div>
              <div>
                <h3 className="achievement-title">{achievement.name ?? achievement.achievement_id}</h3>
                <p className="achievement-description">
                  {achievement.description ?? "No description provided."}
                </p>
                <div className="achievement-meta">{meta}</div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
