import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:mongo_dart/mongo_dart.dart';
import 'package:rscrap/song.dart';

class MongoDatabase {
  static late Db db;
  static late DbCollection songs;

  static Future<void> connect() async {
    String connStr = dotenv.get("MONGOURI", fallback: "");
    db = await Db.create(connStr);

    await db.open();

    songs = db.collection('songs');
  }

  static Future<List<Song>> getSongs(Map<String, dynamic> query) async {
    final docs = await songs.find(query).toList();

    return docs.map((e) => Song.fromMap(e)).toList();
  }

  static Future<void> updateFieldById(
      ObjectId id, String field, dynamic value) async {
    await songs.updateOne(where.eq('_id', id), modify.set(field, value));
  }
}
