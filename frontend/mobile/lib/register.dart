import 'package:area_mobile/login.dart';
import 'package:area_mobile/main.dart';
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
              PasswordReField(passwordController: passwordReController),
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

class PasswordReField extends StatelessWidget {
  const PasswordReField({
    super.key,
    required this.passwordController,
  });

  final TextEditingController passwordController;

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.only(left: 25, right: 25, bottom: 25),
      child: TextFormField(
        obscureText: true,
        controller: passwordController,
        decoration: const InputDecoration(
          border: OutlineInputBorder(),
          labelText: "Re-enter password",
        ),
        validator: (value) {
          if (value == null || value.isEmpty) {
            return 'Please re-enter your password.';
          }
          return null;
        },
      ),
    );
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
        onPressed: () {
          if (_formKey.currentState!.validate()) {
            if (passwordController.text != passwordReController.text) {
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(content: Text("Passwords don't match.")),
              );
            } else if (emailController.text.isEmpty) {
              // acutally impossible, but will insert here the email validation condition
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(content: Text("Invalid email.")),
              );
            } else {
              Navigator.push(
                context,
                MaterialPageRoute(
                    builder: (context) => HomePage(
                          email: emailController.text,
                        )),
              );
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
