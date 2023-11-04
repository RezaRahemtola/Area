import 'package:area_mobile/components/editor/cards/action_card.dart';
import 'package:area_mobile/components/editor/cards/reaction_card.dart';
import 'package:area_mobile/components/editor/modals/name_modal.dart';
import 'package:area_mobile/services/dio.dart';
import 'package:area_mobile/types/services.dart';
import 'package:area_mobile/types/workflows/editor.dart';
import 'package:area_mobile/utils/workflows.dart';
import 'package:flutter/material.dart';
import 'package:flutter_gen/gen_l10n/app_localizations.dart';
import 'package:uuid/v4.dart';

class Editor extends StatefulWidget {
  final EditorWorkflow workflow;
  final Function onSave;

  const Editor({
    super.key,
    required this.workflow,
    required this.onSave,
  });

  @override
  State<Editor> createState() => _EditorState();
}

class _EditorState extends State<Editor> {
  late EditorWorkflow workflow;

  @override
  void initState() {
    super.initState();
    workflow = widget.workflow;
  }

  void updateName(String newName) {
    setState(() {
      workflow.name = newName;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
          backgroundColor: Theme.of(context).colorScheme.primary,
          title: Text(AppLocalizations.of(context)!.editorTitle),
          automaticallyImplyLeading: false),
      body: Container(
        color: Theme.of(context).colorScheme.onSecondary,
        child: Padding(
          padding: const EdgeInsets.all(16.0),
          child: Column(
            children: [
              Card(
                elevation: 3,
                child: ListTile(
                  title: Text(workflow.name),
                  tileColor: Theme.of(context).colorScheme.secondary,
                  onTap: () =>
                      showEditorNameModal(context, workflow.name, updateName),
                  trailing: Switch(
                    activeColor: Theme.of(context).colorScheme.primary,
                    value: workflow.active,
                    onChanged: (bool value) {
                      setState(() {
                        workflow.active = value;
                      });
                    },
                  ),
                ),
              ),
              Column(
                children: <Widget>[
                  EditorActionCard(
                    workflowId: workflow.id,
                    action: workflow.action,
                    key: ValueKey(workflow.action.id),
                    onUpdate: (EditorWorkflowAction updatedAction) {
                      setState(() {
                        workflow.action = updatedAction;
                      });
                    },
                  ),
                  ...workflow.reactions.map(((reaction) => EditorReactionCard(
                        workflowId: workflow.id,
                        reaction: reaction,
                        key: ValueKey(reaction.id),
                        onUpdate: (EditorWorkflowReaction updatedReaction) {
                          setState(() {
                            workflow.reactions = workflow.reactions.map((r) {
                              if (r.id == reaction.id) return updatedReaction;
                              return r;
                            }).toList();
                          });
                        },
                      ))),
                ],
              ),
              ElevatedButton(
                child: const Text("+"),
                onPressed: () {
                  setState(() {
                    workflow.reactions = [
                      ...workflow.reactions,
                      getEmptyEditorReaction(
                          workflow.reactions.lastOrNull?.id ??
                              const UuidV4().generate().toString())
                    ];
                  });
                },
              ),
              ElevatedButton(
                child: Text(AppLocalizations.of(context)!.save),
                onPressed: () async {
                  late ServiceReturn<int> response;
                  if (workflow.id != null) {
                    response = await services.workflows.update(workflow);
                    await services.workflows
                        .toggleOne(workflow.id!, workflow.active);
                  } else {
                    response = await services.workflows.create(workflow);
                  }
                  if (response.data != null) {
                    widget.onSave();
                  }
                },
              )
            ],
          ),
        ),
      ),
    );
  }
}
