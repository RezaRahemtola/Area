import 'package:area_mobile/components/user/settings.dart';
import 'package:area_mobile/services/user/me.dart'; // Assuming this file contains the getMe function
import 'package:area_mobile/storage/index.dart';
import 'package:area_mobile/types/services.dart';
import 'package:area_mobile/types/user/me.dart';
import 'package:flutter/material.dart';

class UserHero extends StatelessWidget {
  const UserHero({Key? key}) : super(key: key);

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
        title: const Text('Compte Utilisateur'),
      ),
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
                    const Text("No data available"),
                    ElevatedButton(
                      onPressed: () {
                        storage.removeAccessToken();
                      },
                      child: const Text('Se Déconnecter'),
                    ),
                  ],
                );
              }

              return Column(
                children: [
                  Card(
                    elevation: 8,
                    child: UserTile(
                      id: user.id,
                      userEmail: user.email,
                    ),
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

  const UserTile({required this.id, required this.userEmail, Key? key})
      : super(key: key);

  @override
  Widget build(BuildContext context) {
    return ListTile(
      leading: const Icon(Icons.account_circle),
      title: Text("#$id"),
      subtitle: Text(userEmail),
    );
  }
}
