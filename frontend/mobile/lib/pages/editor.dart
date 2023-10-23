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

  void removeReaction(String newReaction) {
    setState(() {
      reactions.removeWhere((element) => element == newReaction);
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
                  child: ReorderableListView(
                    children: <Widget>[
                      for (int index = 0; index < reactions.length; index += 1)
                        ReactionElement(
                            key: Key('$index'),
                            title: reactions[index],
                            removeReaction: removeReaction)
                    ],
                    onReorder: (int oldIndex, int newIndex) {
                      setState(() {
                        if (oldIndex < newIndex) {
                          newIndex -= 1;
                        }
                        String temp = reactions[oldIndex];
                        reactions[oldIndex] = reactions[newIndex];
                        reactions[newIndex] = temp;
                      });
                    },
                  )),
            ),
          ],
        ),
      ),
    );
  }
}

class ReactionElement extends StatefulWidget {
  final String title;
  final Function(String) removeReaction;

  const ReactionElement(
      {Key? key, required this.title, required this.removeReaction})
      : super(key: key);

  @override
  State<ReactionElement> createState() => _ReactionElementState();
}

class _ReactionElementState extends State<ReactionElement> {
  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: const BoxDecoration(
        border: Border(
          left: BorderSide(color: Color.fromARGB(255, 150, 150, 150)),
          bottom: BorderSide(color: Color.fromARGB(255, 150, 150, 150)),
        ),
      ),
      child: ListTile(
        title: Text(widget.title),
        trailing: ElevatedButton(
          onPressed: () {
            widget.removeReaction(widget.title);
          },
          child: const Icon(Icons.delete),
        ),
      ),
    );
  }
}

class ShowAlert extends StatefulWidget {
  final Function(String) updateReactions;

  const ShowAlert({super.key, required this.updateReactions});

  @override
  State<ShowAlert> createState() => _ShowAlertState();
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
