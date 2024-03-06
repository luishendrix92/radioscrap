/**
 * @typedef Song
 * @prop {string} title The title of the song.
 * @prop {string} artist The artist of the song.
 * @prop {boolean} seen Has the song been listened to?
 * @prop {string} source Radio station where it was aired.
 *
 * @typedef Station
 * @prop {string} id Numeric station id as a string.
 * @prop {string} name Corresponding station name.
 */

import clean from "./clean.mjs";

/**
 * @param {string} stationId
 * @return {string} The formatted base URL for ListenLive
 */
let listenLiveUrl = (stationId) => `https://player.listenlive.co/${stationId}/en/songhistory`;

/**
 * Scrapes the song JSON array from the ListenLive source code corresponding
 * to a provided station identifier. Then parses it and returns it formatted.
 * @throws {Error} when the RegExp doesn't match the JSON variable in the HTML.
 *
 * @param {Station} station
 * @returns {Promise<Song[]>} The parsed song array
 */
export default async function getSongsJSON(
  /** @type {Station} */ station
) {
  const uri = listenLiveUrl(station.id);
  const html = await fetch(uri).then(r => r.text());
  let matched = html.match(/var songs = (?<json>\[.*\]);/);

  if (matched?.groups?.json === undefined) {
    throw new Error("Song parsing failure");
  }

  return JSON.parse(matched.groups.json)
    .map((/** @type {Song} */ song) => clean({
      title: song.title,
      artist: song.artist,
      source: station.name,
      seen: false,
    }));
}
