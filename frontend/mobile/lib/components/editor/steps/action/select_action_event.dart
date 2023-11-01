import 'package:area_mobile/services/dio.dart';
import 'package:area_mobile/types/services.dart';
import 'package:area_mobile/types/workflows/editor.dart';
import 'package:flutter/material.dart';
import 'package:flutter_gen/gen_l10n/app_localizations.dart';
import 'package:webview_flutter/webview_flutter.dart';

class SelectActionEvent extends StatefulWidget {
  final Function(String? selectedEventId) onSave;
  final EditorWorkflowElementService service;

  const SelectActionEvent(
      {super.key, required this.onSave, required this.service});

  @override
  State<SelectActionEvent> createState() => _SelectActionEventState();
}

class _SelectActionEventState extends State<SelectActionEvent> {
  String? selectedEventId;
  late Future<ServiceReturn<List<Area>>> getActionsFuture;

  bool authInProgress = false;
  String? oauthUrl;

  WebViewController? webviewController;

  @override
  void initState() {
    super.initState();
    getActionsFuture = services.services.getServiceActions(widget.service.id);
  }

  @override
  Widget build(BuildContext context) {
    return StatefulBuilder(
        builder: (BuildContext context, StateSetter setModalState) {
      return authInProgress
          ? WebViewWidget(controller: webviewController!)
          : SizedBox(
              height: 600,
              child: Column(mainAxisSize: MainAxisSize.min, children: <Widget>[
                const SizedBox(height: 25),
                Text(AppLocalizations.of(context)!.editorChooseEvent,
                    style: const TextStyle(fontSize: 25)),
                const SizedBox(height: 25),
                FutureBuilder<ServiceReturn<List<Area>>>(
                  future: getActionsFuture,
                  builder: (context, snapshot) {
                    if (snapshot.connectionState == ConnectionState.waiting) {
                      return const Center(child: CircularProgressIndicator());
                    } else if (snapshot.hasError) {
                      return Center(
                        child: Text(AppLocalizations.of(context)!
                            .error(snapshot.error.toString())),
                      );
                    } else {
                      final List<Area> areas = [...?snapshot.data?.data];

                      return Column(children: [
                        DropdownButtonFormField(
                          value: selectedEventId,
                          items: areas.map((Area area) {
                            return DropdownMenuItem<String>(
                              value: area.id,
                              // TODO: display description
                              child: Text(area.id),
                            );
                          }).toList(),
                          onChanged: (value) async {
                            if (value == null) return;
                            final connectOAuth = await services.connections
                                .connect(
                                    widget.service.id,
                                    areas
                                        .firstWhere((e) => e.id == value)
                                        .serviceScopesNeeded);
                            setState(() {
                              selectedEventId = value;
                              oauthUrl = connectOAuth.data;
                              webviewController = WebViewController()
                                ..setJavaScriptMode(JavaScriptMode.unrestricted)
                                ..setBackgroundColor(const Color(0x00000000))
                                ..loadRequest(Uri.parse(connectOAuth.data!));
                            });
                          },
                          decoration: InputDecoration(
                              labelText: AppLocalizations.of(context)!.action),
                        ),
                        ElevatedButton(
                          onPressed: selectedEventId != null &&
                                  oauthUrl != null &&
                                  oauthUrl != ""
                              ? () {
                                  setState(() {
                                    authInProgress = true;
                                  });
                                }
                              : null,
                          child: Text(
                              selectedEventId != null && oauthUrl == null
                                  ? AppLocalizations.of(context)!
                                      .accountAlreadyConnected
                                  : oauthUrl == ""
                                      ? AppLocalizations.of(context)!
                                          .noAccountToConnect
                                      : AppLocalizations.of(context)!
                                          .connectAccount),
                        ),
                        ElevatedButton(
                          onPressed: selectedEventId != null &&
                                  !authInProgress &&
                                  (oauthUrl == null || oauthUrl == "")
                              ? () {
                                  widget.onSave(selectedEventId);
                                }
                              : null,
                          child: Text(AppLocalizations.of(context)!.save),
                        )
                      ]);
                    }
                  },
                ),
              ]));
    });
  }
}
