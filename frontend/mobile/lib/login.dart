import 'package:area_mobile/Components/email_field.dart';
import 'package:area_mobile/main.dart';
import 'package:area_mobile/Components/password_field.dart';
import 'package:area_mobile/register.dart';
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
            onPressed: () {
              if (_formKey.currentState!.validate()) {
                if (emailController.text == "azerty@qwerty" &&
                    passwordController.text == "bepo") {
                  // validation
                  Navigator.push(
                    context,
                    MaterialPageRoute(
                        builder: (context) => HomePage(
                              email: emailController.text,
                            )),
                  );
                } else {
                  ScaffoldMessenger.of(context).showSnackBar(
                    const SnackBar(content: Text('Invalid Credentials')),
                  );
                }
              } else {
                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(content: Text("Please fill the login form.")),
                );
              }
            },
            child: const Text("Submit")),
      ],
    );
  }
}
