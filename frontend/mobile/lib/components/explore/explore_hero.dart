import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import 'package:flutter_dotenv/flutter_dotenv.dart';

class ExploreHero extends StatelessWidget {
  const ExploreHero({Key? key}) : super(key: key);

  Future<List<Map<String, dynamic>>> fetchServices() async {
    final apiUrl = Uri.parse("${dotenv.env['API_URL']}/services");

    final response = await http.get(apiUrl);

    if (response.statusCode == 200) {
      final List<dynamic> data = json.decode(response.body);
      return List<Map<String, dynamic>>.from(data);
    } else {
      throw Exception('Failed to load services');
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Explore Services'),
      ),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: FutureBuilder<List<Map<String, dynamic>>>(
          future: fetchServices(),
          builder: (context, snapshot) {
            if (snapshot.connectionState == ConnectionState.waiting) {
              return const CircularProgressIndicator();
            } else if (snapshot.hasError) {
              return Text('Error: ${snapshot.error}');
            } else {
              final List<Map<String, dynamic>> services = snapshot.data ?? [];
              return ListView.builder(
                itemCount: services.length,
                itemBuilder: (context, index) {
                  final service = services[index];
                  final serviceName = service['id'];
                  final serviceImage = service['imageUrl'];

                  return Column(
                    children: <Widget>[
                      ListTile(
                        leading: Image.network(
                          serviceImage,
                          width: 40,
                          height: 40,
                          fit: BoxFit.cover,
                        ),
                        title: Text(serviceName),
                        onTap: () {},
                      ),
                      const Divider(),
                    ],
                  );
                },
              );
            }
          },
        ),
      ),
    );
  }
}
