import 'package:area_mobile/colors.dart';
import 'package:area_mobile/components/editor/steps/action/select_action_service.dart';
import 'package:area_mobile/types/workflows/workflows.dart';
import 'package:flutter/material.dart';
import 'package:flutter_gen/gen_l10n/app_localizations.dart';

class EditorActionCard extends StatefulWidget {
  final EditorWorkflowAction action;

  const EditorActionCard({super.key, required this.action});

  @override
  State<EditorActionCard> createState() => _EditorActionCardState();
}

class _EditorActionCardState extends State<EditorActionCard> {
  late EditorWorkflowAction action;

  @override
  void initState() {
    super.initState();
    action = widget.action;
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
          title: Text(AppLocalizations.of(context)!.action),
          subtitle: Text(AppLocalizations.of(context)!.editorActionDescription),
          onTap: () {
            showModalBottomSheet<void>(
              context: context,
              builder: (BuildContext context) {
                return const SelectActionService();
              },
            );
          },
        ));
  }
}
