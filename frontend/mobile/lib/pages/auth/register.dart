import 'package:area_mobile/components/auth/email_field.dart';
import 'package:area_mobile/components/auth/password_field.dart';
import 'package:area_mobile/pages/landing.dart';
import 'package:area_mobile/services/dio.dart';
import 'package:flutter/material.dart';

class RegisterPage extends StatefulWidget {
  const RegisterPage({super.key});

  @override
  State<RegisterPage> createState() => _RegisterPageState();
}

class _RegisterPageState extends State<RegisterPage> {
  final _formKey = GlobalKey<FormState>();
  TextEditingController emailController = TextEditingController();
  TextEditingController passwordController = TextEditingController();
  TextEditingController passwordReController = TextEditingController();

  @override
  Widget build(BuildContext context) {
    return Scaffold(
        body: Form(
            key: _formKey,
            child: Center(
                child: Card(
                    elevation: 8,
                    child: Container(
                      constraints:
                          const BoxConstraints(maxWidth: 400, maxHeight: 600),
                      padding: const EdgeInsets.all(32.0),
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
                          PasswordField(
                              passwordController: passwordReController,
                              label: "Confirm password",
                              placeholder: 'Please re-enter your password.'),
                          RegisterButton(
                              formKey: _formKey,
                              emailController: emailController,
                              passwordController: passwordController,
                              passwordReController: passwordReController)
                        ],
                      ),
                    )))));
  }
}

class RegisterButton extends StatelessWidget {
  const RegisterButton({
    super.key,
    required GlobalKey<FormState> formKey,
    required this.emailController,
    required this.passwordController,
    required this.passwordReController,
  }) : _formKey = formKey;

  final GlobalKey<FormState> _formKey;
  final TextEditingController emailController;
  final TextEditingController passwordController;
  final TextEditingController passwordReController;

  @override
  Widget build(BuildContext context) {
    return Row(
      mainAxisSize: MainAxisSize.max,
      mainAxisAlignment: MainAxisAlignment.spaceEvenly,
      children: [
        ElevatedButton(
            onPressed: () {
              Navigator.push(context,
                  MaterialPageRoute(builder: (context) => const LandingPage()));
            },
            child: const Row(
              children: [
                Icon(
                  Icons.arrow_back,
                  color: Colors.white,
                ),
                Text("Login"),
              ],
            )),
        ElevatedButton(
            onPressed: () async {
              if (_formKey.currentState!.validate()) {
                if (passwordController.text != passwordReController.text) {
                  ScaffoldMessenger.of(context).showSnackBar(
                    const SnackBar(content: Text("Passwords don't match.")),
                  );
                } else if (emailController.text.isEmpty) {
                  // actually impossible, but will insert here the email validation condition
                  ScaffoldMessenger.of(context).showSnackBar(
                    const SnackBar(content: Text("Invalid email.")),
                  );
                } else {
                  final result = await services.auth
                      .register(emailController.text, passwordController.text);
                  if (!context.mounted) return;

                  if (result.data != null) {
                    ScaffoldMessenger.of(context).showSnackBar(
                      const SnackBar(content: Text("Registered")),
                    );
                    Navigator.push(
                      context,
                      MaterialPageRoute(
                          builder: (context) => const LandingPage()),
                    );
                  } else if (result.error != null) {
                    ScaffoldMessenger.of(context).showSnackBar(
                      SnackBar(content: Text(result.error!)),
                    );
                  }
                }
              } else {
                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(
                      content: Text("Please fill the register form.")),
                );
              }
            },
            child: const Text("Submit"))
      ],
    );
  }
}
