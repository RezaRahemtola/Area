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
  final Function(String theme) updateTheme;

  const LandingPage({super.key, required this.updateTheme});

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
    _checkSettings();
  }

  void _checkSettings() async {
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
      widget.updateTheme(theme);
    }
  }

  void _updateSettings(String newLocale, String newTheme) async {
    storage.setLocale(newLocale);
    storage.setTheme(newTheme);

    setState(() {
      language = newLocale;
      theme = newTheme;
    });
    widget.updateTheme(newTheme);
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
            return LoginPage(
              onSuccess: _checkAuth,
              updateTheme: widget.updateTheme,
            );
          }
          return Scaffold(
            bottomNavigationBar: BottomNavigationBar(
              items: <BottomNavigationBarItem>[
                BottomNavigationBarItem(
                  icon: const Icon(Icons.workspaces_filled),
                  label: AppLocalizations.of(context)!.navbarLibrary,
                  backgroundColor: Theme.of(context).colorScheme.primary,
                ),
                BottomNavigationBarItem(
                  icon: const Icon(Icons.explore),
                  label: AppLocalizations.of(context)!.servicesTitle,
                  backgroundColor: Theme.of(context).colorScheme.primary,
                ),
                BottomNavigationBarItem(
                  icon: const Icon(Icons.create),
                  label: AppLocalizations.of(context)!.editorTitle,
                  backgroundColor: Theme.of(context).colorScheme.primary,
                ),
                BottomNavigationBarItem(
                  icon: const Icon(Icons.local_activity),
                  label: AppLocalizations.of(context)!.activityTitle,
                  backgroundColor: Theme.of(context).colorScheme.primary,
                ),
                BottomNavigationBarItem(
                  icon: const Icon(Icons.account_circle),
                  label: AppLocalizations.of(context)!.userTitle,
                  backgroundColor: Theme.of(context).colorScheme.primary,
                ),
              ],
              currentIndex: _selectedIndex,
              selectedItemColor: Theme.of(context).colorScheme.secondary,
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
