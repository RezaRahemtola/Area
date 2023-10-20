import 'package:flutter/material.dart';

class Editor extends StatefulWidget {
  final int workflowID;

  const Editor({
    super.key,
    required this.workflowID,
  });

  @override
  State<Editor> createState() => _EditorState();
}

class _EditorState extends State<Editor> {
  // void grow() {
  //   setState(() {
  //     _size += 0.1;
  //   });
  // }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Editor'),
      ),
      body: Container(
          constraints: const BoxConstraints(
            maxWidth: 450,
          ),
          color: const Color(0xFFC5C6C6),
          child: const Padding(
            padding: EdgeInsets.all(3.0),
            child: Card(
              elevation: 1,
              child: ListTile(
                title: Text("test"),
                tileColor: Color.fromARGB(255, 0, 255, 255),
              ),
            ),
          )),
    );
  }
}
