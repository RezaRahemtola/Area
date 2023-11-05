import 'package:area_mobile/services/connections/authenticate.dart';
import 'package:area_mobile/services/connections/connect.dart';
import 'package:area_mobile/types/services.dart';

class ConnectionsService {
  final Future<ServiceReturn<String>> Function(
      String serviceId, List<String> scopes) connect;
  final Future<ServiceReturn<String>> Function(String serviceId) authenticate;
  const ConnectionsService({required this.connect, required this.authenticate});
}

const connectionsService =
    ConnectionsService(connect: connect, authenticate: authenticate);
