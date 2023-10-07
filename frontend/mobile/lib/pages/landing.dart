import 'package:area_mobile/pages/auth/login.dart';
import 'package:area_mobile/components/activity/activity_hero.dart';
import 'package:area_mobile/components/create/create_hero.dart';
import 'package:area_mobile/components/explore/explore_hero.dart';
import 'package:area_mobile/components/user/user_hero.dart';
import 'package:area_mobile/components/library/library_hero.dart';
import 'package:area_mobile/storage/index.dart';
import 'package:flutter/material.dart';

class LandingPage extends StatefulWidget {
  const LandingPage({super.key});

  @override
  State<LandingPage> createState() => _LandingPageState();
}

class _LandingPageState extends State<LandingPage> {
  bool isLoggedIn = false;
  int _selectedIndex = 2;

  @override
  void initState() {
    super.initState();
    _checkAuth();
  }

  void _checkAuth() async {
    final token = await storage.getAccessToken();
    setState(() {
      isLoggedIn = token != null;
    });
  }

  void _onItemTapped(int index) {
    setState(() {
      _selectedIndex = index;
    });
  }

  @override
  Widget build(BuildContext context) {
    if (!isLoggedIn) {
      return LoginPage(onSuccess: _checkAuth);
    }
    return Scaffold(
      bottomNavigationBar: BottomNavigationBar(
        items: const <BottomNavigationBarItem>[
          BottomNavigationBarItem(
            icon: Icon(Icons.workspaces_filled),
            label: 'Library',
            backgroundColor: Colors.red,
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.explore),
            label: 'Explore',
            backgroundColor: Colors.green,
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.create),
            label: 'CREATE',
            backgroundColor: Colors.blue,
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.local_activity),
            label: 'Activity',
            backgroundColor: Colors.purple,
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.people),
            label: 'User',
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
            child: LibraryHero(),
          ),
          Center(
            child: ExploreHero(),
          ),
          Center(
            child: CreateHero(),
          ),
          Center(
            child: ActivityHero(),
          ),
          Center(
            child: UserHero(),
          ),
        ],
      ),
    );
  }
}
