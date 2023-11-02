import 'package:area_mobile/components/editor/params/param_field.dart';
import 'package:area_mobile/types/workflows/editor.dart';
import 'package:flutter/material.dart';
import 'package:flutter_gen/gen_l10n/app_localizations.dart';

class SelectAreaParams extends StatefulWidget {
  final Function(List<AreaParameterWithValue> params) onSave;
  final EditorWorkflowElementArea area;
  final Function onBack;

  const SelectAreaParams(
      {super.key,
      required this.onSave,
      required this.area,
      required this.onBack});

  @override
  State<SelectAreaParams> createState() => _SelectAreaParamsState();
}

class _SelectAreaParamsState extends State<SelectAreaParams> {
  String? selectedEventId;
  List<AreaParameterWithValue> parameters = [];

  @override
  void initState() {
    super.initState();
    parameters = widget.area.parameters;
  }

  @override
  Widget build(BuildContext context) {
    return SizedBox(
        height: 600,
        child: Column(mainAxisSize: MainAxisSize.min, children: <Widget>[
          const SizedBox(height: 25),
          Text(AppLocalizations.of(context)!.editorChooseParams,
              style: const TextStyle(fontSize: 25)),
          const SizedBox(height: 25),
          Column(
            children: parameters
                .map((param) => EditorParamField(parameter: param))
                .toList(),
          ),
          ButtonBar(mainAxisSize: MainAxisSize.min, children: <Widget>[
            ElevatedButton(
              onPressed: () => widget.onBack(),
              child: Text(AppLocalizations.of(context)!.back),
            ),
            ElevatedButton(
              onPressed: () {
                widget.onSave(parameters);
                Navigator.pop(context);
              },
              child: Text(AppLocalizations.of(context)!.save),
            )
          ])
        ]));
  }
}
