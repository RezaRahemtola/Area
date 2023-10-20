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
          child: Padding(
            padding: const EdgeInsets.all(3.0),
            child: Card(
              elevation: 5,
              child: Column(
                children: [
                  const ListTile(
                    title: Text("Your workflow"),
                    tileColor: Color.fromARGB(255, 0, 255, 255),
                  ),
                  Container(
                    decoration: const BoxDecoration(
                        border: Border(
                            left: BorderSide(
                                color: Color.fromARGB(255, 100, 100, 100)))),
                    child: const Column(
                      children: [
                        Text("Ben on prie maintenant"),
                        Text("Ben on prie maintenant"),
                        Text("Ben on prie maintenant"),
                        Text("Ben on prie maintenant"),
                      ],
                    ),
                  ),
                ],
              ),
            ),
          )),
    );
  }
}
