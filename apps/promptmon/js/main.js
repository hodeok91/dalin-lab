import { categories } from "./data/categories.js?v=learning1";
import { quests } from "./data/promptmons.js?v=learning1";
import { villages, encounterZones } from "./data/villages.js?v=learning1";
import { maps } from "./data/maps.v2.js?v=learning1";

window.PROMPTMON_DATA = { categories, quests, villages, encounterZones, maps };

await import("./core/engine.js?v=learning1");



