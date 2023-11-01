import 'package:area_mobile/colors.dart';
import 'package:area_mobile/pages/activity.dart';
import 'package:area_mobile/pages/auth/login.dart';
import 'package:area_mobile/pages/editor.dart';
import 'package:area_mobile/pages/library.dart';
import 'package:area_mobile/pages/services.dart';
import 'package:area_mobile/pages/user.dart';
import 'package:area_mobile/storage/index.dart';
import 'package:area_mobile/utils/workflows.dart';
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
  String language = "en";
  String theme = "light";

  @override
  void initState() {
    super.initState();
    _checkAuth();
    _checkLocale();
  }

  void _checkLocale() async {
    final storageLanguage = await storage.getLocale();
    final storageTheme = await storage.getTheme();

    if (storageLanguage == null) {
      storage.setLocale(language);
    } else {
      setState(() {
        language = storageLanguage;
      });
    }

    if (storageTheme == null) {
      storage.setTheme(theme);
    } else {
      setState(() {
        theme = storageTheme;
      });
    }
  }

  void _updateSettings(String newLocale, String newTheme) async {
    storage.setLocale(newLocale);
    storage.setTheme(newTheme);

    setState(() {
      language = newLocale;
      theme = newTheme;
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
      locale: Locale(language),
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
                  backgroundColor: primaryColor,
                ),
                BottomNavigationBarItem(
                  icon: const Icon(Icons.explore),
                  label: AppLocalizations.of(context)!.servicesTitle,
                  backgroundColor: primaryColor,
                ),
                BottomNavigationBarItem(
                  icon: const Icon(Icons.create),
                  label: AppLocalizations.of(context)!.editorTitle,
                  backgroundColor: primaryColor,
                ),
                BottomNavigationBarItem(
                  icon: const Icon(Icons.local_activity),
                  label: AppLocalizations.of(context)!.activityTitle,
                  backgroundColor: primaryColor,
                ),
                BottomNavigationBarItem(
                  icon: const Icon(Icons.account_circle),
                  label: AppLocalizations.of(context)!.userTitle,
                  backgroundColor: primaryColor,
                ),
              ],
              currentIndex: _selectedIndex,
              selectedItemColor: secondaryColor,
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
                  child: Editor(workflow: getEmptyWorkflow()),
                ),
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
