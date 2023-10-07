import 'package:flutter/material.dart';

class LibraryHero extends StatelessWidget {
  const LibraryHero({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Library'),
      ),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: ListView(
          children: const <Widget>[
            WorkflowTile(
              workflowName: 'Workflow 1',
              servicesUsed: ['Spotify', 'Gmail'],
            ),
            Divider(),
            WorkflowTile(
              workflowName: 'Workflow 2',
              servicesUsed: ['Discord', 'YouTube'],
            ),
            Divider(),
            WorkflowTile(
              workflowName: 'Workflow 3',
              servicesUsed: ['Spotify', 'YouTube', 'Gmail'],
            ),
            Divider(),
          ],
        ),
      ),
    );
  }
}

class WorkflowTile extends StatelessWidget {
  final String workflowName;
  final List<String> servicesUsed;

  const WorkflowTile({
    required this.workflowName,
    required this.servicesUsed,
    Key? key,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return ListTile(
      title: Text(workflowName),
      subtitle: Text('Services utilisés : ${servicesUsed.join(', ')}'),
      onTap: () {
        // Open modal with Workflow properties
      },
    );
  }
}
