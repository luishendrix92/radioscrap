import { MongoClient } from "mongodb";

import getSongsJSON from "./scraper.mjs";
import saveSongs from "./saveSongs.mjs";

const stations = [
  { id: "36281", name: "91x" },
  { id: "36271", name: "Z90.3" },
  { id: "36261", name: "Magic 92.5" }
];

export const handler = async (_event, _context) => {
  const client = new MongoClient(process.env.MONGOURI ?? "");

  client.connect();

  const songList = await Promise.all(stations.map(getSongsJSON));
  const body = await saveSongs(client, songList.flat());

  client.close();

  return {
    statusCode: body instanceof Error ? 500 : 200,
    body
  };
}
