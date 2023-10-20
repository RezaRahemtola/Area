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
          color: const Color.fromARGB(255, 255, 255, 255),
          child: Padding(
            padding: const EdgeInsets.all(3.0),
            child: Column(
              children: [
                const Card(
                  elevation: 3,
                  child: ListTile(
                    title: Text("Your workflow"),
                    tileColor: Color.fromARGB(255, 0, 255, 255),
                  ),
                ),
                Padding(
                  padding: const EdgeInsets.only(left: 20.0),
                  child: Container(
                    height: 16,
                    width: double.infinity,
                    decoration: const BoxDecoration(
                        border: Border(
                            left: BorderSide(
                                color: Color.fromARGB(255, 100, 100, 100)))),
                  ),
                ),
                Padding(
                  padding: const EdgeInsets.only(left: 20.0),
                  child: Container(
                    width: double.infinity,
                    decoration: const BoxDecoration(
                        border: Border(
                            left: BorderSide(
                                color: Color.fromARGB(255, 100, 100, 100)))),
                    child: Padding(
                      padding: const EdgeInsets.only(left: 16.0),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Container(
                              decoration: const BoxDecoration(
                                  border: Border(
                                      left: BorderSide(
                                          color: Color.fromARGB(
                                              255, 150, 150, 150)),
                                      bottom: BorderSide(
                                          color: Color.fromARGB(
                                              255, 150, 150, 150)))),
                              child: const ListTile(
                                title: Text("Ben on prie maintenant"),
                              )),
                          Container(
                              decoration: const BoxDecoration(
                                  border: Border(
                                      left: BorderSide(
                                          color: Color.fromARGB(
                                              255, 150, 150, 150)),
                                      bottom: BorderSide(
                                          color: Color.fromARGB(
                                              255, 150, 150, 150)))),
                              child: const ListTile(
                                title: Text("Ben on prie maintenant"),
                              )),
                          Container(
                              decoration: const BoxDecoration(
                                  border: Border(
                                      left: BorderSide(
                                          color: Color.fromARGB(
                                              255, 150, 150, 150)),
                                      bottom: BorderSide(
                                          color: Color.fromARGB(
                                              255, 150, 150, 150)))),
                              child: const ListTile(
                                title: Text("Ben on prie maintenant"),
                              )),
                          Container(
                              decoration: const BoxDecoration(
                                  border: Border(
                                      left: BorderSide(
                                          color: Color.fromARGB(
                                              255, 150, 150, 150)),
                                      bottom: BorderSide(
                                          color: Color.fromARGB(
                                              255, 150, 150, 150)))),
                              child: const ListTile(
                                title: Text("Ben on prie maintenant"),
                              )),
                        ],
                      ),
                    ),
                  ),
                ),
              ],
            ),
          )),
    );
  }
}
