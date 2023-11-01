import 'package:area_mobile/components/editor/steps/reaction/select_reaction_service.dart';
import 'package:area_mobile/services/dio.dart';
import 'package:area_mobile/types/workflows/workflows.dart';
import 'package:flutter/material.dart';
import 'package:flutter_gen/gen_l10n/app_localizations.dart';
import 'package:flutter_svg/svg.dart';

class EditorReactionCard extends StatefulWidget {
  final EditorWorkflowReaction reaction;

  const EditorReactionCard({super.key, required this.reaction});

  @override
  State<EditorReactionCard> createState() => _EditorReactionCardState();
}

class _EditorReactionCardState extends State<EditorReactionCard> {
  late EditorWorkflowReaction reaction;

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
          subtitle:
              Text(AppLocalizations.of(context)!.editorReactionDescription),
          onTap: () {
            showModalBottomSheet<void>(
              context: context,
              builder: (BuildContext context) {
                return SelectReactionService(
                  onSave: (String? selectedServiceId) async {
                    if (selectedServiceId != null) {
                      final selectedService =
                          await services.services.getOne(selectedServiceId);
                      // TODO: propagate change for editor saving
                      setState(() {
                        reaction.areaService = EditorWorkflowElementService(
                            id: selectedServiceId,
                            imageUrl: selectedService.data!.imageUrl);
                      });
                    }
                  },
                );
              },
            );
          },
        ));
  }
}
