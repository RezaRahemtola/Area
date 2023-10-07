import 'package:area_mobile/pages/landing.dart';
import 'package:flutter/material.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';

Future main() async {
  runApp(const MyApp());
  await dotenv.load(fileName: ".env");
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
        title: 'AREA',
        theme: ThemeData(
          primarySwatch: Colors.blue,
        ),
        home: const LandingPage());
  }
}
