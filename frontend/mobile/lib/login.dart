import 'package:area_mobile/Components/email_field.dart';
import 'package:area_mobile/main.dart';
import 'package:area_mobile/Components/password_field.dart';
import 'package:area_mobile/register.dart';
import 'package:dio/dio.dart';
import 'package:flutter/material.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';

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
                  print("test");
                if (await signIn(
                    emailController.text, passwordController.text)) {
                  print("validé");
                  Navigator.push(
                    context,
                    MaterialPageRoute(
                        builder: (context) => HomePage(
                              email: emailController.text,
                            )),
                  );
                } else {
                  print("pas");
                  ScaffoldMessenger.of(context).showSnackBar(
                    const SnackBar(content: Text('Invalid Credentials')),
                  );
                }
                // if (emailController.text == "azerty@qwerty" &&
                //     passwordController.text == "bepo") {
                //   // validation
                //   Navigator.push(
                //     context,
                //     MaterialPageRoute(
                //         builder: (context) => HomePage(
                //               email: emailController.text,
                //             )),
                //   );
                // } else {
                //   ScaffoldMessenger.of(context).showSnackBar(
                //     const SnackBar(content: Text('Invalid Credentials')),
                //   );
                // }
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

Future<bool> signIn(email, password) async {
  var dio = Dio();
  print('http://${dotenv.env['BACKIP']}/auth/login/');
  try {
    var response = await dio.post('http://${dotenv.env['BACKIP']}/auth/login/',
        data: {"email": email, "password": password},
        options: Options(
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
        )).timeout(const Duration(seconds: 3));
    print(response.data);
    print(response.statusCode);
    return (response.statusCode == 201);
  } catch (e) {
    print(e.toString());
  }
  return false;
}
