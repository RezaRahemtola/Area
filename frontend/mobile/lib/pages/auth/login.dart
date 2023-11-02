import 'package:area_mobile/components/auth/email_field.dart';
import 'package:area_mobile/components/auth/password_field.dart';
import 'package:area_mobile/pages/auth/register.dart';
import 'package:area_mobile/services/dio.dart';
import 'package:flutter/material.dart';
import 'package:flutter_gen/gen_l10n/app_localizations.dart';

class LoginPage extends StatefulWidget {
  final Function() onSuccess;
  final Function(String theme) updateTheme;

  const LoginPage(
      {super.key, required this.onSuccess, required this.updateTheme});

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
        body: Container(
            constraints: const BoxConstraints(maxWidth: 450, maxHeight: 1000),
            color: const Color(0xFF516079),
            child: Form(
                key: _formKey,
                child: Center(
                    child: Card(
                        elevation: 8,
                        child: Container(
                          constraints: const BoxConstraints(
                              maxWidth: 400, maxHeight: 600),
                          padding: const EdgeInsets.all(32.0),
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.center,
                            mainAxisAlignment: MainAxisAlignment.center,
                            children: [
                              const Image(
                                image: AssetImage('assets/Area_logo.png'),
                                height: 150,
                                width: 150,
                              ),
                              Padding(
                                padding: const EdgeInsets.all(16.0),
                                child: Text(
                                  AppLocalizations.of(context)!.welcome,
                                  textAlign: TextAlign.center,
                                  style:
                                      Theme.of(context).textTheme.headlineSmall,
                                ),
                              ),
                              EmailField(emailController: emailController),
                              PasswordField(
                                passwordController: passwordController,
                                label: AppLocalizations.of(context)!.password,
                              ),
                              LoginButtons(
                                  formKey: _formKey,
                                  emailController: emailController,
                                  passwordController: passwordController,
                                  onSuccess: widget.onSuccess,
                                  updateTheme: widget.updateTheme)
                            ],
                          ),
                        ))))));
  }
}

class LoginButtons extends StatelessWidget {
  final GlobalKey<FormState> _formKey;
  final TextEditingController emailController;
  final TextEditingController passwordController;
  final Function() onSuccess;
  final Function(String theme) updateTheme;

  const LoginButtons(
      {super.key,
      required GlobalKey<FormState> formKey,
      required this.emailController,
      required this.passwordController,
      required this.onSuccess,
      required this.updateTheme})
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
                      builder: (context) => RegisterPage(
                            updateTheme: updateTheme,
                          )));
            },
            child: Row(
              children: [
                const Icon(
                  Icons.arrow_back,
                  color: Colors.white,
                ),
                Text(AppLocalizations.of(context)!.register),
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
            child: Text(AppLocalizations.of(context)!.login)),
      ],
    );
  }
}
