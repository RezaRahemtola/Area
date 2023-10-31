import 'package:area_mobile/colors.dart';
import 'package:area_mobile/types/services.dart';
import 'package:flutter/material.dart';
import 'package:flutter_svg/svg.dart';

class ServiceCard extends StatelessWidget {
  final Service service;
  final Function()? onTap;
  final bool selected;

  const ServiceCard(
      {Key? key, required this.service, this.onTap, this.selected = false})
      : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Card(
      elevation: 8,
      child: ListTile(
        selected: selected,
        selectedTileColor: secondaryColor,
        leading: SvgPicture.network(
          service.imageUrl,
          width: 32,
          height: 32,
        ),
        title: Text(service.id),
        onTap: onTap,
      ),
    );
  }
}
