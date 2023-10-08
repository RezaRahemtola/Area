import 'package:area_mobile/pages/auth/login.dart';
import 'package:area_mobile/services/dio.dart';
import 'package:area_mobile/storage/index.dart';
import 'package:area_mobile/types/services.dart';
import 'package:flutter/material.dart';

class HomePage extends StatefulWidget {
  const HomePage({super.key});

  @override
  State<HomePage> createState() => _HomePageState();
}

class _HomePageState extends State<HomePage> {
  bool isLoggedIn = false;
  TextEditingController emailController = TextEditingController();
  TextEditingController passwordController = TextEditingController();

  @override
  void initState() {
    super.initState();
    _checkAuth();
  }

  void _checkAuth() async {
    final token = await storage.getAccessToken();
    setState(() {
      isLoggedIn = token != null;
    });
  }

  @override
  Widget build(BuildContext context) {
    if (!isLoggedIn) {
      return LoginPage(onSuccess: _checkAuth);
    }
    return WillPopScope(
      child: Scaffold(
          appBar: AppBar(
            title: const Text('Home Page'),
          ),
          body: const Center(child: ExistingWorkflows())),
      onWillPop: () async {
        final shouldPop = await showDialog<bool>(
          context: context,
          builder: (context) {
            return AlertDialog(
              title: const Text('Log out'),
              content: const Text('Are you sure you want to log out?'),
              actions: [
                TextButton(
                  onPressed: () {
                    Navigator.pop(context, false);
                  },
                  child: const Text('No'),
                ),
                TextButton(
                  onPressed: () async {
                    Navigator.pop(context, false);
                    await storage.removeAccessToken();
                    setState(() {
                      isLoggedIn = false;
                    });
                  },
                  child: const Text('Yes'),
                ),
              ],
            );
          },
        );
        return shouldPop!;
      },
    );
  }
}

Widget buildPosts(List<Workflow>? workflows) {
  if (workflows == null) {
    return (Text("no area"));
  }
  return ListView.builder(
    itemCount: workflows.length,
    itemBuilder: (context, index) {
      final workflow = workflows[index];
      return Container(
        color: Colors.grey.shade300,
        margin: const EdgeInsets.symmetric(vertical: 5, horizontal: 10),
        padding: const EdgeInsets.symmetric(vertical: 5, horizontal: 5),
        height: 100,
        width: double.maxFinite,
        child: Row(
          children: [
            Text(workflow.name!),
          ],
        ),
      );
    },
  );
}

class ExistingWorkflows extends StatefulWidget {
  const ExistingWorkflows({super.key});

  @override
  State<ExistingWorkflows> createState() => _ExistingWorkflowsState();
}

class _ExistingWorkflowsState extends State<ExistingWorkflows> {
  Future<ServiceReturn<List<Workflow>>> workflowsFuture =
      services.services.getAllWorkflows();
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: FutureBuilder<ServiceReturn<List<Workflow>>>(
        future: workflowsFuture,
        builder: (context, snapshot) {
          if (snapshot.connectionState == ConnectionState.waiting) {
            // until data is fetched, show loader
            return const CircularProgressIndicator();
          } else if (snapshot.hasData) {
            // once data is fetched, display it on screen (call buildPosts())
            final workflows = snapshot.data!;
            return buildPosts(workflows.data);
          } else {
            // if no data, show simple Text
            return const Text("No data available");
          }
        },
      ),
    );
  }

  Widget buildWorkflows(List<Workflow> workflows) {
    return ListView.builder(
        itemCount: workflows.length,
        itemBuilder: (context, index) {
          final workflow = workflows[index];
          return Container(
              color: Colors.grey.shade300,
              margin: EdgeInsets.symmetric(vertical: 5, horizontal: 10),
              padding: EdgeInsets.symmetric(vertical: 5, horizontal: 5),
              height: 100,
              width: double.maxFinite,
              child: Row(
                children: [
                  Expanded(flex: 3, child: Text(workflow.name!)),
                ],
              ));
        });
  }
}
