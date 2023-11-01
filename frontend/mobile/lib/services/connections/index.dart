import 'package:area_mobile/services/connections/connect.dart';
import 'package:area_mobile/types/services.dart';

class ConnectionsService {
  final Future<ServiceReturn<String>> Function(
      String serviceId, List<String> scopes) connect;
  const ConnectionsService({
    required this.connect,
  });
}

const connectionsService = ConnectionsService(connect: connect);
