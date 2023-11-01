import 'package:area_mobile/colors.dart';
import 'package:area_mobile/components/editor/steps/action/select_action_event.dart';
import 'package:area_mobile/components/editor/steps/action/select_action_service.dart';
import 'package:area_mobile/components/editor/steps/select_area_params.dart';
import 'package:area_mobile/services/dio.dart';
import 'package:area_mobile/types/workflows/editor.dart';
import 'package:flutter/material.dart';
import 'package:flutter_gen/gen_l10n/app_localizations.dart';
import 'package:flutter_svg/svg.dart';

class EditorActionCard extends StatefulWidget {
  final EditorWorkflowAction action;

  const EditorActionCard({super.key, required this.action});

  @override
  State<EditorActionCard> createState() => _EditorActionCardState();
}

class _EditorActionCardState extends State<EditorActionCard> {
  late EditorWorkflowAction action;
  EditorWorkflowStep step = EditorWorkflowStep.service;

  @override
  void initState() {
    super.initState();
    action = widget.action;
  }

  @override
  Widget build(BuildContext context) {
    return Card(
        elevation: 4,
        child: ListTile(
            leading: action.areaService?.imageUrl != null
                ? SvgPicture.network(
                    action.areaService!.imageUrl,
                    height: 64,
                    width: 64,
                  )
                : Image.asset(
                    'assets/bolt.png',
                    color: primaryColor,
                  ),
            title: Text(action.areaService?.id != null
                ? AppLocalizations.of(context)!
                    .actionService(action.areaService!.id)
                : AppLocalizations.of(context)!.action),
            subtitle: Text(action.area?.id ??
                AppLocalizations.of(context)!.editorActionDescription),
            onTap: () {
              showModalBottomSheet<void>(
                  context: context,
                  builder: (BuildContext context) {
                    return StatefulBuilder(builder:
                        (BuildContext context, StateSetter setModalState) {
                      if (step == EditorWorkflowStep.service) {
                        return SelectActionService(
                          onSave: (String? selectedServiceId) async {
                            if (selectedServiceId != null) {
                              final selectedService = await services.services
                                  .getOne(selectedServiceId);
                              // TODO: propagate change for editor saving
                              setModalState(() {
                                step = EditorWorkflowStep.event;
                              });
                              setState(() {
                                action.areaService =
                                    EditorWorkflowElementService(
                                        id: selectedServiceId,
                                        imageUrl:
                                            selectedService.data!.imageUrl);
                              });
                            }
                          },
                        );
                      } else if (step == EditorWorkflowStep.event) {
                        return SelectActionEvent(
                          service: action.areaService!,
                          onSave: (String? selectedEventId) async {
                            if (selectedEventId != null) {
                              final selectedArea = (await services.services
                                      .getServiceActions(
                                          action.areaService!.id))
                                  .data!
                                  .firstWhere((element) =>
                                      element.id == selectedEventId);
                              // TODO: propagate change for editor saving
                              setModalState(() {
                                step = EditorWorkflowStep.parameters;
                              });
                              setState(() {
                                action.area = EditorWorkflowElementArea(
                                    id: selectedEventId,
                                    parameters: selectedArea.parametersFormFlow
                                        .map((param) => AreaParameterWithValue(
                                            name: param.name,
                                            type: param.type,
                                            required: param.required))
                                        .toList());
                              });
                            }
                          },
                        );
                      } else if (step == EditorWorkflowStep.parameters) {
                        return SelectAreaParams(
                          area: action.area!,
                          onSave: (List<AreaParameterWithValue> params) async {
                            setState(() {
                              action.area!.parameters = params;
                            });
                          },
                        );
                      }
                      return const Text("Never displayed");
                    });
                  });
            }));
  }
}
