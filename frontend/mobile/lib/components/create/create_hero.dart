import 'package:flutter/material.dart';

class CreateHero extends StatelessWidget {
  const CreateHero({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Créer un Workflow'),
      ),
      body: const Padding(
        padding: EdgeInsets.all(16.0),
        child: WorkflowForm(),
      ),
    );
  }
}

class WorkflowForm extends StatelessWidget {
  const WorkflowForm({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Form(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: <Widget>[
          TextFormField(
            decoration: const InputDecoration(labelText: 'Nom du Workflow'),
          ),
          const SizedBox(height: 16.0),
          DropdownButtonFormField(
            items: const [
              DropdownMenuItem(
                value: 'Spotify',
                child: Text('Spotify'),
              ),
              DropdownMenuItem(
                value: 'Discord',
                child: Text('Discord'),
              ),
              DropdownMenuItem(
                value: 'YouTube',
                child: Text('YouTube'),
              ),
              DropdownMenuItem(
                value: 'Gmail',
                child: Text('Gmail'),
              ),
            ],
            onChanged: (selectedService) {},
            decoration:
                const InputDecoration(labelText: 'Sélectionnez un Service'),
          ),
          DropdownButtonFormField(
            items: const [
              DropdownMenuItem(
                value: 'Spotify',
                child: Text('Spotify'),
              ),
              DropdownMenuItem(
                value: 'Discord',
                child: Text('Discord'),
              ),
              DropdownMenuItem(
                value: 'YouTube',
                child: Text('YouTube'),
              ),
              DropdownMenuItem(
                value: 'Gmail',
                child: Text('Gmail'),
              ),
            ],
            onChanged: (selectedService) {},
            decoration:
                const InputDecoration(labelText: 'Sélectionnez un Service'),
          ),
          const SizedBox(height: 16.0),
          ElevatedButton(
            onPressed: () {},
            child: const Text('Enregistrer le Workflow'),
          ),
        ],
      ),
    );
  }
}
