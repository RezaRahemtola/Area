import 'package:area_mobile/colors.dart';
import 'package:area_mobile/pages/landing.dart';
import 'package:flutter/material.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:flutter_gen/gen_l10n/app_localizations.dart';

Future main() async {
  runApp(MyApp());
  await dotenv.load(fileName: ".env");
}

ThemeData _buildLightTheme() {
  final ThemeData base = ThemeData.light();
  return base.copyWith(
      colorScheme: base.colorScheme.copyWith(
    primary: primaryColor,
    secondary: secondaryColor,
    onPrimary: accentColor,
    onSecondary: accentColor,
  ));
}

ThemeData _buildDarkTheme() {
  final ThemeData base = ThemeData.dark();
  return base.copyWith(
    colorScheme: base.colorScheme.copyWith(
      primary: Colors.teal, // Personnalisez les couleurs selon vos besoins
      secondary: Colors.orange,
      onPrimary: Colors.white,
      onSecondary: Colors.black,
    ),
  );
}

bool isDarkMode = false;

void toogleThemeMode() {
  isDarkMode = !isDarkMode;
}

class MyApp extends StatefulWidget {
  final ThemeData _lightTheme = _buildLightTheme();
  final ThemeData _darkTheme = _buildDarkTheme();

  MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'AREA',
      theme: _lightTheme,
      darkTheme: _darkTheme,
      themeMode: isDarkMode ? ThemeMode.dark : ThemeMode.light,
      home: const LandingPage(),
      localizationsDelegates: AppLocalizations.localizationsDelegates,
      supportedLocales: AppLocalizations.supportedLocales,
      debugShowCheckedModeBanner: false,
    );
  }

  @override
  State<StatefulWidget> createState() {
    throw UnimplementedError();
  }
}
