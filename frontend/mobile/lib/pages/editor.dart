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
  double _size = 1.0;
  void grow() {
    setState(() {
      _size += 0.1;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(_size.toString()),
      ),
      body: Padding(
        padding: const EdgeInsets.all(3.0),
        child: Column(
          children: [
            Card(
              elevation: 3,
              child: ListTile(
                title: Row(
                  children: [
                    Text("Action"),
                    Expanded(child: SizedBox()),
                    ElevatedButton(
                        onPressed: () {
                          showAlert(context);
                        },
                        child: Text("+"))
                  ],
                ),
                tileColor: Color.fromARGB(255, 0, 255, 255),
              ),
            ),
            Padding(
              padding: const EdgeInsets.only(left: 16.0, right: 16.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // children placeholder actuellement
                  Container(
                      decoration: const BoxDecoration(
                          border: Border(
                              left: BorderSide(
                                  color: Color.fromARGB(255, 150, 150, 150)),
                              bottom: BorderSide(
                                  color: Color.fromARGB(255, 150, 150, 150)))),
                      child: const ListTile(
                        title: Text("Reaction"),
                      )),
                  Container(
                      decoration: const BoxDecoration(
                          border: Border(
                              left: BorderSide(
                                  color: Color.fromARGB(255, 150, 150, 150)),
                              bottom: BorderSide(
                                  color: Color.fromARGB(255, 150, 150, 150)))),
                      child: const ListTile(
                        title: Text("Reaction"),
                      )),
                  Container(
                      decoration: const BoxDecoration(
                          border: Border(
                              left: BorderSide(
                                  color: Color.fromARGB(255, 150, 150, 150)),
                              bottom: BorderSide(
                                  color: Color.fromARGB(255, 150, 150, 150)))),
                      child: const ListTile(
                        title: Text("Reaction"),
                      )),
                  Container(
                      decoration: const BoxDecoration(
                          border: Border(
                              left: BorderSide(
                                  color: Color.fromARGB(255, 150, 150, 150)),
                              bottom: BorderSide(
                                  color: Color.fromARGB(255, 150, 150, 150)))),
                      child: const ListTile(
                        title: Text("Reaction"),
                      )),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}

void showAlert(BuildContext context) {
  final textFieldValueHolder = TextEditingController();

  showDialog(
    context: context,
    builder: (BuildContext context) {
      return AlertDialog(
        title: const Text('Please Enter Value in Text Field.'),
        content: TextField(
          controller: textFieldValueHolder,
          decoration: const InputDecoration(hintText: 'Enter Some Text Here'),
        ),
        actions: <Widget>[
          TextButton(
            child: const Text("OK"),
            onPressed: () {
              Navigator.of(context).pop();
            },
          ),
        ],
      );
    },
  );
}
