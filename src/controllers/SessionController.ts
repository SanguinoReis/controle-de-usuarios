import { Request, Response } from 'express';
import { getCustomRepository } from 'typeorm';
import UserRepository from '../repositories/UserRepository';
import { compare } from 'bcryptjs';
import { sign } from 'jsonwebtoken';

class SessionController {

    async create(request: Request, response: Response) {
        const { username, password } = request.body;

        const userRepository = getCustomRepository(UserRepository);

        const user = await userRepository.findOne({username});

        if (!user) {
            return response.status(400).json({error: "Usuário não existe!"});
        }

        const matchPassword = await compare(password, user.password);

        if (!matchPassword) {
            return response.status(400).json({error: "Usuário ou senha incorretos!"});
        }

        const token = sign({}, "8b27f87253f4d07d1190613fdaf7233c", {
            subject: user.id,
            expiresIn: '1d'
        });

        return response.json({
            token,
            user
        })
    }
}

export default new SessionController();