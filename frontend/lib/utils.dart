/// Capitalizes every word in [input] without affecting apostrophes.
/// It uses the following word separators: [\s+], [\[], [-], [(], and [/].
String titleCase(String input) {
  return input.splitMapJoin(RegExp(r'(\s+|\[|\(|\/|\-)+'),
      onMatch: (m) => '${m[0]}',
      onNonMatch: (word) {
        if (word.length < 2) return word.toUpperCase();

        return word.substring(0, 1).toUpperCase() + word.substring(1);
      });
}

/// Given a radio [stationName}, this function returns its corresponding
/// image asset name which points to a PNG logo extracted from ListenLive.
String logo(String stationName) {
  // TODO: Create a default png logo inside /assets
  const String defaultLogo = 'defaultlogo.png';
  const String baseDir = 'assets';
  const Map<String, String> logoFileNames = {
    'Magic 92.5': 'magic925logo.png',
    '91x': '91xlogo.png',
    'Z90.3': 'z90logo.png'
  };

  return '$baseDir/${logoFileNames[stationName] ?? defaultLogo}';
}