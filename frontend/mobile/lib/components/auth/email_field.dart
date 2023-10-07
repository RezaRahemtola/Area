import 'package:flutter/material.dart';

class EmailField extends StatelessWidget {
  const EmailField({
    super.key,
    required this.emailController,
  });

  final TextEditingController emailController;

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.all(25),
      child: TextFormField(
        controller: emailController,
        decoration: const InputDecoration(
          border: OutlineInputBorder(),
          labelText: "Email",
        ),
        validator: (value) {
          if (value == null || value.isEmpty) {
            return 'Please enter your email.';
          }
          return null;
        },
      ),
    );
  }
}
