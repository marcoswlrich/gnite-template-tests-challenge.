import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserError } from "./CreateUserError";
import { CreateUserUseCase } from "./CreateUserUseCase";
import { ICreateUserDTO } from "./ICreateUserDTO";

let inMemoryUserRepository: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;

describe('Create user use case test suite', () => {
    beforeEach(() => {
        inMemoryUserRepository = new InMemoryUsersRepository();
        createUserUseCase = new CreateUserUseCase(inMemoryUserRepository);
    });

    it('should be able to create an user', async () => {
        const user: ICreateUserDTO = {
            name: 'Usuário Teste',
            email: 'usuarioteste@gmail.com',
            password: 'senhafortedousuario'
        }

        const createUser = await createUserUseCase.execute(user);
        
        expect(createUser).toHaveProperty('id');
    });

    it('should not be able to create an user when user exists', async () => {
        expect(async () => {
            const user: ICreateUserDTO = {
                name: 'Usuário Teste',
                email: 'usuarioteste@gmail.com',
                password: 'senhafortedousuario'
            }   

            await createUserUseCase.execute(user);

            const user1: ICreateUserDTO = {
                name: 'Usuário Teste',
                email: 'usuarioteste@gmail.com',
                password: 'senhafortedousuario'
            }

            await createUserUseCase.execute(user1);
        }).rejects.toBeInstanceOf(CreateUserError);
    });
});