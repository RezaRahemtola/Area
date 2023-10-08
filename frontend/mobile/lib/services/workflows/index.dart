import 'package:area_mobile/services/workflows/get.dart';
import 'package:area_mobile/types/services.dart';

class WorkflowsService {
  // final Future<ServiceReturn<List<Service>>> Function() toggleOne;
  // final Future<ServiceReturn<List<Service>>> Function() toggleBulk;

  // final Future<ServiceReturn<List<Service>>> Function() deleteOne;
  // final Future<ServiceReturn<List<Service>>> Function() deleteBulk;

  // final Future<ServiceReturn<List<Service>>> Function() create;
  // final Future<ServiceReturn<List<Service>>> Function() update;
  // final Future<ServiceReturn<List<Service>>> Function() getOne;
  final Future<ServiceReturn<List<void>>> Function() getAll;

  const WorkflowsService(
      {
      // {required this.toggleOne,
      // required this.toggleBulk,
      // required this.deleteOne,
      // required this.deleteBulk,
      // required this.create,
      // required this.update,
      // required this.getOne,
      required this.getAll});
}

const workflowsService = WorkflowsService(
  getAll: getAll,
);
