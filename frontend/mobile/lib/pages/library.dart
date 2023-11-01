import 'package:area_mobile/components/library/workflow_tile.dart';
import 'package:area_mobile/services/dio.dart';
import 'package:area_mobile/types/services.dart';
import 'package:area_mobile/types/workflows/workflows.dart';
import 'package:flutter/material.dart';
import 'package:flutter_gen/gen_l10n/app_localizations.dart';

class Library extends StatefulWidget {
  const Library({Key? key}) : super(key: key);

  @override
  State<Library> createState() => _LibraryState();
}

class _LibraryState extends State<Library> {
  List<Workflow> workflows = [];

  @override
  void initState() {
    super.initState();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
          backgroundColor: Theme.of(context).colorScheme.primary,
          title: Text(AppLocalizations.of(context)!.libraryTitle),
          automaticallyImplyLeading: false),
      body: Container(
        constraints: const BoxConstraints(maxWidth: 450, maxHeight: 800),
        color: Theme.of(context).colorScheme.onSecondary,
        child: Padding(
          padding: const EdgeInsets.all(16.0),
          child: FutureBuilder<ServiceReturn<List<Workflow>>>(
            future: services.workflows.getAll(),
            builder: (context, snapshot) {
              if (snapshot.connectionState == ConnectionState.waiting) {
                return const Center(child: CircularProgressIndicator());
              } else if (snapshot.hasError) {
                return Center(
                  child: Text(AppLocalizations.of(context)!
                      .error(snapshot.error.toString())),
                );
              } else {
                workflows = snapshot.data!.data!;
                return ListView.builder(
                  itemCount: workflows.length,
                  itemBuilder: (context, index) {
                    return WorkflowTile(
                      workflow: workflows[index],
                      onUpdate: () async {
                        final newWorkflows = await services.workflows.getAll();
                        setState(() {
                          workflows = newWorkflows.data!;
                        });
                      },
                    );
                  },
                );
              }
            },
          ),
        ),
      ),
    );
  }
}
