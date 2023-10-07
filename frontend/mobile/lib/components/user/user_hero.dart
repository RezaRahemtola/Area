import 'package:flutter/material.dart';

class UserHero extends StatelessWidget {
  const UserHero({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Compte Utilisateur'),
      ),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.center,
          children: <Widget>[
            // Nom de l'utilisateur
            Text(
              'Nom de l\'utilisateur',
              style: TextStyle(
                fontSize: 24.0,
                fontWeight: FontWeight.bold,
              ),
            ),
            SizedBox(height: 16.0),

            // Image de profil de l'utilisateur
            CircleAvatar(
              radius: 60,
              backgroundImage: AssetImage(
                  'assets/user_profile.png'), // Remplacez par le chemin de votre image de profil
            ),
            SizedBox(height: 16.0),

            // Informations sur l'utilisateur
            ListTile(
              leading: Icon(Icons.email),
              title: Text('Adresse Email'),
              subtitle: Text(
                  'utilisateur@example.com'), // Remplacez par l'adresse email de l'utilisateur
            ),
            ListTile(
              leading: Icon(Icons.phone),
              title: Text('Numéro de Téléphone'),
              subtitle: Text(
                  '+1234567890'), // Remplacez par le numéro de téléphone de l'utilisateur
            ),

            // Bouton de déconnexion
            ElevatedButton(
              onPressed: () {
                // Mettez ici la logique pour vous déconnecter de l'utilisateur
              },
              child: Text('Se Déconnecter'),
            ),
          ],
        ),
      ),
    );
  }
}
