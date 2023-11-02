import 'package:area_mobile/components/editor/steps/reaction/select_reaction_event.dart';
import 'package:area_mobile/components/editor/steps/reaction/select_reaction_service.dart';
import 'package:area_mobile/components/editor/steps/select_area_params.dart';
import 'package:area_mobile/services/dio.dart';
import 'package:area_mobile/types/workflows/editor.dart';
import 'package:flutter/material.dart';
import 'package:flutter_gen/gen_l10n/app_localizations.dart';
import 'package:flutter_svg/svg.dart';

class EditorReactionCard extends StatefulWidget {
  final EditorWorkflowReaction reaction;
  final Function(EditorWorkflowReaction updatedReaction) onUpdate;

  const EditorReactionCard(
      {super.key, required this.reaction, required this.onUpdate});

  @override
  State<EditorReactionCard> createState() => _EditorReactionCardState();
}

class _EditorReactionCardState extends State<EditorReactionCard> {
  late EditorWorkflowReaction reaction;
  EditorWorkflowStep step = EditorWorkflowStep.service;

  @override
  void initState() {
    super.initState();
    reaction = widget.reaction;
  }

  @override
  Widget build(BuildContext context) {
    return Card(
        elevation: 4,
        color: Theme.of(context).colorScheme.primary,
        child: ListTile(
          leading: reaction.areaService?.imageUrl != null
              ? SvgPicture.network(
                  reaction.areaService!.imageUrl,
                  height: 50,
                  width: 50,
                )
              : Image.asset(
                  'assets/bolt.png',
                  height: 50,
                  width: 50,
                  color: Theme.of(context).colorScheme.onPrimary,
                ),
          title: Text(reaction.areaService?.id != null
              ? AppLocalizations.of(context)!
                  .reactionService(reaction.areaService!.id)
              : AppLocalizations.of(context)!.reaction),
          subtitle: Text(reaction.area?.id ??
              AppLocalizations.of(context)!.editorReactionDescription),
          onTap: () {
            showModalBottomSheet<void>(
              isScrollControlled: true,
              context: context,
              builder: (BuildContext context) {
                return StatefulBuilder(
                    builder: (BuildContext context, StateSetter setModalState) {
                  if (step == EditorWorkflowStep.service) {
                    return SelectReactionService(
                      service: reaction.areaService,
                      onSave: (String? selectedServiceId) async {
                        if (selectedServiceId != null) {
                          final selectedService =
                              await services.services.getOne(selectedServiceId);
                          setModalState(() {
                            step = EditorWorkflowStep.event;
                          });
                          setState(() {
                            reaction.areaService = EditorWorkflowElementService(
                                id: selectedServiceId,
                                imageUrl: selectedService.data!.imageUrl);
                          });
                          widget.onUpdate(reaction);
                        }
                      },
                    );
                  } else if (step == EditorWorkflowStep.event) {
                    return SelectReactionEvent(
                      service: reaction.areaService!,
                      area: reaction.area,
                      onSave: (String? selectedEventId) async {
                        if (selectedEventId != null) {
                          final selectedArea = (await services.services
                                  .getServiceReactions(
                                      reaction.areaService!.id))
                              .data!
                              .firstWhere(
                                  (element) => element.id == selectedEventId);
                          setModalState(() {
                            step = EditorWorkflowStep.parameters;
                          });
                          setState(() {
                            reaction.area = EditorWorkflowElementArea(
                                id: selectedEventId,
                                parameters: selectedArea.parametersFormFlow
                                    .map((param) => AreaParameterWithValue(
                                        name: param.name,
                                        type: param.type,
                                        required: param.required))
                                    .toList());
                          });
                          widget.onUpdate(reaction);
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
                        area: reaction.area!,
                        onSave: (List<AreaParameterWithValue> params) async {
                          setState(() {
                            reaction.area!.parameters = params;
                          });
                          widget.onUpdate(reaction);
                        },
                        onBack: () {
                          setModalState(() {
                            step = EditorWorkflowStep.event;
                          });
                        });
                  }
                  return const Text("Never displayed");
                });
              },
            );
          },
        ));
  }
}
