import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { ICreateUserDTO } from "../../../users/useCases/createUser/ICreateUserDTO";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { ICreateStatementDTO } from "../createStatement/ICreateStatementDTO";
import { GetStatementOperationError } from "./GetStatementOperationError";
import { GetStatementOperationUseCase } from "./GetStatementOperationUseCase";

let inMemoryUsersRepository: InMemoryUsersRepository;
let inMemoryStatementRepository: InMemoryStatementsRepository;
let getStatementOperationUseCase: GetStatementOperationUseCase;

enum OperationType {
    DEPOSIT = 'deposit',
    WITHDRAW = 'withdraw'
}

describe('Get Statement Use Case', () => {
    beforeEach(() => {
        inMemoryUsersRepository = new InMemoryUsersRepository();
        inMemoryStatementRepository = new InMemoryStatementsRepository();
        getStatementOperationUseCase = new GetStatementOperationUseCase(inMemoryUsersRepository, inMemoryStatementRepository);
    });

    it('should be able to get an operation from statement', async () => {
        const user: ICreateUserDTO = {
            name: 'teste',
            email: 'teste@gmail.com',
            password: 'secretpass'
        }

        const createdUser = await inMemoryUsersRepository.create(user);

        const statement: ICreateStatementDTO = {
            user_id: createdUser.id as string,
            amount: 100,
            type: OperationType.DEPOSIT,
            description: "Valor de deposito teste",
        };

        const createdStatement = await inMemoryStatementRepository.create(statement);

        const result = await getStatementOperationUseCase.execute({
            user_id: createdUser.id as string,
            statement_id: createdStatement.id as string
        });

        expect(result).toHaveProperty('id');
    });

    it('should not be able to get an operation from statement when user doest exists', async () => {
        expect(async () => {
            const statement: ICreateStatementDTO = {
                user_id: '1f1f1f1f',
                amount: 100,
                type: OperationType.DEPOSIT,
                description: "Valor de deposito teste",
            };
    
            const createdStatement = await inMemoryStatementRepository.create(statement);
            
            await getStatementOperationUseCase.execute({
                user_id: '1f1f1f1',
                statement_id: createdStatement.id as string,
            });
        }).rejects.toBeInstanceOf(GetStatementOperationError.UserNotFound);
    });

    it('should not be able to get an operation if statement doest not exists', async () => {
        expect(async () => {
            const user: ICreateUserDTO = {
                name: 'teste',
                email: 'teste@gmail.com',
                password: 'secretpass'
            }
    
            const createdUser = await inMemoryUsersRepository.create(user);

            await getStatementOperationUseCase.execute({
                user_id: createdUser.id as string,
                statement_id: '1A2BCDEF3'
            });
        }).rejects.toBeInstanceOf(GetStatementOperationError.StatementNotFound);
    })
});