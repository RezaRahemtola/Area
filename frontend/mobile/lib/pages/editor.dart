import 'package:area_mobile/colors.dart';
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
                tileColor: const Color.fromARGB(255, 0, 255, 255),
              ),
            ),
            Column(
              children: <Widget>[
                Card(
                  elevation: 4,
                  child: ListTile(
                    // TODO: update with service logo if defined
                    leading: Image.asset(
                      'assets/bolt.png',
                      color: primaryColor,
                    ),
                    title: Text(AppLocalizations.of(context)!.action),
                    subtitle: Text(
                        AppLocalizations.of(context)!.editorActionDescription),
                  ),
                ),
                ...workflow.reactions.map(((reaction) => Card(
                      elevation: 4,
                      child: ListTile(
                        // TODO: update with service logo if defined
                        leading: Image.asset(
                          'assets/bolt.png',
                          color: primaryColor,
                        ),
                        title: Text(AppLocalizations.of(context)!.reaction),
                        subtitle: Text(AppLocalizations.of(context)!
                            .editorReactionDescription),
                      ),
                    ))),
              ],
            ),
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
