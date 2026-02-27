import UuidFinder from "./components/uuid-finder";

export default function HomePage() {
  return (
    <>
      <UuidFinder />
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
          A world selector is shown on each route and is populated from achievement records. Choose a
          <code>world_id</code> to view progress for only that world.
        </p>
        <p>Example achievement payload:</p>
        <pre className="code-block">{`[\n  {\n    "achievement_id": "minecraft:story/root",\n    "name": "Minecraft",\n    "description": "The heart and story of the game",\n    "background": "minecraft:gui/advancements/backgrounds/stone",\n    "type": "TASK",\n    "icon": "GRASS_BLOCK",\n    "world_id": "2d9d3b1c-51bc-4b4c-a1f2-8755c6f680f5"\n  }\n]`}</pre>
      </section>
    </>
  );
}
