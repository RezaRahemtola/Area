import 'package:area_mobile/components/empty_notice.dart';
import 'package:area_mobile/components/services/service_card.dart';
import 'package:area_mobile/services/dio.dart';
import 'package:area_mobile/services/services/areas.dart';
import 'package:area_mobile/types/services.dart';
import 'package:flutter/material.dart';
import 'package:flutter_gen/gen_l10n/app_localizations.dart';

class Services extends StatelessWidget {
  const Services({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
        appBar: AppBar(
            backgroundColor: Theme.of(context).colorScheme.primary,
            title: Text(AppLocalizations.of(context)!.servicesTitle),
            automaticallyImplyLeading: false),
        body: Container(
          constraints: const BoxConstraints(maxWidth: 450, maxHeight: 800),
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
                  final List<Service> services = [...?snapshot.data?.data];

                  return ListView.builder(
                    itemCount: services.length,
                    itemBuilder: (context, index) {
                      final service = services[index];
                      return ServiceCard(
                        service: service,
                        onTap: () {
                          Navigator.push(
                            context,
                            MaterialPageRoute(
                              builder: (context) =>
                                  ServiceDetails(service: service),
                            ),
                          );
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
    // Fetch actions and reactions when the widget is initialized
    fetchActionsAndReactions();
  }

  void fetchActionsAndReactions() async {
    // Fetch actions and reactions for the selected service
    final actionsResponse = await getServiceActions(widget.service.id);
    final reactionsResponse = await getServiceReactions(widget.service.id);

    setState(() {
      actions = actionsResponse.data ?? [];
      reactions = reactionsResponse.data ?? [];
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        backgroundColor: Theme.of(context).colorScheme.primary,
        title: Text(widget.service.id),
      ),
      body: Padding(
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
          title: Text(item.id),
          subtitle: Text(item.description),
          // Add more information if needed
        ));
  }
}
