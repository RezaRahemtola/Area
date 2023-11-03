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
    primary: const Color(0xFF718099),
    secondary: const Color(0xFFF1895C),
    onPrimary: const Color(0xFFFFFFFF),
    onSecondary: const Color(0xFFC5C6C6),
  ));
}

ThemeData _buildDarkTheme() {
  final ThemeData base = ThemeData.dark();
  return base.copyWith(
    colorScheme: base.colorScheme.copyWith(
        primary: const Color(0xFF516079),
        secondary: const Color(0xFFF1895C),
        onPrimary: const Color(0xFFC5C6C6),
        onSecondary: const Color(0xFF2E3244)),
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
