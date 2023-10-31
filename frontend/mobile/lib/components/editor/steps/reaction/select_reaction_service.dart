import 'package:area_mobile/services/dio.dart';
import 'package:area_mobile/types/services.dart';
import 'package:flutter/material.dart';
import 'package:flutter_gen/gen_l10n/app_localizations.dart';

class SelectReactionService extends StatefulWidget {
  const SelectReactionService({super.key});

  @override
  State<SelectReactionService> createState() => _SelectReactionServiceState();
}

class _SelectReactionServiceState extends State<SelectReactionService> {
  @override
  Widget build(BuildContext context) {
    return SizedBox(
        height: 700,
        child: Column(mainAxisSize: MainAxisSize.min, children: <Widget>[
          const SizedBox(height: 25),
          Text(AppLocalizations.of(context)!.editorChooseService,
              style: const TextStyle(fontSize: 25)),
          FutureBuilder<ServiceReturn<List<Service>>>(
            future: services.services.getAll("reactions"),
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
                  scrollDirection: Axis.vertical,
                  shrinkWrap: true,
                  itemCount: services.length,
                  itemBuilder: (context, index) {
                    final service = services[index];
                    return Text(service.id);
                  },
                );
              }
            },
          ),
        ]));
  }
}
