"use client";

import { useMemo, useState } from "react";

function normalizeWorldId(value) {
  return value || "default";
}

export default function AchievementProgress({ allAchievements, completedAchievements }) {
  const worlds = useMemo(() => {
    const worldIds = new Set();

    for (const achievement of allAchievements) {
      worldIds.add(normalizeWorldId(achievement.world_id));
    }

    for (const achievement of completedAchievements) {
      worldIds.add(normalizeWorldId(achievement.world_id));
    }

    return [...worldIds].sort();
  }, [allAchievements, completedAchievements]);

  const [selectedWorldId, setSelectedWorldId] = useState(worlds[0] || "default");

  const completedByWorld = useMemo(() => {
    const map = new Map();

    for (const achievement of completedAchievements) {
      const key = `${normalizeWorldId(achievement.world_id)}::${achievement.achievement_id}`;
      map.set(key, achievement);
    }

    return map;
  }, [completedAchievements]);

  const visibleAchievements = allAchievements.filter(
    (achievement) => normalizeWorldId(achievement.world_id) === selectedWorldId
  );

  return (
    <section className="panel">
      <div className="achievement-header-row">
        <h2>Achievements</h2>
        <label className="world-filter-label">
          World:
          <select value={selectedWorldId} onChange={(event) => setSelectedWorldId(event.target.value)}>
            {worlds.map((worldId) => (
              <option value={worldId} key={worldId}>
                {worldId}
              </option>
            ))}
          </select>
        </label>
      </div>

      {!visibleAchievements.length ? (
        <p>No achievements configured for this world.</p>
      ) : (
        <div className="achievement-list">
          {visibleAchievements.map((achievement) => {
            const completedKey = `${normalizeWorldId(achievement.world_id)}::${achievement.achievement_id}`;
            const isCompleted = completedByWorld.has(completedKey);
            const meta = [
              achievement.achievement_id ? `ID: ${achievement.achievement_id}` : null,
              achievement.type ? `Type: ${achievement.type}` : null,
              achievement.icon ? `Icon: ${achievement.icon}` : null,
              `World: ${normalizeWorldId(achievement.world_id)}`
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
      )}
    </section>
  );
}
