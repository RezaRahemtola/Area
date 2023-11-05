import 'package:area_mobile/components/editor/steps/action/select_action_event.dart';
import 'package:area_mobile/components/editor/steps/action/select_action_service.dart';
import 'package:area_mobile/components/editor/steps/select_area_params.dart';
import 'package:area_mobile/services/dio.dart';
import 'package:area_mobile/types/workflows/editor.dart';
import 'package:flutter/material.dart';
import 'package:flutter_gen/gen_l10n/app_localizations.dart';
import 'package:flutter_svg/svg.dart';

class EditorActionCard extends StatefulWidget {
  final String? workflowId;
  final EditorWorkflowAction action;
  final Function(EditorWorkflowAction updatedAction) onUpdate;

  const EditorActionCard(
      {super.key,
      required this.workflowId,
      required this.action,
      required this.onUpdate});

  @override
  State<EditorActionCard> createState() => _EditorActionCardState();
}

class _EditorActionCardState extends State<EditorActionCard> {
  late EditorWorkflowAction action;
  late EditorWorkflowStep step;

  @override
  void initState() {
    super.initState();
    action = widget.action;
    step = widget.workflowId != null
        ? EditorWorkflowStep.parameters
        : EditorWorkflowStep.service;
  }

  @override
  Widget build(BuildContext context) {
    return Card(
        elevation: 4,
        color: Theme.of(context).colorScheme.primary,
        child: ListTile(
            leading: action.areaService?.imageUrl != null
                ? SvgPicture.network(
                    action.areaService!.imageUrl,
                    height: 50,
                    width: 50,
                  )
                : Image.asset(
                    'assets/bolt.png',
                    height: 50,
                    width: 50,
                    color: Theme.of(context).colorScheme.onPrimary,
                  ),
            title: Text(action.areaService?.id != null
                ? AppLocalizations.of(context)!
                    .actionService(action.areaService!.id)
                : AppLocalizations.of(context)!.action),
            subtitle: Text(action.area?.id ??
                AppLocalizations.of(context)!.editorActionDescription),
            onTap: () {
              showModalBottomSheet<void>(
                  isScrollControlled: true,
                  context: context,
                  builder: (BuildContext context) {
                    return StatefulBuilder(builder:
                        (BuildContext context, StateSetter setModalState) {
                      if (step == EditorWorkflowStep.service) {
                        return SelectActionService(
                          service: action.areaService,
                          onSave: (String? selectedServiceId) async {
                            if (selectedServiceId != null) {
                              final selectedService = await services.services
                                  .getOne(selectedServiceId);
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
                              widget.onUpdate(action);
                            }
                          },
                        );
                      } else if (step == EditorWorkflowStep.event) {
                        return SelectActionEvent(
                          service: action.areaService!,
                          area: action.area,
                          onSave: (String? selectedEventId) async {
                            if (selectedEventId != null) {
                              final selectedArea = (await services.services
                                      .getServiceActions(
                                          action.areaService!.id))
                                  .data!
                                  .firstWhere((element) =>
                                      element.id == selectedEventId);
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
                                            required: param.required,
                                            values: param.values))
                                        .toList());
                              });
                              widget.onUpdate(action);
                            }
                          },
                          onBack: () {
                            setModalState(() {
                              step = EditorWorkflowStep.service;
                            });
                          },
                        );
                      } else if (step == EditorWorkflowStep.parameters) {
                        return SelectAreaParams(
                            area: action.area!,
                            onSave:
                                (List<AreaParameterWithValue> params) async {
                              setState(() {
                                action.area!.parameters = params;
                              });
                              widget.onUpdate(action);
                            },
                            onBack: () {
                              setModalState(() {
                                step = EditorWorkflowStep.event;
                              });
                            });
                      }
                      return const Text("Never displayed");
                    });
                  });
            }));
  }
}
