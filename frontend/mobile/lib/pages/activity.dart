import 'package:area_mobile/services/dio.dart';
import 'package:area_mobile/types/services.dart';
import 'package:area_mobile/types/user/activity.dart';
import 'package:flutter/material.dart';
import 'package:flutter_gen/gen_l10n/app_localizations.dart';

class Activities extends StatelessWidget {
  const Activities({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
        appBar: AppBar(
            backgroundColor: Theme.of(context).colorScheme.primary,
            title: Text(AppLocalizations.of(context)!.activityTitle),
            automaticallyImplyLeading: false),
        body: Padding(
            padding: const EdgeInsets.all(16.0),
            child: FutureBuilder<ServiceReturn<List<Activity>>>(
                future: services.user.getActivity(),
                builder: (context, snapshot) {
                  if (snapshot.connectionState == ConnectionState.waiting) {
                    return const Center(child: CircularProgressIndicator());
                  } else if (snapshot.hasError) {
                    return Center(
                      child: Text(AppLocalizations.of(context)!
                          .error(snapshot.error.toString())),
                    );
                  } else {
                    final List<Activity> activities = [...?snapshot.data?.data];
                    return ListView.builder(
                        itemCount: activities.length,
                        itemBuilder: (context, index) {
                          final activity = activities[index];
                          return ActivityEntry(activity: activity);
                        });
                  }
                })));
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
      leading: const CircleAvatar(
        backgroundColor: Colors.blue,
        child: Icon(
          Icons.check,
          color: Colors.white,
        ),
      ),
      title: Text(activity.workflow.name),
      subtitle: Text(activity.createdAt),
    );
  }
}
