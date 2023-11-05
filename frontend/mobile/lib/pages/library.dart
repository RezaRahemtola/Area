import 'package:area_mobile/components/empty_notice.dart';
import 'package:area_mobile/components/library/workflow_tile.dart';
import 'package:area_mobile/services/dio.dart';
import 'package:area_mobile/types/services.dart';
import 'package:area_mobile/types/workflows/editor.dart';
import 'package:area_mobile/types/workflows/workflows.dart';
import 'package:flutter/material.dart';
import 'package:flutter_gen/gen_l10n/app_localizations.dart';

class Library extends StatefulWidget {
  final Function(EditorWorkflow workflow) onOpenEditor;

  const Library({required this.onOpenEditor, Key? key}) : super(key: key);

  @override
  State<Library> createState() => _LibraryState();
}

class _LibraryState extends State<Library> {
  List<Workflow> workflows = [];
  bool needRefresh = true;
  List<Workflow> initialWorkflows = [];

  final TextEditingController searchController = TextEditingController();

  @override
  void initState() {
    super.initState();
  }

  void _updateSearch(String search) {
    setState(() {
      workflows = initialWorkflows
          .where((element) =>
              element.name.toLowerCase().contains(search.toLowerCase()))
          .toList();
    });
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
          child: Column(
            children: [
              Padding(
                padding: const EdgeInsets.all(4.0),
                child: Container(
                  color: Theme.of(context).colorScheme.onSecondary,
                  child: TextField(
                    controller: searchController,
                    onEditingComplete: () =>
                        _updateSearch(searchController.text),
                    decoration: InputDecoration(
                      hintText: AppLocalizations.of(context)!.searchBar,
                      suffixIcon: IconButton(
                        icon: const Icon(Icons.clear),
                        onPressed: () => searchController.clear(),
                      ),
                      prefixIcon: IconButton(
                        icon: const Icon(Icons.search),
                        onPressed: () {
                          _updateSearch(searchController.text);
                        },
                      ),
                      border: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(0.0),
                      ),
                    ),
                  ),
                ),
              ),
              Expanded(
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
                      if (needRefresh) {
                        needRefresh = false;
                        if (snapshot.data!.data != null) {
                          initialWorkflows = snapshot.data!.data!;
                          workflows = snapshot.data!.data!;
                        }
                      }
                      return workflows.isEmpty
                          ? EmptyNotice(
                              message:
                                  AppLocalizations.of(context)!.noWorkflows,
                            )
                          : ListView.builder(
                              itemCount: workflows.length,
                              itemBuilder: (context, index) {
                                return WorkflowTile(
                                  workflow: workflows[index],
                                  onUpdate: () async {
                                    final newWorkflows =
                                        await services.workflows.getAll();
                                    setState(() {
                                      initialWorkflows = newWorkflows.data!;
                                    });
                                    _updateSearch(searchController.text);
                                  },
                                  onOpenEditor: widget.onOpenEditor,
                                );
                              },
                            );
                    }
                  },
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
