import 'package:flutter/material.dart';
import 'package:flutter_gen/gen_l10n/app_localizations.dart';

class EditorNameModal extends StatefulWidget {
  final String currentName;
  final Function(String) updateName;

  const EditorNameModal(
      {super.key, required this.currentName, required this.updateName});

  @override
  State<EditorNameModal> createState() => _EditorNameModalState();
}

class _EditorNameModalState extends State<EditorNameModal> {
  late TextEditingController valueController;

  @override
  void initState() {
    super.initState();
    valueController = TextEditingController(text: widget.currentName);
  }

  @override
  Widget build(BuildContext context) {
    return AlertDialog(
      title: Text(AppLocalizations.of(context)!.editorNameModalTitle),
      content: TextField(
        controller: valueController,
      ),
      actions: <Widget>[
        TextButton(
          child: Text(AppLocalizations.of(context)!.save),
          onPressed: () {
            setState(() {
              widget.updateName(valueController.text);
            });
            Navigator.of(context).pop();
          },
        ),
      ],
    );
  }
}

void showEditorNameModal(
    BuildContext context, String currentName, Function(String) updateName) {
  showDialog(
    context: context,
    builder: (BuildContext context) {
      return EditorNameModal(currentName: currentName, updateName: updateName);
    },
  );
}
