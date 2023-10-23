import 'package:area_mobile/services/services/areas.dart';
import 'package:area_mobile/services/services/services.dart';
import 'package:area_mobile/types/services.dart';
import 'package:flutter/material.dart';

class ExploreHero extends StatelessWidget {
  const ExploreHero({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Explore Services'),
      ),
      body: Container(
        constraints: const BoxConstraints(maxWidth: 450, maxHeight: 800),
        color: const Color(0xFFC5C6C6),
        child: Padding(
          padding: const EdgeInsets.all(16.0),
          child: FutureBuilder<ServiceReturn<List<Service>>>(
            future: getAll(),
            builder: (context, snapshot) {
              if (snapshot.connectionState == ConnectionState.waiting) {
                return const Center(child: CircularProgressIndicator());
              } else if (snapshot.hasError) {
                return Center(
                  child: Text('Error: ${snapshot.error.toString()}'),
                );
              } else {
                final List<Service> services = [...?snapshot.data?.data];

                return ListView.builder(
                  itemCount: services.length,
                  itemBuilder: (context, index) {
                    final service = services[index];
                    return Card(
                      elevation: 8,
                      child: ServiceTile(
                        serviceName: service.id,
                        serviceIcon: service.imageUrl,
                        onTap: () {
                          // Open a modal or navigate to a detailed view
                          // and pass the service ID
                          Navigator.push(
                            context,
                            MaterialPageRoute(
                              builder: (context) =>
                                  ServiceDetails(service: service),
                            ),
                          );
                        },
                      ),
                    );
                  },
                );
              }
            },
          ),
        ),
      ),
    );
  }
}

class ServiceTile extends StatelessWidget {
  final String serviceName;
  final String serviceIcon;
  final VoidCallback? onTap;

  const ServiceTile({
    required this.serviceName,
    required this.serviceIcon,
    this.onTap,
    Key? key,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return ListTile(
      leading: Image.network(
        serviceIcon,
        width: 50,
        height: 50,
      ),
      title: Text(serviceName),
      onTap: onTap,
    );
  }
}

class ServiceDetails extends StatefulWidget {
  final Service service;

  const ServiceDetails({Key? key, required this.service});

  @override
  _ServiceDetailsState createState() => _ServiceDetailsState();
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

    if (actionsResponse.data != null) {
      setState(() {
        actions = actionsResponse.data!;
      });
    }

    if (reactionsResponse.data != null) {
      setState(() {
        reactions = reactionsResponse.data!;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(widget.service.id),
      ),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          children: [
            const Text('Actions:'),
            for (var action in actions) Text(action.name),
            const SizedBox(height: 16),
            const Text('Reactions:'),
            for (var reaction in reactions) Text(reaction.name),
          ],
        ),
      ),
    );
  }
}
