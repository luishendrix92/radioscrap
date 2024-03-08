/*****************************************************************************
 * The objective of this (hopefully) one-time-use script is to add a new     *
 * field to the songs collection called 'ytVideo' containing an object with  *
 * the sufficient properties of its corresponding Youtube video (url, id,    *
 * thumbnail, title, channel, etc).                                          *
 *****************************************************************************/
const API_KEY = process.env.YT_API_KEY ?? "";
const MONGOURI = process.env.MONGOURI ?? "";

import { MongoClient, ObjectId } from "mongodb";

const makeYtURL = (/** @type {string} */ q, /** {string} */ key) =>
  `https://youtube.googleapis.com/youtube/v3/search?part=snippet&maxResults=1&q=${q}&type=video&key=${key}`;

const client = new MongoClient(MONGOURI);

/**
 * @typedef SongDoc
 * @prop {ObjectId} _id The id of the song document.
 * @prop {string} title The title of the song.
 * @prop {string} artist The artist of the song.
 * @prop {boolean} seen Has the song been listened to?
 * @prop {string} source Radio station where it was aired.
 *
 * @typedef PageInfo
 * @prop {number} totalResults
 * @prop {number} resultsPerPage
 *
 * @typedef ItemId
 * @prop {string} kind
 * @prop {string} videoId
 *
 * @typedef Thumbnail
 * @prop {string} url
 * @prop {number} width
 * @prop {number} height
 *
 * @typedef ThumbnailSet
 * @prop {Thumbnail} default
 * @prop {Thumbnail} medium
 * @prop {Thumbnail} high
 *
 * @typedef Snippet
 * @prop {string} publishedAt
 * @prop {string} channelId
 * @prop {string} title
 * @prop {string} description
 * @prop {ThumbnailSet} thumbnails
 * @prop {string} channelTitle
 * @prop {string} liveBroadcastContent
 * @prop {string} publishTime
 *
 * @typedef Item
 * @prop {string} kind
 * @prop {string} etag
 * @prop {ItemId} id
 * @prop {Snippet} snippet
 *
 * @typedef YTSearchListResponse
 * @prop {string} kind
 * @prop {string} etag
 * @prop {string} nextPageToken
 * @prop {string} regionCode
 * @prop {PageInfo} pageInfo
 * @prop {Item[]} items
 */

(async function() {
  await client.connect();
  const db = client.db("radioscrap");
  const songs = db.collection("songs");
  /** @type SongDoc[] */
  const allSongs = await songs.find({
    seen: false,
    ytVideo: {
      $exists: false
    }
  }).toArray();
  const len = allSongs.length;

  let i = 1;
  for (const song of allSongs) {
    const songStr = `${song.artist} - ${song.title}`;
    console.log(`[${i + 1}/${len}]> Fetching YT URL for ${songStr}`);
    const q = encodeURIComponent(songStr);
    /** @type {YTSearchListResponse>} */
    const r = await fetch(makeYtURL(q, API_KEY))
      .then(r => r.json());
    console.log(r);
    const video = r.items[0];

    await songs.updateOne({ _id: song._id }, {
      $set: {
        ytVideo: {
          id: video.id.videoId,
          channel: video.snippet.channelTitle,
          title: video.snippet.title,
          description: video.snippet.description,
          thumbnails: video.snippet.thumbnails
        }
      }
    });

    i += 1;
  };

  await client.close();
  console.log("Done and DB disconnected");
})();

