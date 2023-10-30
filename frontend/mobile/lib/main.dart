import 'package:area_mobile/colors.dart';
import 'package:area_mobile/pages/landing.dart';
import 'package:flutter/material.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:flutter_gen/gen_l10n/app_localizations.dart';

Future main() async {
  runApp(MyApp());
  await dotenv.load(fileName: ".env");
}

ThemeData _buildTheme() {
  final ThemeData base = ThemeData.light();
  return base.copyWith(
      colorScheme: base.colorScheme.copyWith(
    primary: primaryColor,
    secondary: secondaryColor,
    onPrimary: accentColor,
    onSecondary: accentColor,
  ));
}

class MyApp extends StatelessWidget {
  final ThemeData _theme = _buildTheme();
  MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'AREA',
      theme: _theme,
      home: const LandingPage(),
      localizationsDelegates: AppLocalizations.localizationsDelegates,
      supportedLocales: AppLocalizations.supportedLocales,
      debugShowCheckedModeBanner: false,
    );
  }
}
