import 'package:area_mobile/colors.dart';
import 'package:area_mobile/components/editor/action_card.dart';
import 'package:area_mobile/components/editor/reaction_card.dart';
import 'package:area_mobile/types/workflows/workflows.dart';
import 'package:area_mobile/utils/workflows.dart';
import 'package:flutter/material.dart';
import 'package:flutter_gen/gen_l10n/app_localizations.dart';

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
                title: Row(
                  children: [
                    Text(workflow.name),
                    const Expanded(child: SizedBox()),
                    Switch(
                      activeColor: accentColor,
                      value: workflow.active,
                      onChanged: (bool value) {
                        setState(() {
                          workflow = EditorWorkflow(
                              id: workflow.id,
                              name: workflow.name,
                              active: value,
                              action: workflow.action,
                              reactions: workflow.reactions);
                        });
                      },
                    ),
                  ],
                ),
                tileColor: secondaryColor,
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
                onPressed: () {
                  setState(() {
                    workflow = EditorWorkflow(
                        id: workflow.id,
                        name: workflow.name,
                        active: workflow.active,
                        action: workflow.action,
                        reactions: [
                          ...workflow.reactions,
                          getEmptyEditorReaction("TODO")
                        ]);
                  });
                },
                child: const Text("+"))
          ],
        ),
      ),
    );
  }
}

class ReactionElement extends StatefulWidget {
  final String title;
  final Function(String) removeReaction;

  const ReactionElement(
      {Key? key, required this.title, required this.removeReaction})
      : super(key: key);

  @override
  State<ReactionElement> createState() => _ReactionElementState();
}

class _ReactionElementState extends State<ReactionElement> {
  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: const BoxDecoration(
        border: Border(
          left: BorderSide(color: Color.fromARGB(255, 150, 150, 150)),
          bottom: BorderSide(color: Color.fromARGB(255, 150, 150, 150)),
        ),
      ),
      child: ListTile(
        title: Text(widget.title),
        trailing: ElevatedButton(
          onPressed: () {
            widget.removeReaction(widget.title);
          },
          child: const Icon(Icons.delete),
        ),
      ),
    );
  }
}
