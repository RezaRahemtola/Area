import 'package:area_mobile/components/empty_notice.dart';
import 'package:area_mobile/components/services/service_card.dart';
import 'package:area_mobile/components/trad.dart';
import 'package:area_mobile/services/dio.dart';
import 'package:area_mobile/services/services/areas.dart';
import 'package:area_mobile/types/services.dart';
import 'package:flutter/material.dart';
import 'package:flutter_gen/gen_l10n/app_localizations.dart';

class Services extends StatefulWidget {
  const Services({Key? key}) : super(key: key);

  @override
  State<Services> createState() => _ServicesState();
}

class _ServicesState extends State<Services> {
  Service? detailsService;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
        appBar: AppBar(
            backgroundColor: Theme.of(context).colorScheme.primary,
            title: Text(detailsService != null
                ? detailsService!.id
                : AppLocalizations.of(context)!.servicesTitle),
            leading: detailsService != null
                ? IconButton(
                    icon: const Icon(Icons.arrow_back),
                    onPressed: () async {
                      setState(() {
                        detailsService = null;
                      });
                    },
                  )
                : null,
            automaticallyImplyLeading: false),
        body: detailsService != null
            ? ServiceDetails(service: detailsService!)
            : Container(
                constraints:
                    const BoxConstraints(maxWidth: 450, maxHeight: 800),
                color: Theme.of(context).colorScheme.onSecondary,
                child: Padding(
                  padding: const EdgeInsets.all(16.0),
                  child: FutureBuilder<ServiceReturn<List<Service>>>(
                    future: services.services.getAll(),
                    builder: (context, snapshot) {
                      if (snapshot.connectionState == ConnectionState.waiting) {
                        return const Center(child: CircularProgressIndicator());
                      } else if (snapshot.hasError) {
                        return Center(
                          child: Text(AppLocalizations.of(context)!
                              .error(snapshot.error.toString())),
                        );
                      } else {
                        final List<Service> services = [
                          ...?snapshot.data?.data
                        ];

                        return ListView.builder(
                          itemCount: services.length,
                          itemBuilder: (context, index) {
                            final service = services[index];
                            return ServiceCard(
                              service: service,
                              onTap: () {
                                setState(() {
                                  detailsService = service;
                                });
                              },
                            );
                          },
                        );
                      }
                    },
                  ),
                ),
              ));
  }
}

class ServiceDetails extends StatefulWidget {
  final Service service;

  const ServiceDetails({Key? key, required this.service}) : super(key: key);

  @override
  State<ServiceDetails> createState() => _ServiceDetailsState();
}

class _ServiceDetailsState extends State<ServiceDetails> {
  List<Area> actions = [];
  List<Area> reactions = [];

  @override
  void initState() {
    super.initState();
    fetchActionsAndReactions();
  }

  void fetchActionsAndReactions() async {
    final actionsResponse = await getServiceActions(widget.service.id);
    final reactionsResponse = await getServiceReactions(widget.service.id);

    setState(() {
      actions = actionsResponse.data ?? [];
      reactions = reactionsResponse.data ?? [];
    });
  }

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.all(16.0),
      child: SingleChildScrollView(
        child: Column(
          children: [
            SectionTitle(title: AppLocalizations.of(context)!.actions),
            if (actions.isEmpty)
              EmptyNotice(message: AppLocalizations.of(context)!.noActions),
            for (var action in actions) ActionOrReactionItem(item: action),
            const SizedBox(height: 16),
            SectionTitle(title: AppLocalizations.of(context)!.reactions),
            if (reactions.isEmpty)
              EmptyNotice(message: AppLocalizations.of(context)!.noReactions),
            for (var reaction in reactions)
              ActionOrReactionItem(item: reaction),
          ],
        ),
      ),
    );
  }
}

class SectionTitle extends StatelessWidget {
  final String title;

  const SectionTitle({Key? key, required this.title}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Text(
      title,
      style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
    );
  }
}

class ActionOrReactionItem extends StatelessWidget {
  final Area item;

  const ActionOrReactionItem({Key? key, required this.item}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Card(
        elevation: 8,
        child: ListTile(
          title: Text(getAreaTrad(item.id.replaceAll("-", "_"), context) == ""
              ? item.id
              : getAreaTrad(item.id.replaceAll("-", "_"), context)),
          subtitle: Text(
              getAreaTrad("${item.id.replaceAll("-", "_")}_sub", context) == ""
                  ? item.description
                  : getAreaTrad(
                      "${item.id.replaceAll("-", "_")}_sub", context)),
          // Add more information if needed
        ));
  }
}
