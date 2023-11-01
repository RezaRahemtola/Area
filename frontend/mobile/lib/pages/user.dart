import 'package:area_mobile/services/dio.dart';
import 'package:area_mobile/types/services.dart';
import 'package:area_mobile/types/user/me.dart';
import 'package:area_mobile/types/user/settings.dart';
import 'package:flutter/material.dart';
import 'package:flutter_gen/gen_l10n/app_localizations.dart';

class User extends StatefulWidget {
  final Function onDisconnect;
  final Function(String newLocale, String newTheme) updateSettings;

  const User(
      {super.key, required this.onDisconnect, required this.updateSettings});

  @override
  State<User> createState() => _UserHero();
}

class _UserHero extends State<User> {
  String newLocale = "";
  String newTheme = "";
  String newEmail = "";

  Future<ServiceReturn<UserMe>>? future;

  @override
  void initState() {
    future = services.user.getMe();
    super.initState();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
          backgroundColor: Theme.of(context).colorScheme.primary,
          actions: [
            IconButton(
              onPressed: () {
                widget.onDisconnect();
              },
              icon: const Icon(Icons.logout),
            ),
          ],
          title: Text(AppLocalizations.of(context)!.userTitle),
          automaticallyImplyLeading: false),
      body: Container(
        color: Theme.of(context).colorScheme.onSecondary,
        child: Padding(
          padding: const EdgeInsets.all(16.0),
          child: FutureBuilder<ServiceReturn<UserMe>>(
            future: future,
            builder: (context, snapshot) {
              if (snapshot.connectionState == ConnectionState.waiting) {
                return const CircularProgressIndicator();
              } else {
                final UserMe? user = snapshot.data?.data;
                if (user != null) {
                  newLocale = user.settings.language;
                  newTheme = user.settings.theme;
                  newEmail = user.email;
                }

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
                  const UserTile(),
                  Form(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.stretch,
                      children: <Widget>[
                        TextFormField(
                          decoration: InputDecoration(
                              labelText: AppLocalizations.of(context)!.email),
                          initialValue: user.email,
                          onChanged: ((value) => newEmail = value),
                        ),
                        const SizedBox(height: 16.0),
                        DropdownButtonFormField(
                          value: newLocale,
                          items: <InterfaceLanguage>[
                            InterfaceLanguage(id: "en", text: "🇺🇸 English"),
                            InterfaceLanguage(id: "fr", text: "🇫🇷 Francais"),
                            InterfaceLanguage(id: "is", text: "🇮🇸 Íslenskur"),
                          ].map((InterfaceLanguage locale) {
                            return DropdownMenuItem<String>(
                              value: locale.id,
                              child: Text(locale.text),
                            );
                          }).toList(),
                          onChanged: (value) {
                            if (value == null) return;
                            newLocale = value;
                          },
                          decoration: InputDecoration(
                              labelText:
                                  AppLocalizations.of(context)!.language),
                        ),
                        DropdownButtonFormField(
                          value: newTheme,
                          items: [
                            'auto',
                            'dark',
                            'light',
                          ].map((String theme) {
                            return DropdownMenuItem<String>(
                              value: theme,
                              child: Text(theme),
                            );
                          }).toList(),
                          onChanged: (value) {
                            if (value == null) return;
                            newTheme = value;
                          },
                          decoration: InputDecoration(
                              labelText: AppLocalizations.of(context)!.theme),
                        ),
                        const SizedBox(height: 16.0),
                        ElevatedButton(
                          onPressed: () {
                            widget.updateSettings(newLocale, newTheme);
                            services.user
                                .updateProfile(newEmail, newLocale, newTheme);
                          },
                          child: Text(AppLocalizations.of(context)!.save),
                        ),
                      ],
                    ),
                  )
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
  const UserTile({super.key});

  @override
  Widget build(BuildContext context) {
    return Card(
        elevation: 8,
        margin: const EdgeInsets.only(bottom: 50),
        child: Image.asset(
          'assets/default-profile-picture.webp',
          width: 150,
          height: 150,
        ));
  }
}
