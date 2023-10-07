import 'package:flutter/material.dart';

class ExploreHero extends StatelessWidget {
  const ExploreHero({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Explore Services'),
      ),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: ListView(
          children: const <Widget>[
            ServiceTile(
              serviceName: 'Spotify',
              serviceIcon: Icons.music_note,
            ),
            Divider(),
            ServiceTile(
              serviceName: 'Discord',
              serviceIcon: Icons.message,
            ),
            Divider(),
            ServiceTile(
              serviceName: 'YouTube',
              serviceIcon: Icons.video_library,
            ),
            Divider(),
            ServiceTile(
              serviceName: 'Gmail',
              serviceIcon: Icons.email,
            ),
            Divider(),
          ],
        ),
      ),
    );
  }
}

class ServiceTile extends StatelessWidget {
  final String serviceName;
  final IconData serviceIcon;

  const ServiceTile({
    required this.serviceName,
    required this.serviceIcon,
    Key? key,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return ListTile(
      leading: Icon(
        serviceIcon,
        color: Colors.blue,
      ),
      title: Text(serviceName),
      onTap: () {
        // Open modal with service Properties
      },
    );
  }
}
