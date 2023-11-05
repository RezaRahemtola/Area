import 'package:flutter/material.dart';
import 'package:flutter_gen/gen_l10n/app_localizations.dart';

class EditorReturnParams extends StatelessWidget {
  final List<String> returnParams;

  const EditorReturnParams({super.key, required this.returnParams});

  @override
  Widget build(BuildContext context) {
    if (returnParams.isEmpty) {
      return const SizedBox.shrink();
    } else {
      return Column(
        children: [
          Container(
            margin: const EdgeInsets.only(top: 30),
            child: Text(AppLocalizations.of(context)!.returnParameters),
          ),
          ...returnParams.map((param) => Text("\$$param"))
        ],
      );
    }
  }
}
