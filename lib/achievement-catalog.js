export const ACHIEVEMENT_CATALOG = [
  {
    achievement_id: "minecraft:story/root",
    name: "Minecraft",
    description: "The heart and story of the game",
    background: "minecraft:gui/advancements/backgrounds/stone",
    type: "TASK",
    icon: "GRASS_BLOCK"
  },
  {
    achievement_id: "minecraft:story/mine_stone",
    name: "Stone Age",
    description: "Mine stone with your new pickaxe",
    type: "TASK",
    icon: "WOODEN_PICKAXE"
  },
  {
    achievement_id: "minecraft:story/smelt_iron",
    name: "Acquire Hardware",
    description: "Smelt an iron ingot",
    type: "TASK",
    icon: "IRON_INGOT"
  },
  {
    achievement_id: "minecraft:nether/root",
    name: "Nether",
    description: "Bring summer clothes",
    type: "TASK",
    icon: "NETHERRACK"
  },
  {
    achievement_id: "minecraft:adventure/root",
    name: "Adventure",
    description: "Adventure, exploration and combat",
    type: "TASK",
    icon: "MAP"
  }
];

export function buildAchievementCatalog(completedAchievements = []) {
  const index = new Map();

  for (const achievement of ACHIEVEMENT_CATALOG) {
    index.set(achievement.achievement_id, achievement);
  }

  for (const completed of completedAchievements) {
    if (!index.has(completed.achievement_id)) {
      index.set(completed.achievement_id, {
        achievement_id: completed.achievement_id,
        name: completed.name ?? completed.achievement_id,
        description: completed.description ?? "Unlocked achievement",
        type: completed.type ?? "TASK",
        icon: completed.icon ?? "BOOK"
      });
    }
  }

  return [...index.values()];
}
