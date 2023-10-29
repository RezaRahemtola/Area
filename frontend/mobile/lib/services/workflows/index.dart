import 'package:area_mobile/services/workflows/get.dart';
import 'package:area_mobile/types/services.dart';
import 'package:area_mobile/types/workflows/workflows.dart';

class WorkflowsService {
  final Future<ServiceReturn<List<Workflow>>> Function() getAll;
  final Future<ServiceReturn<Workflow>> Function(String serviceId) getOne;

  const WorkflowsService({required this.getAll, required this.getOne});
}

const workflowsService = WorkflowsService(getAll: getAll, getOne: getOne);
