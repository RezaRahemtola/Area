import 'package:area_mobile/services/workflows/delete.dart';
import 'package:area_mobile/services/workflows/editor.dart';
import 'package:area_mobile/services/workflows/get.dart';
import 'package:area_mobile/services/workflows/patch.dart';
import 'package:area_mobile/types/services.dart';
import 'package:area_mobile/types/workflows/editor.dart';
import 'package:area_mobile/types/workflows/workflows.dart';

class WorkflowsService {
  final Future<ServiceReturn<List<Workflow>>> Function() getAll;
  final Future<ServiceReturn<Workflow>> Function(String serviceId) getOne;
  final Future<ServiceReturn<int>> Function(Workflow old, String newName)
      rename;
  final Future<ServiceReturn<int>> Function(Workflow old) delete;
  final Future<ServiceReturn<int>> Function(EditorWorkflow workflow) create;

  const WorkflowsService(
      {required this.getAll,
      required this.getOne,
      required this.rename,
      required this.delete,
      required this.create});
}

const workflowsService = WorkflowsService(
    getAll: getAll,
    getOne: getOne,
    rename: rename,
    delete: delete,
    create: create);
