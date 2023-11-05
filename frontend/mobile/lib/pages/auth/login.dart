import 'package:area_mobile/components/auth/email_field.dart';
import 'package:area_mobile/components/auth/password_field.dart';
import 'package:area_mobile/pages/auth/register.dart';
import 'package:area_mobile/services/dio.dart';
import 'package:area_mobile/storage/index.dart';
import 'package:area_mobile/types/services.dart';
import 'package:flutter/material.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:flutter_gen/gen_l10n/app_localizations.dart';
import 'package:flutter_svg/svg.dart';
import 'package:webview_flutter/webview_flutter.dart';

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

  WebViewController? webviewController;
  bool authInProgress = false;
  String? oauthUrl;
  bool isLogin = false;

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

  void _onAuthSwitch(bool newIsLogin) {
    setState(() {
      isLogin = newIsLogin;
    });
  }

  @override
  Widget build(BuildContext context) {
    return StatefulBuilder(
        builder: (BuildContext context, StateSetter setModalState) {
      return authInProgress
          ? Scaffold(
              appBar: AppBar(
                  title: Text(isLogin
                      ? AppLocalizations.of(context)!.login
                      : AppLocalizations.of(context)!.register),
                  leading: IconButton(
                    icon: const Icon(Icons.arrow_back),
                    onPressed: () async {
                      setState(() {
                        authInProgress = false;
                        oauthUrl = null;
                      });
                    },
                  ),
                  automaticallyImplyLeading: false),
              body: WebViewWidget(controller: webviewController!))
          : isLogin
              ? Scaffold(
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
                                      crossAxisAlignment:
                                          CrossAxisAlignment.center,
                                      mainAxisAlignment:
                                          MainAxisAlignment.center,
                                      children: [
                                        const Image(
                                          image: AssetImage('assets/logo.png'),
                                          height: 150,
                                          width: 150,
                                        ),
                                        Padding(
                                          padding: const EdgeInsets.all(16.0),
                                          child: Text(
                                            AppLocalizations.of(context)!
                                                .welcome,
                                            textAlign: TextAlign.center,
                                            style: Theme.of(context)
                                                .textTheme
                                                .headlineSmall,
                                          ),
                                        ),
                                        EmailField(
                                            emailController: emailController),
                                        PasswordField(
                                          passwordController:
                                              passwordController,
                                          label: AppLocalizations.of(context)!
                                              .password,
                                        ),
                                        LoginButtons(
                                          formKey: _formKey,
                                          emailController: emailController,
                                          passwordController:
                                              passwordController,
                                          onSuccess: widget.onSuccess,
                                          onOAuthLogin: _onOAuthLogin,
                                          onAuthSwitch: _onAuthSwitch,
                                        )
                                      ],
                                    ),
                                  ))))))
              : RegisterPage(
                  onSuccess: widget.onSuccess,
                  onAuthSwitch: _onAuthSwitch,
                  onOAuthRegister: _onOAuthLogin,
                );
    });
  }
}

class LoginButtons extends StatelessWidget {
  final GlobalKey<FormState> _formKey;
  final TextEditingController emailController;
  final TextEditingController passwordController;
  final Function() onSuccess;
  final Function(String url) onOAuthLogin;
  final Function(bool isRegister) onAuthSwitch;

  const LoginButtons(
      {super.key,
      required GlobalKey<FormState> formKey,
      required this.emailController,
      required this.passwordController,
      required this.onSuccess,
      required this.onOAuthLogin,
      required this.onAuthSwitch})
      : _formKey = formKey;

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
                  onAuthSwitch(false);
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
                              onOAuthLogin(result.data!);
                            },
                          ),
                        )
                        .toList()
                  ]);
            }
          },
        ),
      ]);
    });
  }
}
