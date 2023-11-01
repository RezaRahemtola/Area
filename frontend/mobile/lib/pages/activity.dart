import 'package:flutter/material.dart';
import 'package:flutter_gen/gen_l10n/app_localizations.dart';

class Activity extends StatelessWidget {
  const Activity({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
          backgroundColor: Theme.of(context).colorScheme.primary,
          title: Text(AppLocalizations.of(context)!.activityTitle),
          automaticallyImplyLeading: false),
      body: Container(
        color: Theme.of(context).colorScheme.onSecondary,
        child: Padding(
          padding: const EdgeInsets.all(16.0),
          child: ListView(
            children: <Widget>[
              Card(
                elevation: 4,
                color: Theme.of(context).colorScheme.primary,
                child: const ActivityEntry(
                  time: '10:00 AM',
                  description: 'Workflow: Spotify -> YouTube',
                ),
              ),
              const Divider(),
              Card(
                elevation: 4,
                color: Theme.of(context).colorScheme.primary,
                child: const ActivityEntry(
                  time: '10:00 AM',
                  description: 'Workflow: Spotify -> YouTube',
                ),
              ),
              const Divider(),
              Card(
                elevation: 4,
                color: Theme.of(context).colorScheme.primary,
                child: const ActivityEntry(
                  time: '10:00 AM',
                  description: 'Workflow: Spotify -> YouTube',
                ),
              ),
              const Divider(),
              Card(
                elevation: 4,
                color: Theme.of(context).colorScheme.primary,
                child: const ActivityEntry(
                  time: '10:00 AM',
                  description: 'Workflow: Spotify -> YouTube',
                ),
              ),
              const Divider(),
              Card(
                elevation: 4,
                color: Theme.of(context).colorScheme.primary,
                child: const ActivityEntry(
                  time: '10:00 AM',
                  description: 'Workflow: Spotify -> YouTube',
                ),
              ),
              const Divider(),
              Card(
                elevation: 4,
                color: Theme.of(context).colorScheme.primary,
                child: const ActivityEntry(
                  time: '10:00 AM',
                  description: 'Workflow: Spotify -> YouTube',
                ),
              ),
              const Divider(),
              Card(
                elevation: 4,
                color: Theme.of(context).colorScheme.primary,
                child: const ActivityEntry(
                  time: '10:00 AM',
                  description: 'Workflow: Spotify -> YouTube',
                ),
              ),
            ],
          ),
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
