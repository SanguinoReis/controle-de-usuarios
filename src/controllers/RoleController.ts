import { Request, Response } from "express";
import { getCustomRepository } from "typeorm";
import RoleRepository from "../repositories/RoleRepository";
import PermissionRepository from "../repositories/PermissionRepository";

class RoleController {
    async create(request: Request, response: Response) {
        const roleRepository = getCustomRepository(RoleRepository);
        const permissionRepository = getCustomRepository(PermissionRepository);

        const { name, description, permissions } = request.body;

        const existPermission = await roleRepository.findOne({name});

        if (existPermission) {
            return response.status(400).json({error: "Função já existe!"});
        }

        const existsPermissions = await permissionRepository.findByIds(permissions);

        const role = roleRepository.create({
            name,
            description,
            permission: existsPermissions
        });

        await roleRepository.save(role);

        return response.json(role);
    }
}

export default new RoleController();