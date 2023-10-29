import 'package:area_mobile/pages/editor.dart';
import 'package:area_mobile/services/dio.dart';
import 'package:area_mobile/types/services.dart';
import 'package:area_mobile/types/workflows/workflows.dart';
import 'package:flutter/material.dart';
import 'package:flutter_gen/gen_l10n/app_localizations.dart';
import 'package:flutter_svg/svg.dart';

class WorkflowTile extends StatelessWidget {
  final Workflow workflow;

  const WorkflowTile({
    required this.workflow,
    Key? key,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Card(
        elevation: 8,
        child: FutureBuilder<ServiceReturn<List<Service>>>(
            future: services.services.getAll(),
            builder: (context, snapshot) {
              if (snapshot.connectionState == ConnectionState.waiting) {
                return const Center(child: CircularProgressIndicator());
              } else if (snapshot.hasError) {
                return Center(
                  child: Text(AppLocalizations.of(context)!
                      .error(snapshot.error.toString())),
                );
              } else {
                final List<Service> services = snapshot.data!.data!;
                return ListTile(
                    title: Text(workflow.name),
                    onTap: () {
                      Navigator.push(
                          context,
                          MaterialPageRoute(
                              builder: (context) =>
                                  Editor(workflow: workflow)));
                    },
                    leading: SizedBox(
                      height: 128,
                      width: 128,
                      child:
                          ListView(scrollDirection: Axis.horizontal, children: [
                        SvgPicture.network(
                          services
                              .firstWhere(
                                  (s) => s.id == workflow.action.areaServiceId)
                              .imageUrl,
                          width: 32,
                          height: 32,
                        ),
                        ...workflow.reactions
                            .map((reaction) => SvgPicture.network(
                                  services
                                      .firstWhere(
                                          (s) => s.id == reaction.areaServiceId)
                                      .imageUrl,
                                  width: 32,
                                  height: 32,
                                ))
                      ]),
                    ));
              }
            }));
  }
}
