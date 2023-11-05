import 'package:area_mobile/components/trad.dart';
import 'package:area_mobile/services/dio.dart';
import 'package:area_mobile/types/services.dart';
import 'package:area_mobile/types/workflows/editor.dart';
import 'package:flutter/material.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:flutter_gen/gen_l10n/app_localizations.dart';
import 'package:webview_flutter/webview_flutter.dart';

class SelectReactionEvent extends StatefulWidget {
  final Function(String? selectedEventId) onSave;
  final EditorWorkflowElementService service;
  final Function onBack;
  final EditorWorkflowElementArea? area;

  const SelectReactionEvent(
      {super.key,
      required this.onSave,
      required this.service,
      required this.onBack,
      required this.area});

  @override
  State<SelectReactionEvent> createState() => _SelectReactionEventState();
}

class _SelectReactionEventState extends State<SelectReactionEvent> {
  String? selectedEventId;
  late Future<ServiceReturn<List<Area>>> getReactionsFuture;

  bool authInProgress = false;
  String? oauthUrl;

  WebViewController? webviewController;

  @override
  void initState() {
    super.initState();
    getReactionsFuture =
        services.services.getServiceReactions(widget.service.id);
    selectedEventId = widget.area?.id;
  }

  @override
  Widget build(BuildContext context) {
    return StatefulBuilder(
        builder: (BuildContext context, StateSetter setModalState) {
      return authInProgress
          ? Scaffold(
              appBar: AppBar(
                  title: Text(AppLocalizations.of(context)!.register),
                  leading: IconButton(
                    icon: const Icon(Icons.arrow_back),
                    onPressed: () async {
                      setState(() {
                        authInProgress = false;
                      });
                    },
                  ),
                  automaticallyImplyLeading: false),
              body: WebViewWidget(controller: webviewController!))
          : SizedBox(
              height: 650,
              child: Column(mainAxisSize: MainAxisSize.min, children: <Widget>[
                const SizedBox(height: 25),
                Text(AppLocalizations.of(context)!.editorChooseEvent,
                    style: const TextStyle(fontSize: 25)),
                const SizedBox(height: 25),
                FutureBuilder<ServiceReturn<List<Area>>>(
                  future: getReactionsFuture,
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
                              child: Text(getAreaTrad(
                                  area.id.replaceAll("-", "_"), context)),
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

                              if (connectOAuth.data == null ||
                                  connectOAuth.data == "") return;
                              webviewController = WebViewController()
                                ..setJavaScriptMode(JavaScriptMode.unrestricted)
                                ..setNavigationDelegate(NavigationDelegate(
                                    onNavigationRequest:
                                        (NavigationRequest request) {
                                  if (request.url.startsWith(
                                      '${dotenv.env['OAUTH_REDIRECTION_URL']}')) {
                                    setState(() {
                                      authInProgress = false;
                                      oauthUrl = null;
                                    });
                                    return NavigationDecision.prevent;
                                  }
                                  return NavigationDecision.navigate;
                                }))
                                ..setBackgroundColor(const Color(0x00000000))
                                ..loadRequest(Uri.parse(connectOAuth.data!))
                                ..setUserAgent("random");
                            });
                          },
                          decoration: InputDecoration(
                              labelText:
                                  AppLocalizations.of(context)!.reaction),
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
                        ButtonBar(
                            mainAxisSize: MainAxisSize.min,
                            children: <Widget>[
                              ElevatedButton(
                                onPressed: () => widget.onBack(),
                                child: Text(AppLocalizations.of(context)!.back),
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
                            ])
                      ]);
                    }
                  },
                ),
              ]));
    });
  }
}
