import 'package:url_launcher/url_launcher.dart';
import 'package:flutter/material.dart';

import 'package:rscrap/utils.dart';
import 'package:rscrap/song.dart';
import 'package:rscrap/db.dart';

class MyHomePage extends StatefulWidget {
  const MyHomePage({super.key});

  final String title = 'Song List - Pending';

  @override
  State<MyHomePage> createState() => _MyHomePageState();
}

class _MyHomePageState extends State<MyHomePage> {
  Set<String> disabledIds = <String>{};
  List<Song> songs = [];
  bool isLoading = true;

  Future<void> loadSongs() async {
    setState(() {
      isLoading = true;
    });

    var response = await MongoDatabase.getSongs({'seen': false});

    setState(() {
      songs = response;
      isLoading = false;
    });
  }

  @override
  void initState() {
    super.initState();
    loadSongs();
  }

  void launchVideo(String artist, String title) {
    String query = '$artist $title'
        .replaceAll(RegExp(r'\s+'), '+')
        .replaceAll(RegExp(r'&'), 'and');
    Uri ytURL =
        Uri.parse('https://www.youtube.com/results?search_query=$query');

    launchUrl(ytURL);
  }

  Future<void> markAsSeen(dynamic songId) async {
    String strId = songId.toString();

    setState(() {
      disabledIds.add(strId);
      isLoading = true;
    });

    await MongoDatabase.updateFieldById(songId, 'seen', true);

    setState(() {
      disabledIds.remove(strId);
      isLoading = false;
      songs.removeWhere((song) => song.id.toString() == strId);
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Badge(
          label: Text(
            style: const TextStyle(
              fontWeight: FontWeight.bold,
            ),
            songs.length.toString(),
          ),
          offset: const Offset(20, 0),
          child: Text(widget.title),
        ),
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: loadSongs,
        tooltip: "Refresh List",
        child: const Icon(Icons.refresh),
      ),
      body: Stack(
        children: [
          Visibility(
            visible: isLoading,
            child: const LinearProgressIndicator(),
          ),
          ListView.builder(
            padding: const EdgeInsets.fromLTRB(5.0, 8.0, 5.0, 15.0),
            itemBuilder: (context, index) {
              Song song = songs[index];

              return Card(
                color: Colors.white10,
                child: ListTile(
                  onTap: () {
                    launchVideo(song.artist, song.title);
                  },
                  leading: Image.asset(
                    logo(song.source),
                    width: 40.0,
                  ),
                  title: Text(titleCase(song.title)),
                  subtitle: Text(titleCase(song.artist)),
                  trailing: IconButton(
                    onPressed: disabledIds.contains(song.id.toString())
                        ? null
                        : () => markAsSeen(song.id),
                    icon: const Icon(
                      Icons.playlist_add_check_outlined,
                    ),
                    tooltip: "Mark as reviewed",
                  ),
                ),
              );
            },
            itemCount: songs.length,
          ),
        ],
      ),
    );
  }
}
