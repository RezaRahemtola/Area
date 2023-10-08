import 'package:flutter/material.dart';

class ActivityHero extends StatelessWidget {
  const ActivityHero({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Activity Log'),
      ),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: ListView(
          children: const <Widget>[
            ActivityEntry(
              time: '10:00 AM',
              description: 'Workflow: Spotify -> YouTube',
            ),
            Divider(),
            ActivityEntry(
              time: '10:00 AM',
              description: 'Workflow: Spotify -> YouTube',
            ),
            Divider(),
            ActivityEntry(
              time: '10:00 AM',
              description: 'Workflow: Spotify -> YouTube',
            ),
            Divider(),
            ActivityEntry(
              time: '10:00 AM',
              description: 'Workflow: Spotify -> YouTube',
            ),
            Divider(),
            ActivityEntry(
              time: '10:00 AM',
              description: 'Workflow: Spotify -> YouTube',
            ),
            Divider(),
            ActivityEntry(
              time: '10:00 AM',
              description: 'Workflow: Spotify -> YouTube',
            ),
            Divider(),
            ActivityEntry(
              time: '10:00 AM',
              description: 'Workflow: Spotify -> YouTube',
            ),
            Divider(),
          ],
        ),
      ),
    );
  }
}

class ActivityEntry extends StatelessWidget {
  final String time;
  final String description;

  const ActivityEntry({
    required this.time,
    required this.description,
    Key? key,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return ListTile(
      leading: const CircleAvatar(
        backgroundColor: Colors.blue,
        child: Icon(
          Icons.check,
          color: Colors.white,
        ),
      ),
      title: Text(time),
      subtitle: Text(description),
    );
  }
}
