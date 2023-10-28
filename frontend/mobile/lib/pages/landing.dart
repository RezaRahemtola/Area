import 'package:area_mobile/components/activity/activity_hero.dart';
import 'package:area_mobile/components/create/create_hero.dart';
import 'package:area_mobile/components/explore/explore_hero.dart';
import 'package:area_mobile/components/library/library_hero.dart';
import 'package:area_mobile/components/user/user_hero.dart';
import 'package:area_mobile/pages/auth/login.dart';
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

  void _onDisconnect() {
    storage.removeAccessToken();
    setState(() {
      isLoggedIn = false;
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
            backgroundColor: Color(0xFF516079),
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.explore),
            label: 'Explore',
            backgroundColor: Color(0xFF516079),
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.create),
            label: 'CREATE',
            backgroundColor: Color(0xFF516079),
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.local_activity),
            label: 'Activity',
            backgroundColor: Color(0xFF516079),
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.people),
            label: 'User',
            backgroundColor: Color(0xFF516079),
          ),
        ],
        currentIndex: _selectedIndex,
        selectedItemColor: Colors.amber[800],
        onTap: _onItemTapped,
      ),
      body: IndexedStack(
        index: _selectedIndex,
        children: <Widget>[
          const Center(
            child: LibraryHero(),
          ),
          const Center(
            child: ExploreHero(),
          ),
          const Center(
            child: CreateHero(),
          ),
          const Center(
            child: ActivityHero(),
          ),
          Center(
            child: UserHero(
              onDisconnect: _onDisconnect,
            ),
          ),
        ],
      ),
    );
  }
}
