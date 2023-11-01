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

class MyApp extends StatefulWidget {
  final ThemeData _lightTheme = _buildLightTheme();
  final ThemeData _darkTheme = _buildDarkTheme();

  MyApp({super.key});

  @override
  State<MyApp> createState() => _MyAppState();
}

class _MyAppState extends State<MyApp> {
  String darkTheme = "auto";

  void toggleThemeMode(String theme) {
    setState(() {
      darkTheme = theme;
    });
  }

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'AREA',
      theme: widget._lightTheme,
      darkTheme: widget._darkTheme,
      themeMode: darkTheme == "auto"
          ? ThemeMode.system
          : (darkTheme == "dark" ? ThemeMode.dark : ThemeMode.light),
      home: LandingPage(updateTheme: toggleThemeMode),
      localizationsDelegates: AppLocalizations.localizationsDelegates,
      supportedLocales: AppLocalizations.supportedLocales,
      debugShowCheckedModeBanner: false,
    );
  }
}
