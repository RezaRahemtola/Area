import 'package:area_mobile/components/auth/email_field.dart';
import 'package:area_mobile/components/auth/password_field.dart';
import 'package:area_mobile/pages/auth/register.dart';
import 'package:area_mobile/services/dio.dart';
import 'package:area_mobile/storage/index.dart';
import 'package:flutter/material.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:flutter_gen/gen_l10n/app_localizations.dart';
import 'package:webview_flutter/webview_flutter.dart';

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

  WebViewController? webviewController;
  bool authInProgress = false;
  String? oauthUrl;

  void _onOAuthLogin(String url) {
    setState(() {
      webviewController = WebViewController()
        ..setJavaScriptMode(JavaScriptMode.unrestricted)
        ..setNavigationDelegate(NavigationDelegate(
            onNavigationRequest: (NavigationRequest request) {
          if (request.url
              .startsWith('${dotenv.env['OAUTH_REDIRECTION_URL']}')) {
            final uri = Uri.dataFromString(request.url);
            if (uri.queryParameters['token'] != null) {
              storage.setAccessToken(uri.queryParameters['token']!);
              widget.onSuccess();
            }
            setState(() {
              authInProgress = false;
              oauthUrl = null;
            });
            return NavigationDecision.prevent;
          }
          return NavigationDecision.navigate;
        }))
        ..setBackgroundColor(const Color(0x00000000))
        ..loadRequest(Uri.parse(url))
        ..setUserAgent("random");
      oauthUrl = url;
      authInProgress = true;
    });
  }

  @override
  Widget build(BuildContext context) {
    return StatefulBuilder(
        builder: (BuildContext context, StateSetter setModalState) {
      return authInProgress
          ? WebViewWidget(controller: webviewController!)
          : Scaffold(
              body: Container(
                  constraints:
                      const BoxConstraints(maxWidth: 450, maxHeight: 1000),
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
                                    EmailField(
                                        emailController: emailController),
                                    PasswordField(
                                      passwordController: passwordController,
                                      label: AppLocalizations.of(context)!
                                          .password,
                                    ),
                                    LoginButtons(
                                        formKey: _formKey,
                                        emailController: emailController,
                                        passwordController: passwordController,
                                        onSuccess: widget.onSuccess,
                                        onOAuthLogin: _onOAuthLogin,
                                    updateTheme: widget.updateTheme)
                                  ],
                                ),
                              ))))));
    });
  }
}

class LoginButtons extends StatefulWidget {
  final GlobalKey<FormState> _formKey;
  final TextEditingController emailController;
  final TextEditingController passwordController;
  final Function() onSuccess;
  final Function(String url) onOAuthLogin;
  final Function(String theme) updateTheme;

  const LoginButtons(
      {super.key,
      required GlobalKey<FormState> formKey,
      required this.emailController,
      required this.passwordController,
      required this.onSuccess,
      required this.onOAuthLogin,
      required this.updateTheme})
      : _formKey = formKey;

  @override
  State<LoginButtons> createState() => _LoginButtonsState();
}

class _LoginButtonsState extends State<LoginButtons> {
  WebViewController? webviewController;

  @override
  Widget build(BuildContext context) {
    return StatefulBuilder(
        builder: (BuildContext context, StateSetter setModalState) {
      return Column(children: [
        Row(
          mainAxisSize: MainAxisSize.max,
          mainAxisAlignment: MainAxisAlignment.spaceEvenly,
          children: [
            ElevatedButton(
                onPressed: () {
                  Navigator.push(
                      context,
                      MaterialPageRoute(
                          builder: (context) => RegisterPage(updateTheme: updateTheme,)));
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
                  if (widget._formKey.currentState!.validate()) {
                    final result = await services.auth.login(
                        widget.emailController.text,
                        widget.passwordController.text);
                    if (!context.mounted) {
                      return;
                    }
                    if (result.data != null) {
                      widget.onSuccess();
                    } else if (result.error != null) {
                      ScaffoldMessenger.of(context).showSnackBar(
                        SnackBar(content: Text(result.error!)),
                      );
                    }
                  }
                },
                child: Text(AppLocalizations.of(context)!.login)),
          ],
        ),
        Row(
            mainAxisSize: MainAxisSize.max,
            mainAxisAlignment: MainAxisAlignment.spaceEvenly,
            children: [
              ElevatedButton(
                onPressed: () async {
                  final result =
                      await services.connections.authenticate("github");
                  widget.onOAuthLogin(result.data!);
                },
                child: const Text("GitHub"),
              ),
              ElevatedButton(
                onPressed: () async {
                  final result =
                      await services.connections.authenticate("google");
                  widget.onOAuthLogin(result.data!);
                },
                child: const Text("Google"),
              ),
              ElevatedButton(
                onPressed: () async {
                  final result =
                      await services.connections.authenticate("microsoft");
                  widget.onOAuthLogin(result.data!);
                },
                child: const Text("Microsoft"),
              )
            ])
      ]);
    });
  }
}
