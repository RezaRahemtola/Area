import 'package:area_mobile/pages/activity.dart';
import 'package:area_mobile/pages/auth/login.dart';
import 'package:area_mobile/pages/editor.dart';
import 'package:area_mobile/pages/library.dart';
import 'package:area_mobile/pages/services.dart';
import 'package:area_mobile/pages/user.dart';
import 'package:area_mobile/storage/index.dart';
import 'package:area_mobile/types/services.dart';
import 'package:flutter/material.dart';
import 'package:flutter_gen/gen_l10n/app_localizations.dart';

class LandingPage extends StatefulWidget {
  const LandingPage({super.key});

  @override
  State<LandingPage> createState() => _LandingPageState();
}

class _LandingPageState extends State<LandingPage> {
  bool isLoggedIn = false;
  int _selectedIndex = 2;
  String locale = "en";

  @override
  void initState() {
    super.initState();
    _checkAuth();
    _checkLocale();
  }

  void _checkLocale() async {
    final storageLocale = await storage.getLocale();
    if (storageLocale == null) {
      storage.setLocale(locale);
    } else {
      setState(() {
        locale = storageLocale;
      });
    }
  }

  void _updateSettings(String newLocale) async {
    // TODO: Add theme too
    storage.setLocale(newLocale);
    setState(() {
      locale = newLocale;
    });
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
    return Localizations.override(
      context: context,
      locale: Locale(locale),
      child: Builder(
        builder: (context) {
          if (!isLoggedIn) {
            return LoginPage(onSuccess: _checkAuth);
          }
          return Scaffold(
            bottomNavigationBar: BottomNavigationBar(
              items: <BottomNavigationBarItem>[
                BottomNavigationBarItem(
                  icon: const Icon(Icons.workspaces_filled),
                  label: AppLocalizations.of(context)!.navbarLibrary,
                  backgroundColor: const Color(0xFF516079),
                ),
                BottomNavigationBarItem(
                  icon: const Icon(Icons.explore),
                  label: AppLocalizations.of(context)!.servicesTitle,
                  backgroundColor: const Color(0xFF516079),
                ),
                BottomNavigationBarItem(
                  icon: const Icon(Icons.create),
                  label: AppLocalizations.of(context)!.editorTitle,
                  backgroundColor: const Color(0xFF516079),
                ),
                BottomNavigationBarItem(
                  icon: const Icon(Icons.local_activity),
                  label: AppLocalizations.of(context)!.activityTitle,
                  backgroundColor: const Color(0xFF516079),
                ),
                BottomNavigationBarItem(
                  icon: const Icon(Icons.account_circle),
                  label: AppLocalizations.of(context)!.userTitle,
                  backgroundColor: const Color(0xFF516079),
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
                  child: Library(),
                ),
                const Center(
                  child: Services(),
                ),
                Center(
                    child: Editor(
                  workflow: Workflow(
                      id: "",
                      name: "New Workflow",
                      active: true,
                      action: const AreaInWorkflow(
                          id: "id",
                          areaId: "areaId",
                          areaServiceId: "areaServiceId"),
                      reactions: [
                        const AreaInWorkflow(
                            id: "id",
                            areaId: "areaId",
                            areaServiceId: "areaServiceId")
                      ]),
                )),
                const Center(
                  child: Activity(),
                ),
                Center(
                  child: User(
                    onDisconnect: _onDisconnect,
                    updateSettings: _updateSettings,
                  ),
                ),
              ],
            ),
          );
        },
      ),
    );
  }
}
