import 'dart:io';

import 'package:area_mobile/components/auth/email_field.dart';
import 'package:area_mobile/components/auth/password_field.dart';
import 'package:area_mobile/main.dart';
import 'package:area_mobile/pages/auth/register.dart';
import 'package:area_mobile/services/dio.dart';
import 'package:dio/dio.dart';
import 'package:flutter/material.dart';

class Login extends StatefulWidget {
  const Login({super.key, required this.title});

  final String title;

  @override
  State<Login> createState() => _LoginState();
}

class _LoginState extends State<Login> {
  final _formKey = GlobalKey<FormState>();
  TextEditingController emailController = TextEditingController();
  TextEditingController passwordController = TextEditingController();

  @override
  Widget build(BuildContext context) {
    return Scaffold(
        appBar: AppBar(
          title: Text(widget.title),
        ),
        body: Form(
          key: _formKey,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.center,
            children: [
              EmailField(emailController: emailController),
              PasswordField(passwordController: passwordController),
              LoginButtons(
                  formKey: _formKey,
                  emailController: emailController,
                  passwordController: passwordController)
            ],
          ),
        ));
  }
}

class LoginButtons extends StatelessWidget {
  const LoginButtons({
    super.key,
    required GlobalKey<FormState> formKey,
    required this.emailController,
    required this.passwordController,
  }) : _formKey = formKey;

  final GlobalKey<FormState> _formKey;
  final TextEditingController emailController;
  final TextEditingController passwordController;

  @override
  Widget build(BuildContext context) {
    return Row(
      mainAxisSize: MainAxisSize.max,
      mainAxisAlignment: MainAxisAlignment.spaceEvenly,
      children: [
        ElevatedButton(
            onPressed: () {
              Navigator.push(
                context,
                MaterialPageRoute(
                    builder: (context) => const Register(
                          title: 'Register',
                        )),
              );
            },
            child: const Row(
              children: [
                Icon(
                  Icons.arrow_back,
                  color: Colors.white,
                ),
                Text("Register"),
              ],
            )),
        ElevatedButton(
            onPressed: () async {
              if (_formKey.currentState!.validate()) {
                signIn(emailController.text, passwordController.text, context,
                    (response) {
                  Navigator.push(
                    context,
                    MaterialPageRoute(
                        builder: (context) => HomePage(
                              email: emailController.text,
                            )),
                  );
                }, () {
                  ScaffoldMessenger.of(context).showSnackBar(
                    const SnackBar(content: Text('Invalid Credentials')),
                  );
                });
              }
            },
            child: const Text("Submit")),
      ],
    );
  }
}

Future<void> signIn(String email, String password, BuildContext context,
    ValueChanged<Response<dynamic>> onSuccess, VoidCallback onFail) async {
  try {
    final response = await dio
        .post('/auth/login', data: {"email": email, "password": password});
    if (response.statusCode == HttpStatus.ok) {
      onSuccess.call(response);
    }
  } catch (e) {
    print(e.toString());
  }
  onFail.call();
}
