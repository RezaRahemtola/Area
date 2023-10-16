import 'package:area_mobile/components/auth/email_field.dart';
import 'package:area_mobile/components/auth/password_field.dart';
import 'package:area_mobile/pages/auth/register.dart';
import 'package:area_mobile/services/dio.dart';
import 'package:flutter/material.dart';

class LoginPage extends StatefulWidget {
  final Function() onSuccess;
  const LoginPage({super.key, required this.onSuccess});

  @override
  State<LoginPage> createState() => _LoginPageState();
}

class _LoginPageState extends State<LoginPage> {
  final _formKey = GlobalKey<FormState>();
  TextEditingController emailController = TextEditingController();
  TextEditingController passwordController = TextEditingController();

  @override
  Widget build(BuildContext context) {
    return Scaffold(
        body: Form(
      key: _formKey,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.center,
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          const FlutterLogo(size: 100),
          Padding(
            padding: const EdgeInsets.all(16.0),
            child: Text(
              "Welcome to AREA!",
              textAlign: TextAlign.center,
              style: Theme.of(context).textTheme.headlineSmall,
            ),
          ),
          EmailField(emailController: emailController),
          PasswordField(passwordController: passwordController),
          LoginButtons(
            formKey: _formKey,
            emailController: emailController,
            passwordController: passwordController,
            onSuccess: widget.onSuccess,
          )
        ],
      ),
    ));
  }
}

class LoginButtons extends StatelessWidget {
  final GlobalKey<FormState> _formKey;
  final TextEditingController emailController;
  final TextEditingController passwordController;
  final Function() onSuccess;

  const LoginButtons(
      {super.key,
      required GlobalKey<FormState> formKey,
      required this.emailController,
      required this.passwordController,
      required this.onSuccess})
      : _formKey = formKey;

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
                      builder: (context) => const RegisterPage()));
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
                final result = await services.auth
                    .login(emailController.text, passwordController.text);
                if (!context.mounted) {
                  return;
                }
                if (result.data != null) {
                  onSuccess();
                } else if (result.error != null) {
                  ScaffoldMessenger.of(context).showSnackBar(
                    SnackBar(content: Text(result.error!)),
                  );
                }
              }
            },
            child: const Text("Submit")),
      ],
    );
  }
}
