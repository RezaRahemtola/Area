import 'package:area_mobile/pages/editor.dart';
import 'package:area_mobile/services/services/workflows.dart';
import 'package:area_mobile/types/services.dart';
import 'package:flutter/material.dart';

class LibraryHero extends StatelessWidget {
  const LibraryHero({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Workflows Library'),
      ),
      body: Container(
        constraints: const BoxConstraints(maxWidth: 450, maxHeight: 800),
        color: const Color(0xFFC5C6C6),
        child: Padding(
          padding: const EdgeInsets.all(16.0),
          child: FutureBuilder<ServiceReturn<List<Workflow>>>(
            future: getAllWorkflow(),
            builder: (context, snapshot) {
              if (snapshot.connectionState == ConnectionState.waiting) {
                return const Center(child: CircularProgressIndicator());
              } else if (snapshot.hasError) {
                return Center(
                  child: Text('Error: ${snapshot.error.toString()}'),
                );
              } else {
                final List<Workflow> workflows = [...?snapshot.data?.data];
                //FIXME - juste add d'un workflow pour tester
                workflows.add(Workflow(
                    id: "1",
                    name: "nom",
                    active: true,
                    action: const AreaInWorkflow(
                        id: "id",
                        areaId: "qsdfg",
                        areaServiceId: "areaServiceId"),
                    reactions: [
                      const AreaInWorkflow(
                          id: "id",
                          areaId: "qsdfg",
                          areaServiceId: "areaServiceId")
                    ]));
                return ListView.builder(
                  itemCount: workflows.length,
                  itemBuilder: (context, index) {
                    final workflow = workflows[index];
                    return Card(
                      elevation: 8,
                      child: WorkflowTile(
                        workflowName: workflow.name,
                        onTap: () {
                          Navigator.push(
                              context,
                              MaterialPageRoute(
                                  builder: (context) =>
                                      const Editor(workflowID: 5)));
                        },
                      ),
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

class WorkflowTile extends StatelessWidget {
  final String workflowName;
  final VoidCallback? onTap;

  const WorkflowTile({
    required this.workflowName,
    this.onTap,
    Key? key,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Card(
      elevation: 8,
      child: ListTile(
        title: Text(workflowName),
        onTap: onTap,
      ),
    );
  }
}
