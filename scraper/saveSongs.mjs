/**
 * @typedef Song
 * @prop {string} title The title of the song.
 * @prop {string} artist The artist of the song.
 * @prop {boolean} seen Has the song been listened to?
 * @prop {string} source Radio station where it was aired.
 */

/**
 * Stores a list of scraped songs to the designated MongoDB collection so
 * that they can be consumed by the frontend mobile app.
 *
 * If the collection already has a song with the same artist name and title,
 * then the song is ignored (upserted); this prevents duplicates.
 *
 * @param {MongoClient} client
 * @param {Array<Song>} songList
 * @return {Promise<BulkWriteResult | Error>} The insertion result or db error.
 */
export default async function saveSongs(client, songList) {
  try {
    const db = client.db("radioscrap");
    const songs = db.collection("songs");

    const operations = songList.map((song) => ({
      updateOne: {
        filter: { title: song.title, artist: song.artist },
        update: { $setOnInsert: song },
        upsert: true
      }
    }));

    const result = await songs.bulkWrite(operations);

    console.log(result);

    return result;
  } catch (e) {
    console.error(e);

    return e;
  }
}
