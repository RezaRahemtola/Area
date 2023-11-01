import 'package:flutter/material.dart';
import 'package:flutter_gen/gen_l10n/app_localizations.dart';

class EmptyNotice extends StatelessWidget {
  const EmptyNotice({
    super.key,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
        margin: const EdgeInsets.only(top: 25.0),
        padding: const EdgeInsets.only(
            left: 75.0, right: 75.0, top: 15.0, bottom: 15.0),
        decoration: BoxDecoration(
          border: Border.all(color: Colors.grey),
          borderRadius: const BorderRadius.all(Radius.circular(15.0)),
        ),
        child: Text(
          AppLocalizations.of(context)!.emptyNotice,
        ));
  }
}
