import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { ICreateUserDTO } from "../createUser/ICreateUserDTO";
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase";
import { IncorrectEmailOrPasswordError } from "./IncorrectEmailOrPasswordError";

let inMemoryUsersRepository: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;
let authenticateUserUseCase: AuthenticateUserUseCase;

describe('Create a new authentication', () => {
    beforeEach(() => {
        inMemoryUsersRepository = new InMemoryUsersRepository();
        createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
        authenticateUserUseCase = new AuthenticateUserUseCase(inMemoryUsersRepository);
    });

    it('should be able to authenticate an user', async () => {
        const user: ICreateUserDTO = {
            name: 'Usuário Teste',
            email: 'usuarioteste@gmail.com',
            password: '1234'
        };

        const { name, email, password } = user;

        await createUserUseCase.execute({
            name,
            email,
            password,
        });
        
        const logged = await authenticateUserUseCase.execute({
            email: user.email,
            password: user.password,
        });

        expect(logged).toHaveProperty('token');
    });

    it('should not be able to authenticate an user when password is incorrect', async () => {
        expect(async () => {
            const user: ICreateUserDTO = {
                name: 'Usuário Teste',
                email: 'usuarioteste@gmail.com',
                password: '1234'
            };
    
            const { name, email, password } = user;
    
            await createUserUseCase.execute({
                name,
                email,
                password,
            });
            
            const logged = await authenticateUserUseCase.execute({
                email: user.email,
                password: 'senha errada',
            });
        }).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError);
    });

    it('should not be able to authenticate an user when email is incorrect', async () => {
        expect(async () => {
            const user: ICreateUserDTO = {
                name: 'Usuário Teste',
                email: 'usuarioteste@gmail.com',
                password: '1234'
            };
    
            const { name, email, password } = user;
    
            await createUserUseCase.execute({
                name,
                email,
                password,
            });
            
            const logged = await authenticateUserUseCase.execute({
                email: 'emailzaoerradao@gmail.com',
                password: user.password,
            });
        }).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError);
    });
});