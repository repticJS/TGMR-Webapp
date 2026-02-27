export default function HomePage() {
  return (
    <section className="panel">
      <h2>How to use</h2>
      <p>Open one of the following routes:</p>
      <ul>
        <li>
          <code>/team/{"{uuid}"}</code> to view a team's achievements.
        </li>
        <li>
          <code>/player/{"{uuid}"}</code> to view an individual player's achievements.
        </li>
      </ul>
      <p>
        A world selector is shown on each route. Choose a <code>world_id</code> to view completion
        progress for that world.
      </p>
      <p>Example achievement payload:</p>
      <pre className="code-block">{`[\n  {\n    "achievement_id": "minecraft:story/root",\n    "name": "Minecraft",\n    "description": "The heart and story of the game",\n    "background": "minecraft:gui/advancements/backgrounds/stone",\n    "type": "TASK",\n    "icon": "GRASS_BLOCK",\n    "world_id": "overworld"\n  }\n]`}</pre>
    </section>
  );
}
