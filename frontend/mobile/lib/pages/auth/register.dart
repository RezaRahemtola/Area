import 'package:area_mobile/components/auth/email_field.dart';
import 'package:area_mobile/components/auth/password_field.dart';
import 'package:area_mobile/services/dio.dart';
import 'package:area_mobile/types/services.dart';
import 'package:flutter/material.dart';
import 'package:flutter_gen/gen_l10n/app_localizations.dart';
import 'package:flutter_svg/svg.dart';

class RegisterPage extends StatefulWidget {
  final Function(String url) onOAuthRegister;
  final Function(bool isRegister) onAuthSwitch;
  final Function() onSuccess;
  final Function(String theme) updateTheme;


  const RegisterPage(
      {super.key,
      required this.onOAuthRegister,
      required this.onAuthSwitch,
      required this.onSuccess,
       required this.updateTheme});


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
                                image: AssetImage('assets/logo.png'),
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
                              PasswordField(
                                passwordController: passwordReController,
                                label: AppLocalizations.of(context)!
                                    .confirmPassword,
                              ),
                              RegisterButton(
                                formKey: _formKey,
                                emailController: emailController,
                                passwordController: passwordController,
                                passwordReController: passwordReController,
                                onOAuthRegister: widget.onOAuthRegister,
                                onSuccess: widget.onSuccess,
                                onAuthSwitch: widget.onAuthSwitch,
                              )
                            ],
                          ),
                        ))))));
  }
}

class RegisterButton extends StatelessWidget {
  final GlobalKey<FormState> _formKey;
  final TextEditingController emailController;
  final TextEditingController passwordController;
  final TextEditingController passwordReController;
  final Function(String url) onOAuthRegister;
  final Function() onSuccess;
  final Function(bool isRegister) onAuthSwitch;

  const RegisterButton(
      {super.key,
      required GlobalKey<FormState> formKey,
      required this.emailController,
      required this.passwordController,
      required this.passwordReController,
      required this.onOAuthRegister,
      required this.onSuccess,
      required this.onAuthSwitch})
      : _formKey = formKey;

  @override
  Widget build(BuildContext context) {
    return Column(children: [
      Row(
        mainAxisSize: MainAxisSize.max,
        mainAxisAlignment: MainAxisAlignment.spaceEvenly,
        children: [
          ElevatedButton(
              onPressed: () {
                onAuthSwitch(true);
              },
              child: Row(
                children: [
                  const Icon(
                    Icons.arrow_back,
                    color: Colors.white,
                  ),
                  Text(AppLocalizations.of(context)!.login),
                ],
              )),
          ElevatedButton(
              onPressed: () async {
                if (_formKey.currentState!.validate()) {
                  if (passwordController.text != passwordReController.text) {
                    ScaffoldMessenger.of(context).showSnackBar(
                      SnackBar(
                          content: Text(AppLocalizations.of(context)!
                              .passwordsNotMatching)),
                    );
                  } else if (emailController.text.isEmpty) {
                    ScaffoldMessenger.of(context).showSnackBar(
                      SnackBar(
                          content:
                              Text(AppLocalizations.of(context)!.invalidEmail)),
                    );
                  } else {
                    final result = await services.auth.register(
                        emailController.text, passwordController.text);
                    if (!context.mounted) return;

                    if (result.data != null) {
                      onSuccess();
                    } else if (result.error != null) {
                      ScaffoldMessenger.of(context).showSnackBar(
                        SnackBar(content: Text(result.error!)),
                      );
                    }
                  }
                } else {
                  ScaffoldMessenger.of(context).showSnackBar(
                    SnackBar(
                        content:
                            Text(AppLocalizations.of(context)!.pleaseFillForm)),
                  );
                }
              },
              child: Text(AppLocalizations.of(context)!.register)),
        ],
      ),
      FutureBuilder<ServiceReturn<List<Service>>>(
        future: services.services.getAll(isAuthenticator: true),
        builder: (context, snapshot) {
          if (snapshot.connectionState == ConnectionState.waiting) {
            return const Center(child: CircularProgressIndicator());
          } else if (snapshot.hasError) {
            return Center(
              child: Text(AppLocalizations.of(context)!
                  .error(snapshot.error.toString())),
            );
          } else {
            final List<Service> oAuthServices = [...?snapshot.data?.data];

            return Row(
                mainAxisSize: MainAxisSize.max,
                mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                children: [
                  ...oAuthServices
                      .map(
                        (oAuthService) => IconButton(
                          icon: SvgPicture.network(
                            oAuthService.imageUrl,
                            height: 64,
                            width: 64,
                          ),
                          onPressed: () async {
                            final result = await services.connections
                                .authenticate(oAuthService.id);
                            onOAuthRegister(result.data!);
                          },
                        ),
                      )
                      .toList()
                ]);
          }
        },
      ),
    ]);
  }
}
