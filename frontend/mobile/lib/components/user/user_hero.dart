import 'package:flutter/material.dart';

class UserHero extends StatelessWidget {
  const UserHero({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Compte Utilisateur'),
      ),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.center,
          children: <Widget>[
            const Text(
              'Nom de l\'utilisateur',
              style: TextStyle(
                fontSize: 24.0,
                fontWeight: FontWeight.bold,
              ),
            ),
            const SizedBox(height: 16.0),
            const CircleAvatar(
              radius: 60,
              backgroundImage: AssetImage('assets/user_profile.png'),
            ),
            const SizedBox(height: 16.0),
            const ListTile(
              leading: Icon(Icons.email),
              title: Text('Adresse Email'),
              subtitle: Text('utilisateur@example.com'),
            ),
            const ListTile(
              leading: Icon(Icons.phone),
              title: Text('Numéro de Téléphone'),
              subtitle: Text('+1234567890'),
            ),
            ElevatedButton(
              onPressed: () {
                // Log-Out Feature
              },
              child: Text('Se Déconnecter'),
            ),
          ],
        ),
      ),
    );
  }
}
