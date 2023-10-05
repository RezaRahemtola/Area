import 'package:area_mobile/components/auth/email_field.dart';
import 'package:area_mobile/components/auth/password_field.dart';
import 'package:area_mobile/main.dart';
import 'package:area_mobile/pages/landing.dart';
import 'package:area_mobile/services/dio.dart';
import 'package:flutter/material.dart';

class Register extends StatefulWidget {
  const Register({super.key, required this.title});

  final String title;

  @override
  State<Register> createState() => _RegisterState();
}

class _RegisterState extends State<Register> {
  final _formKey = GlobalKey<FormState>();
  TextEditingController emailController = TextEditingController();
  TextEditingController passwordController = TextEditingController();
  TextEditingController passwordReController = TextEditingController();

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
        ));
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
    return ElevatedButton(
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
                      builder: (context) => LandingPage()),
                );
              } else if (result.error != null) {
                ScaffoldMessenger.of(context).showSnackBar(
                  SnackBar(content: Text(result.error!)),
                );
              }
            }
          } else {
            ScaffoldMessenger.of(context).showSnackBar(
              const SnackBar(content: Text("Please fill the register form.")),
            );
          }
        },
        child: const Text("Submit"));
  }
}
