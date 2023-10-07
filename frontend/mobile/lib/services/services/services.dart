import 'package:area_mobile/services/dio.dart';
import 'package:area_mobile/types/services.dart';

class Workflow {
  int? id;
  String? name;
  bool? active;

  Workflow({this.id, this.name, this.active});

  Workflow.fromJson(Map<String, dynamic> json) {
    id = json['id'];
    name = json['name'];
    active = json['active'];
  }
}

Future<ServiceReturn<List<Workflow>>> getAll() async {
  try {
    final response = await dio.get<List<Workflow>>('/workflows');
    return ServiceReturn(data: response.data);
  } catch (e) {
    return ServiceReturn(error: e.toString());
  }
}

Future<ServiceReturn<Service>> getOne(String serviceId) async {
  try {
    final response = await dio.get<Service>('/services/$serviceId');
    return ServiceReturn(data: response.data);
  } catch (e) {
    return ServiceReturn(error: e.toString());
  }
}
