import 'package:area_mobile/services/dio.dart';
import 'package:area_mobile/types/services.dart';
import 'package:area_mobile/types/user/activity.dart';
import 'package:flutter/material.dart';
import 'package:flutter_gen/gen_l10n/app_localizations.dart';

class Activities extends StatefulWidget {
  const Activities({Key? key}) : super(key: key);

  @override
  State<Activities> createState() => _ActivitiesState();
}

class _ActivitiesState extends State<Activities> {
  int page = 1;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
        appBar: AppBar(
            backgroundColor: Theme.of(context).colorScheme.primary,
            title: Text(AppLocalizations.of(context)!.activityTitle),
            automaticallyImplyLeading: false),
        body: Column(
          children: [
            Container(
              decoration: const BoxDecoration(
                  border: Border(bottom: BorderSide(color: Colors.black45))),
              child: Row(
                crossAxisAlignment: CrossAxisAlignment.center,
                children: [
                  IconButton(
                      onPressed: () => setState(() {
                            if (page > 1) {
                              page -= 1;
                            }
                          }),
                      icon: const Icon(Icons.arrow_left)),
                  Expanded(
                      child: Row(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [Text("Page $page")])),
                  IconButton(
                      onPressed: () => setState(() {
                            // TODO - protect to prevent going too far
                            page += 1;
                          }),
                      icon: const Icon(Icons.arrow_right)),
                ],
              ),
            ),
            Expanded(
              child: Padding(
                  padding: const EdgeInsets.all(16.0),
                  child: FutureBuilder<ServiceReturn<List<Activity>>>(
                      future: services.user.getActivity(page - 1),
                      builder: (context, snapshot) {
                        if (snapshot.connectionState ==
                            ConnectionState.waiting) {
                          return const Center(
                              child: CircularProgressIndicator());
                        } else if (snapshot.hasError) {
                          return Center(
                            child: Text(AppLocalizations.of(context)!
                                .error(snapshot.error.toString())),
                          );
                        } else {
                          final List<Activity> activities = [
                            ...?snapshot.data?.data
                          ];
                          return ListView.builder(
                              itemCount: activities.length,
                              itemBuilder: (context, index) {
                                final activity = activities[index];
                                return ActivityEntry(activity: activity);
                              });
                        }
                      })),
            ),
          ],
        ));
  }
}

class ActivityEntry extends StatelessWidget {
  final Activity activity;

  const ActivityEntry({
    required this.activity,
    Key? key,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return ListTile(
      leading: CircleAvatar(
        backgroundColor: Colors.blue,
        child: Icon(
          activity.type == "ran" ? Icons.check : Icons.error,
          color: Colors.white,
        ),
      ),
      title: Text((activity.type == "ran"
              ? AppLocalizations.of(context)!.ran
              : AppLocalizations.of(context)!.errorOn) +
          activity.workflow.name),
      subtitle: Text(activity.createdAt),
    );
  }
}
