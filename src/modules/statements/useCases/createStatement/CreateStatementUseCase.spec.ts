import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserError } from "../../../users/useCases/createUser/CreateUserError";
import { ICreateUserDTO } from "../../../users/useCases/createUser/ICreateUserDTO";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { CreateStatementController } from "./CreateStatementController";
import { CreateStatementError } from "./CreateStatementError";
import { CreateStatementUseCase } from "./CreateStatementUseCase";
import { ICreateStatementDTO } from "./ICreateStatementDTO";

let inMemoryStatementRepository: InMemoryStatementsRepository;
let inMemoryUserRepository: InMemoryUsersRepository;
let createStatementsUseCase: CreateStatementUseCase;

enum OperationType {
    DEPOSIT = 'deposit',
    WITHDRAW = 'withdraw'
}

describe('Create Statement', () => {
    beforeEach(() => {
        inMemoryStatementRepository = new InMemoryStatementsRepository();
        inMemoryUserRepository = new InMemoryUsersRepository();
        createStatementsUseCase = new CreateStatementUseCase(inMemoryUserRepository, inMemoryStatementRepository);
    });

    it('should be able to create a new statement', async () => {
        const user: ICreateUserDTO = {
            name: 'teste',
            email: 'teste@gmail.com',
            password: 'secretpass'
        }

        const createdUser = await inMemoryUserRepository.create(user);

        const statement: ICreateStatementDTO = {
            user_id: createdUser.id as string,
            amount: 100,
            type: OperationType.DEPOSIT,
            description: "Valor de deposito teste",
        }

        const createdStatement = await createStatementsUseCase.execute(statement);

        expect(createdStatement).toHaveProperty('id');
    });

    it('should not be able to create new statement if user not found', async () => {
        expect(async () => {
            const user_id_invalid = '1231xFhjCb';

            const statement: ICreateStatementDTO = {
                user_id: user_id_invalid,
                amount: 100,
                type: OperationType.WITHDRAW,
                description: "Valor de saque teste"
            }

            await createStatementsUseCase.execute(statement);
        }).rejects.toBeInstanceOf(CreateStatementError.UserNotFound);
    });


    it('should not be able create a new statement if insufficient founds', async () => {
        expect(async () => {
            const user: ICreateUserDTO = {
                name: 'teste',
                email: 'teste@gmail.com',
                password: 'secretpass'
            }
    
            const createdUser = await inMemoryUserRepository.create(user);
    
            const statement: ICreateStatementDTO = {
                user_id: createdUser.id as string,
                amount: 100,
                type: OperationType.DEPOSIT,
                description: "Valor de deposito teste",
            }
    
            await createStatementsUseCase.execute(statement);
    
            const statement2: ICreateStatementDTO = {
                user_id: createdUser.id as string,
                amount: 125,
                type: OperationType.WITHDRAW,
                description: "Valor de saque teste falha",
            }

            await createStatementsUseCase.execute(statement2);
        }).rejects.toBeInstanceOf(CreateStatementError.InsufficientFunds);
    });
});