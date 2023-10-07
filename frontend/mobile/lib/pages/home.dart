    print("coucou");
import 'dart:ffi';

import 'package:area_mobile/pages/auth/login.dart';
import 'package:area_mobile/services/dio.dart';
import 'package:area_mobile/storage/index.dart';
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
          body: const Center(
            child: Column(
              children: [
                Text("Welcome!"),
                ExistingWorkflows(),
              ],
            ),
          )),
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

class ExistingWorkflows extends StatelessWidget {
  const ExistingWorkflows({
    super.key,
  });

  @override
  Widget build(BuildContext context) {
    print(await services.services.getAll());
    return const Column(
      children: [
        Text("test"),
        Text("test"),
        Text("test"),
        Text("test"),
        Text("test"),
      ],
    );
  }
}
