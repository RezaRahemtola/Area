import 'package:area_mobile/components/user/settings.dart';
import 'package:area_mobile/services/user/me.dart';
import 'package:area_mobile/types/services.dart';
import 'package:area_mobile/types/user/me.dart';
import 'package:flutter/material.dart';
import 'package:flutter_gen/gen_l10n/app_localizations.dart';

class User extends StatefulWidget {
  final Function onDisconnect;
  final Function(String newLocale) updateSettings;

  const User(
      {super.key, required this.onDisconnect, required this.updateSettings});

  @override
  State<User> createState() => _UserHero();
}

class _UserHero extends State<User> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
          actions: [
            IconButton(
              onPressed: () {
                Navigator.push(
                  context,
                  MaterialPageRoute(builder: (context) => const SettingsPage()),
                );
              },
              icon: const Icon(Icons.settings),
            ),
          ],
          title: Text(AppLocalizations.of(context)!.userTitle),
          automaticallyImplyLeading: false),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: FutureBuilder<ServiceReturn<UserMe>>(
          future: getMe(),
          builder: (context, snapshot) {
            if (snapshot.connectionState == ConnectionState.waiting) {
              return const CircularProgressIndicator();
            } else {
              final UserMe? user = snapshot.data?.data;

              if (user == null) {
                return Column(
                  children: [
                    ElevatedButton(
                      onPressed: () {
                        widget.onDisconnect();
                      },
                      child: Text(AppLocalizations.of(context)!.logout),
                    ),
                  ],
                );
              }

              return Column(
                children: [
                  UserTile(
                    id: user.id,
                    userEmail: user.email,
                    isAdmin: user.isAdmin,
                  ),
                  ElevatedButton(
                    onPressed: () {
                      widget.updateSettings("fr");
                    },
                    child: const Text('Change locale to FR'),
                  ),
                  ElevatedButton(
                    onPressed: () {
                      widget.updateSettings("en");
                    },
                    child: const Text('Change locale to EN'),
                  ),
                  ElevatedButton(
                    onPressed: () {
                      widget.updateSettings("is");
                    },
                    child: const Text('Change locale to IS'),
                  ),
                  ElevatedButton(
                    onPressed: () {
                      widget.onDisconnect();
                    },
                    child: Text(AppLocalizations.of(context)!.logout),
                  ),
                ],
              );
            }
          },
        ),
      ),
    );
  }
}

class UserTile extends StatelessWidget {
  final String id;
  final String userEmail;
  final bool isAdmin;

  const UserTile(
      {required this.id,
      required this.userEmail,
      required this.isAdmin,
      Key? key})
      : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Card(
      elevation: 8,
      child: Column(children: [
        Image.asset('assets/default-profile-picture.webp'),
        ListTile(
          title: Text(userEmail),
          subtitle: Text(id),
        ),
      ]),
    );
  }
}
