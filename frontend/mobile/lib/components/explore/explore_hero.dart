import 'package:area_mobile/pages/editor.dart';
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
        print("tapped");
        Navigator.push(
            context,
            MaterialPageRoute(
                builder: (context) => const Editor(workflowID: 5)));
      },
    );
  }
}
