import 'package:area_mobile/colors.dart';
import 'package:area_mobile/types/workflows/workflows.dart';
import 'package:flutter/material.dart';
import 'package:flutter_gen/gen_l10n/app_localizations.dart';

class EditorReactionCard extends StatefulWidget {
  final EditorWorkflowReaction reaction;

  const EditorReactionCard({super.key, required this.reaction});

  @override
  State<EditorReactionCard> createState() => _EditorReactionCardState();
}

class _EditorReactionCardState extends State<EditorReactionCard> {
  late EditorWorkflowReaction reaction;

  @override
  void initState() {
    super.initState();
    reaction = widget.reaction;
  }

  @override
  Widget build(BuildContext context) {
    return Card(
        elevation: 4,
        child: ListTile(
          // TODO: update with service logo if defined
          leading: Image.asset(
            'assets/bolt.png',
            color: primaryColor,
          ),
          title: Text(AppLocalizations.of(context)!.reaction),
          subtitle:
              Text(AppLocalizations.of(context)!.editorReactionDescription),
        ));
  }
}
