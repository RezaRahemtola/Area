import 'package:area_mobile/components/app/app_hero.dart';
import 'package:area_mobile/components/create/create_hero.dart';
import 'package:area_mobile/components/dashboard/dashboard_hero.dart';
import 'package:area_mobile/components/home/home_hero.dart';
import 'package:area_mobile/components/library/library_hero.dart';
import 'package:flutter/material.dart';

class LandingPage extends StatefulWidget {
  const LandingPage({super.key});

  @override
  State<LandingPage> createState() => _LandingPageState();
}

class _LandingPageState extends State<LandingPage> {
  int _selectedIndex = 2;

  void _onItemTapped(int index) {
    setState(() {
      _selectedIndex = index;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      bottomNavigationBar: BottomNavigationBar(
        items: const <BottomNavigationBarItem>[
          BottomNavigationBarItem(
            icon: Icon(Icons.home),
            label: 'Home',
            backgroundColor: Colors.red,
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.dashboard),
            label: 'Dashboard',
            backgroundColor: Colors.green,
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.create),
            label: 'CREATE',
            backgroundColor: Colors.blue,
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.library_books),
            label: 'Library',
            backgroundColor: Colors.purple,
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.apps),
            label: 'Apps',
            backgroundColor: Colors.pink,
          ),
        ],
        currentIndex: _selectedIndex,
        selectedItemColor: Colors.amber[800],
        onTap: _onItemTapped,
      ),
      body: IndexedStack(
        index: _selectedIndex,
        children: const <Widget>[
          Center(
            child: homeHero(),
          ),
          Center(
            child: dashboardHero(),
          ),
          Center(
            child: createHero(),
          ),
          Center(
            child: libraryHero(),
          ),
          Center(
            child: appHero(),
          ),
        ],
      ),
    );
  }
}
