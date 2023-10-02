import 'package:area_mobile/Components/email_field.dart';
import 'package:area_mobile/Components/password_re_field.dart';
import 'package:area_mobile/main.dart';
import 'package:dio/dio.dart';
import 'package:area_mobile/Components/password_field.dart';
import 'package:flutter/material.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';

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
              registerAccount(
                  emailController.text, passwordController.text, context,
                  (value) {
                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(
                      content:
                          Text("Registered")),
                );
                Navigator.push(
                  context,
                  MaterialPageRoute(
                      builder: (context) => HomePage(
                            email: emailController.text,
                          )),
                );
              }, () {
                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(
                      content:
                          Text("Invalid/Existing Email / Password too simple")),
                );
              });
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

Future<void> registerAccount(email, password, BuildContext context,
    ValueChanged<Response<dynamic>> onSuccess, VoidCallback onFail) async {
  var dio = Dio();
  try {
    var response = await dio
        .post('http://${dotenv.env['BACKIP']}/auth/register/',
            data: {"email": email, "password": password},
            options: Options(
              followRedirects: true,
              headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
              },
            ))
        .timeout(const Duration(seconds: 3));
    if (response.statusCode == 200) {
      onSuccess.call(response);
    }
  } catch (e) {
    print(e.toString());
  }
  onFail.call();
}
