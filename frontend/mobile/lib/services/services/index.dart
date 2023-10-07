import 'package:area_mobile/services/services/areas.dart';
import 'package:area_mobile/services/services/services.dart';
import 'package:area_mobile/types/services.dart';

class ServicesService {
  final Future<ServiceReturn<List<Workflow>>> Function() getAll;
  final Future<ServiceReturn<Service>> Function(String serviceId) getOne;

  final Future<ServiceReturn<List<Area>>> Function(String serviceId)
      getServiceActions;
  final Future<ServiceReturn<List<Area>>> Function(String serviceId)
      getServiceReactions;

  const ServicesService(
      {required this.getAll,
      required this.getOne,
      required this.getServiceActions,
      required this.getServiceReactions});
}

const servicesService = ServicesService(
    getAll: getAll,
    getOne: getOne,
    getServiceActions: getServiceActions,
    getServiceReactions: getServiceReactions);
