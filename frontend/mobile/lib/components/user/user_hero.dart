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
                  UserTile(
                    id: user.id,
                    userEmail: user.email,
                    isAdmin: user.isAdmin,
                  ),
                  ElevatedButton(
                    onPressed: () {
                      storage.removeAccessToken();
                    },
                    child: const Text('Se Déconnecter'),
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
        Image.asset('assets/user_profile.jpg'),
        ListTile(
          title: Text(userEmail),
          subtitle: Text(id),
        ),
        isAdmin
            ? Image.network(
                'https://png.pngtree.com/png-vector/20220810/ourmid/pngtree-sheriff-star-badge-png-image_6105998.png')
            : Container(),
      ]),
    );
  }
}
