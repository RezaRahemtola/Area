import 'package:area_mobile/types/workflows/editor.dart';
import 'package:flutter/material.dart';

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
    if (parameter.type == "short-text") {
      return TextFormField(
        decoration: InputDecoration(labelText: parameter.name),
        initialValue: parameter.value as String?,
        onChanged: ((String value) => parameter.value = value),
      );
    }
    return const Text("Never displayed");
  }
}
