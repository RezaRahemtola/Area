import 'package:area_mobile/services/workflows/actions.dart';
import 'package:area_mobile/services/workflows/editor.dart';
import 'package:area_mobile/services/workflows/get.dart';
import 'package:area_mobile/types/services.dart';
import 'package:area_mobile/types/workflows/editor.dart';
import 'package:area_mobile/types/workflows/workflows.dart';

class WorkflowsService {
  final Future<ServiceReturn<List<Workflow>>> Function() getAll;
  final Future<ServiceReturn<Workflow>> Function(String serviceId) getOne;
  final Future<ServiceReturn<int>> Function(String workflowId, String newName)
      rename;
  final Future<ServiceReturn<int>> Function(String workflowId) deleteOne;
  final Future<ServiceReturn<int>> Function(EditorWorkflow workflow) create;
  final Future<ServiceReturn<int>> Function(EditorWorkflow workflow) update;
  final Future<ServiceReturn<bool>> Function(String workflowId, bool active)
      toggleOne;

  const WorkflowsService(
      {required this.getAll,
      required this.getOne,
      required this.rename,
      required this.deleteOne,
      required this.create,
      required this.update,
      required this.toggleOne});
}

const workflowsService = WorkflowsService(
    getAll: getAll,
    getOne: getOne,
    rename: rename,
    deleteOne: deleteOne,
    create: create,
    update: update,
    toggleOne: toggleOne);
