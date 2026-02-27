export function AchievementList({ achievements }) {
  if (!achievements.length) {
    return (
      <section className="panel">
        <h2>Achievements</h2>
        <p>No achievements have been recorded yet.</p>
      </section>
    );
  }

  return (
    <section className="panel">
      <h2>Achievements</h2>
      <div className="achievement-list">
        {achievements.map((achievement) => {
          const key = achievement.achievement_id ?? `${achievement.name}-${achievement.icon}`;
          const meta = [
            achievement.achievement_id ? `ID: ${achievement.achievement_id}` : null,
            achievement.type ? `Type: ${achievement.type}` : null,
            achievement.icon ? `Icon: ${achievement.icon}` : null
          ]
            .filter(Boolean)
            .join(" • ");

          return (
            <article key={key} className="achievement-card">
              <div className="achievement-icon" aria-hidden="true" />
              <div>
                <h3 className="achievement-title">{achievement.name ?? achievement.achievement_id}</h3>
                <p className="achievement-description">
                  {achievement.description ?? "No description provided."}
                </p>
                {meta ? <div className="achievement-meta">{meta}</div> : null}
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

export function ErrorPanel({ message }) {
  return (
    <section className="panel error">
      <h2>Unable to load data</h2>
      <p>{message}</p>
      <p>Check your UUID and API availability, then try again.</p>
    </section>
  );
}
