import 'package:area_mobile/components/services/service_card.dart';
import 'package:area_mobile/services/dio.dart';
import 'package:area_mobile/types/services.dart';
import 'package:area_mobile/types/workflows/editor.dart';
import 'package:flutter/material.dart';
import 'package:flutter_gen/gen_l10n/app_localizations.dart';

class SelectReactionService extends StatefulWidget {
  final Function(String? selectedServiceId) onSave;
  final EditorWorkflowElementService? service;

  const SelectReactionService(
      {super.key, required this.onSave, required this.service});

  @override
  State<SelectReactionService> createState() => _SelectReactionServiceState();
}

class _SelectReactionServiceState extends State<SelectReactionService> {
  String? selectedServiceId;
  Future<ServiceReturn<List<Service>>>? getServicesFuture;

  @override
  void initState() {
    super.initState();
    getServicesFuture = services.services.getAll(has: "reactions");
    selectedServiceId = widget.service?.id;
  }

  @override
  Widget build(BuildContext context) {
    return SizedBox(
        height: 650,
        child: Column(mainAxisSize: MainAxisSize.min, children: <Widget>[
          const SizedBox(height: 25),
          Text(AppLocalizations.of(context)!.editorChooseService,
              style: const TextStyle(fontSize: 25)),
          const SizedBox(height: 25),
          FutureBuilder<ServiceReturn<List<Service>>>(
            future: getServicesFuture,
            builder: (context, snapshot) {
              if (snapshot.connectionState == ConnectionState.waiting) {
                return const Center(child: CircularProgressIndicator());
              } else if (snapshot.hasError) {
                return Center(
                  child: Text(AppLocalizations.of(context)!
                      .error(snapshot.error.toString())),
                );
              } else {
                final List<Service> services = [...?snapshot.data?.data];

                return Expanded(
                    child: SingleChildScrollView(
                        child: Column(children: [
                  ...services.map((service) => ServiceCard(
                        service: service,
                        selected: service.id == selectedServiceId,
                        onTap: () {
                          setState(() {
                            selectedServiceId = service.id;
                          });
                        },
                      )),
                  ElevatedButton(
                    onPressed: selectedServiceId != null
                        ? () {
                            widget.onSave(selectedServiceId);
                          }
                        : null,
                    child: Text(AppLocalizations.of(context)!.save),
                  )
                ])));
              }
            },
          ),
        ]));
  }
}
