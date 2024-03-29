import 'package:mongo_dart/mongo_dart.dart';
import 'package:rscrap/ytvideo.dart';

class Song {
  final ObjectId id;
  final String artist;
  final String title;
  final String source;
  final YTVideo? video;
  final bool seen;

  const Song(
      {required this.id,
      required this.artist,
      required this.title,
      required this.source,
      required this.video,
      required this.seen});

  Song.fromMap(Map<String, dynamic> map)
      : id = map['_id'],
        artist = map['artist'],
        title = map['title'],
        source = map['source'],
        video = map['ytVideo'] != null
            ? YTVideo.fromMap(map['ytVideo'])
            : null,
        seen = map['seen'];
}
