import 'package:area_mobile/types/workflows/editor.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';

class EditorParamField extends StatefulWidget {
  final AreaParameterWithValue parameter;

  const EditorParamField({super.key, required this.parameter});

  @override
  State<EditorParamField> createState() => _EditorParamFieldState();
}

class _EditorParamFieldState extends State<EditorParamField> {
  late AreaParameterWithValue parameter;

  @override
  void initState() {
    super.initState();
    parameter = widget.parameter;
  }

  @override
  Widget build(BuildContext context) {
    if (["short-text", "email", "text-array"].contains(parameter.type)) {
      return TextFormField(
        decoration: InputDecoration(labelText: parameter.name),
        initialValue: parameter.value as String?,
        onChanged: ((String value) => parameter.value = value),
      );
    } else if (parameter.type == "long-text") {
      return TextFormField(
          decoration: InputDecoration(labelText: parameter.name),
          initialValue: parameter.value as String?,
          onChanged: ((String value) => parameter.value = value),
          keyboardType: TextInputType.multiline,
          maxLines: null);
    } else if (parameter.type == "integer") {
      return TextFormField(
          decoration: InputDecoration(labelText: parameter.name),
          initialValue: parameter.value as String?,
          onChanged: ((String value) => parameter.value = value),
          keyboardType: TextInputType.number,
          inputFormatters: <TextInputFormatter>[
            FilteringTextInputFormatter.digitsOnly
          ]);
    }
    return const Text("Never displayed");
  }
}
