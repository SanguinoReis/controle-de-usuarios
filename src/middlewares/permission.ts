import { request, response } from "express";
import { Request, Response, NextFunction } from 'express';
import { decode } from "jsonwebtoken";
import { getCustomRepository } from "typeorm";
import UserRepository from "../repositories/UserRepository";
import User from "../models/User";

async function decoder(request: Request): Promise<User | undefined> {
    const authReader = request.headers.authorization || "";

    const userRepository = getCustomRepository(UserRepository);

    const [ , token] = authReader.split(" ");

    const payload = decode(token);

    const user = await userRepository.findOne(payload?.sub, {
        relations: ['roles'],
    });

    return user;
}

function is(role: String[]) {
    const roleAuthorized = async (request: Request, response: Response, next: NextFunction) => {
        const user = await decoder(request);

        const userRoles = user?.roles.map(role => role.name);

        const existsRoles = userRoles?.some(r => role.includes(r));

        if (existsRoles) {
            return next();
        }

        return response.status(401).json({message: "Usuário não autorizado!"});
    };

    return roleAuthorized;
}

export { is };