class VideoThumbnail {
  final String url;
  final int width;
  final int height;

  const VideoThumbnail(
      {required this.url, required this.width, required this.height});

  VideoThumbnail.fromMap(Map<String, dynamic> map)
      : url = map['url'],
        width = map['width'],
        height = map['height'];
}

class YTVideo {
  final String id;
  final String channel;
  final String title;
  final String description;
  final VideoThumbnail? thumbnail;

  String getURL() {
    return "https://www.youtube.com/watch?v=$id";
  }

  const YTVideo(
      {required this.id,
      required this.channel,
      required this.title,
      required this.description,
      required this.thumbnail});

  YTVideo.fromMap(Map<String, dynamic> map)
      : id = map['id'],
        channel = map['channel'],
        title = map['title'],
        description = map['description'],
        thumbnail = map['thumbnails'] != null
            ? VideoThumbnail.fromMap(map['thumbnails']['default'])
            : null;
}
