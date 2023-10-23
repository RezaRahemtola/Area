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
  List<String> reactions = ["Test", "Essai"];

  void updateReactions(String newReaction) {
    setState(() {
      reactions.add(newReaction);
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text("Workflow"),
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
                          showAlert(context, updateReactions);
                        },
                        child: Text("+"))
                  ],
                ),
                tileColor: Color.fromARGB(255, 0, 255, 255),
              ),
            ),
            Expanded(
              child: Padding(
                  padding: const EdgeInsets.only(left: 16.0, right: 16.0),
                  child: ListView.builder(
                    itemCount: reactions.length,
                    itemBuilder: (BuildContext context, int index) {
                      return ListTile(
                        title: Text(reactions[index]),
                      );
                    },
                  )),
            ),
          ],
        ),
      ),
    );
  }
}

class ReactionElement extends StatelessWidget {
  final title;

  const ReactionElement({super.key, required this.title});

  @override
  Widget build(BuildContext context) {
    return Container(
        decoration: const BoxDecoration(
            border: Border(
                left: BorderSide(color: Color.fromARGB(255, 150, 150, 150)),
                bottom: BorderSide(color: Color.fromARGB(255, 150, 150, 150)))),
        child: const ListTile(
          title: Text("Reaction"),
        ));
  }
}

class ShowAlert extends StatefulWidget {
  final Function(String) updateReactions;

  ShowAlert({super.key, required this.updateReactions});

  @override
  _ShowAlertState createState() => _ShowAlertState();
}

class _ShowAlertState extends State<ShowAlert> {
  final textFieldValueHolder = TextEditingController();

  @override
  Widget build(BuildContext context) {
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
            setState(() {
              widget.updateReactions(textFieldValueHolder.text);
            });
            Navigator.of(context).pop();
          },
        ),
      ],
    );
  }
}

void showAlert(BuildContext context, Function(String) updateReactions) {
  showDialog(
    context: context,
    builder: (BuildContext context) {
      return ShowAlert(updateReactions: updateReactions);
    },
  );
}
