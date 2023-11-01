import 'package:area_mobile/components/empty_notice.dart';
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

  bool needRefresh = true;
  List<Workflow> initialWorkflows = [];
  @override
  Widget build(BuildContext context) {
    final TextEditingController searchController = TextEditingController();

    return Scaffold(
      appBar: AppBar(
          title: Text(AppLocalizations.of(context)!.libraryTitle),
          automaticallyImplyLeading: false),
      body: Container(
        constraints: const BoxConstraints(maxWidth: 450, maxHeight: 800),
        color: const Color(0xFFC5C6C6),
        child: Padding(
          padding: const EdgeInsets.all(16.0),
          child: Column(
            children: [
              Padding(
                padding: const EdgeInsets.all(4.0),
                child: Container(
                  color: Colors.white,
                  child: TextField(
                    controller: searchController,
                    decoration: InputDecoration(
                      hintText: AppLocalizations.of(context)!.searchBar,
                      suffixIcon: IconButton(
                        icon: const Icon(Icons.clear),
                        onPressed: () => searchController.clear(),
                      ),
                      prefixIcon: IconButton(
                        icon: const Icon(Icons.search),
                        onPressed: () async {
                          setState(() {
                            workflows = initialWorkflows
                                .where((element) => element.name
                                    .contains(searchController.text))
                                .toList();
                          });
                        },
                      ),
                      border: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(0.0),
                      ),
                    ),
                  ),
                ),
              ),
              FutureBuilder<ServiceReturn<List<Workflow>>>(
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
                    if (workflows.isEmpty) {
                      return const EmptyNotice();
                    } else {
                      return Expanded(
                        child: ListView.builder(
                          itemCount: workflows.length,
                          itemBuilder: (context, index) {
                            return WorkflowTile(
                              workflow: workflows[index],
                              onUpdate: () async {
                                final newWorkflows =
                                    await services.workflows.getAll();
                                setState(() {
                                  workflows = newWorkflows.data!;
                                });
                              },
                            );
                          },
                        ),
                      );
                    }
                  }
                },
              ),
            ],
          ),
        ),
      ),
    );
  }
}
