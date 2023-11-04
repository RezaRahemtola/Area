import 'package:area_mobile/components/editor/modals/name_modal.dart';
import 'package:area_mobile/services/dio.dart';
import 'package:area_mobile/types/services.dart';
import 'package:area_mobile/types/workflows/workflows.dart';
import 'package:flutter/material.dart';
import 'package:flutter_gen/gen_l10n/app_localizations.dart';
import 'package:flutter_svg/svg.dart';

class WorkflowTile extends StatefulWidget {
  final Workflow workflow;
  final Function onUpdate;
  final Function(Workflow workflow) onOpenEditor;

  const WorkflowTile({
    required this.workflow,
    required this.onUpdate,
    required this.onOpenEditor,
    Key? key,
  }) : super(key: key);

  @override
  State<WorkflowTile> createState() => _WorkflowTileState();
}

class _WorkflowTileState extends State<WorkflowTile> {
  final GlobalKey _menuKey = GlobalKey();

  _renameWorkflow(String name) async {
    await services.workflows.rename(widget.workflow.id, name);
    widget.onUpdate();
  }

  _deleteWorkflow() async {
    await services.workflows.deleteOne(widget.workflow.id);
    widget.onUpdate();
  }

  _toggleWorkflow(bool newState) async {
    await services.workflows.toggleOne(widget.workflow.id, newState);
    widget.onUpdate();
  }

  _showPopupMenu(Offset offset) async {
    double left = offset.dx - 100;
    double top = offset.dy + 25;
    await showMenu(
      context: context,
      position: RelativeRect.fromLTRB(left, top, 0, 0),
      items: [
        PopupMenuItem(
          value: "rename",
          child: ListTile(
              leading: const Icon(Icons.title),
              title: Text(AppLocalizations.of(context)!.rename),
              onTap: () {
                Navigator.pop(context);
                showEditorNameModal(
                    context, widget.workflow.name, _renameWorkflow);
              }),
        ),
        PopupMenuItem(
          value: "edit",
          child: ListTile(
              leading: const Icon(Icons.edit),
              title: Text(AppLocalizations.of(context)!.edit),
              onTap: () {
                Navigator.pop(context);
                widget.onOpenEditor(widget.workflow);
              }),
        ),
        PopupMenuItem(
          value: "delete",
          child: ListTile(
            leading: const Icon(Icons.delete),
            title: Text(AppLocalizations.of(context)!.delete),
            onTap: () {
              Navigator.pop(context);
              _deleteWorkflow();
            },
          ),
        ),
      ],
      elevation: 8.0,
    );
  }

  @override
  Widget build(BuildContext context) {
    return Card(
        elevation: 8,
        color: Theme.of(context).colorScheme.primary,
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
                    title: GestureDetector(
                      onTapDown: (TapDownDetails details) {
                        _showPopupMenu(details.globalPosition);
                      },
                      child: Text(widget.workflow.name),
                    ),
                    onTap: () {
                      dynamic menuState = _menuKey.currentState;
                      menuState.showButtonMenu();
                    },
                    leading: SizedBox(
                      height: 128,
                      width: 128,
                      child:
                          ListView(scrollDirection: Axis.horizontal, children: [
                        SvgPicture.network(
                          services
                              .firstWhere((s) =>
                                  s.id == widget.workflow.action.areaServiceId)
                              .imageUrl,
                          width: 32,
                          height: 32,
                        ),
                        ...widget.workflow.reactions
                            .map((reaction) => SvgPicture.network(
                                  services
                                      .firstWhere(
                                          (s) => s.id == reaction.areaServiceId)
                                      .imageUrl,
                                  width: 32,
                                  height: 32,
                                ))
                      ]),
                    ),
                    trailing: SizedBox(
                      height: 75,
                      width: 75,
                      child: Switch(
                        value: widget.workflow.active,
                        onChanged: (bool value) {
                          _toggleWorkflow(value);
                        },
                      ),
                    ));
              }
            }));
  }
}
