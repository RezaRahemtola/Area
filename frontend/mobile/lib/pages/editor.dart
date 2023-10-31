import 'package:area_mobile/colors.dart';
import 'package:area_mobile/components/editor/cards/action_card.dart';
import 'package:area_mobile/components/editor/cards/reaction_card.dart';
import 'package:area_mobile/components/editor/modals/name_modal.dart';
import 'package:area_mobile/types/workflows/workflows.dart';
import 'package:area_mobile/utils/workflows.dart';
import 'package:flutter/material.dart';
import 'package:flutter_gen/gen_l10n/app_localizations.dart';
import 'package:uuid/v4.dart';

class Editor extends StatefulWidget {
  final EditorWorkflow workflow;

  const Editor({
    super.key,
    required this.workflow,
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
          title: Text(AppLocalizations.of(context)!.editorTitle),
          automaticallyImplyLeading: false),
      body: Padding(
        padding: const EdgeInsets.all(3.0),
        child: Column(
          children: [
            Card(
              elevation: 3,
              child: ListTile(
                title: Text(workflow.name),
                tileColor: secondaryColor,
                onTap: () =>
                    showEditorNameModal(context, workflow.name, updateName),
                trailing: Switch(
                  activeColor: accentColor,
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
                EditorActionCard(action: workflow.action),
                ...workflow.reactions.map(
                    ((reaction) => EditorReactionCard(reaction: reaction))),
              ],
            ),
            ElevatedButton(
              child: const Text("+"),
              onPressed: () {
                setState(() {
                  workflow.reactions = [
                    ...workflow.reactions,
                    getEmptyEditorReaction(workflow.reactions.lastOrNull?.id ??
                        const UuidV4().generate().toString())
                  ];
                });
              },
            )
          ],
        ),
      ),
    );
  }
}
