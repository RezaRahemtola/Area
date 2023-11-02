import 'package:flutter/material.dart';

class EmptyNotice extends StatelessWidget {
  final String message;

  const EmptyNotice({
    super.key,
    required this.message,
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
          message,
        ));
  }
}
