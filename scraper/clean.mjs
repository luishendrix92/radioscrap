/**
 * @typedef Song
 * @prop {string} title The title of the song.
 * @prop {string} artist The artist of the song.
 * @prop {boolean} seen Has the song been listened to?
 * @prop {string} source Radio station where it was aired.
 */

/**
 * Strips away any unnecessary information from the title and artist.
 * Might perform other cleanup steps such as trimming whitespace,
 * reformatting the casing, and normalizing artist names.
 *
 * @param {Song} song The song to clean.
 * @returns {Song} The cleaned song.
 */
export default function clean(song) {
  const introPat = /(\(|\[)(in|ou|n)tro[a-z ]*(\)|\])$/;
  const radioPat = /(\(|\[)radio[a-z ]*(\)|\])$/;
  const versionPat = /(\(|\[)[a-z ]*version(\)|\])$/;
  const cleanTitle = song.title
    .toLowerCase()
    .replace(introPat, "")
    .replace(radioPat, "")
    .replace(versionPat, "")
    .replace("(custom)", "")
    .replace("(z90 custom)", "")
    .replace("(edit)", "")
    .replace("(clean edit)", "")
    .replace("(single)", "")
    .replace("(studio)", "")
    .replace("(91x)", "")
    .replace("(mono)", "")
    .replace("(album)", "")
    .replace("(remix)", "")
    .trim();
  const cleanArtist = song.artist.toLowerCase().trim();

  return {
    ...song,
    title: cleanTitle,
    artist: cleanArtist
  };
}
