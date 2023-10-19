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
          child: Column(children: [
            const Card(
              elevation: 8,
              child: ServiceTile(
                  serviceName: "DEBUT",
                  serviceIcon:
                      "https://img.freepik.com/vecteurs-libre/vecteur-degrade-logo-colore-oiseau_343694-1365.jpg?w=826&t=st=1697726566~exp=1697727166~hmac=1437ffdaee7c5348e5035ea99d5a5c9c0e5ecefbd83b72204bfd8c92d5bfa45e"),
            ),
            Expanded(
              // Ajoutez le widget Expanded ici
              child: Padding(
                padding: const EdgeInsets.all(16.0),
                child: FutureBuilder<ServiceReturn<List<Service>>>(
                  future: getAll(),
                  builder: (context, snapshot) {
                    if (snapshot.connectionState == ConnectionState.waiting) {
                      return const CircularProgressIndicator();
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
                            ),
                          );
                        },
                      );
                    }
                  },
                ),
              ),
            ),
            const Card(
              elevation: 8,
              child: ServiceTile(
                  serviceName: "FIN",
                  serviceIcon:
                      "https://img.freepik.com/vecteurs-libre/vecteur-degrade-logo-colore-oiseau_343694-1365.jpg?w=826&t=st=1697726566~exp=1697727166~hmac=1437ffdaee7c5348e5035ea99d5a5c9c0e5ecefbd83b72204bfd8c92d5bfa45e"),
            ),
          ]),
        ));
  }
}

class ServiceTile extends StatelessWidget {
  final String serviceName;
  final String serviceIcon;

  const ServiceTile({
    required this.serviceName,
    required this.serviceIcon,
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
      onTap: () {
        // Open modal with service Properties
      },
    );
  }
}
