import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { ICreateUserDTO } from "../../../users/useCases/createUser/ICreateUserDTO";
import { Statement } from "../../entities/Statement";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { ICreateStatementDTO } from "../createStatement/ICreateStatementDTO";
import { GetBalanceError } from "./GetBalanceError";
import { GetBalanceUseCase } from "./GetBalanceUseCase";

let statementRepository: InMemoryStatementsRepository;
let userRepository: InMemoryUsersRepository;
let getBalanceUseCase: GetBalanceUseCase;

enum OperationType {
    DEPOSIT = 'deposit',
    WITHDRAW = 'withdraw'
}

interface IRequest {
    user_id: string;
}

interface IResponse {
    statement: Statement[];
    balance: number;
}

describe('Get Balance use case', () => {
    beforeEach(() => {
        statementRepository = new InMemoryStatementsRepository();
        userRepository = new InMemoryUsersRepository();
        getBalanceUseCase = new GetBalanceUseCase(statementRepository, userRepository);
    });

    it('should be able to get balance', async () => {
        const user: ICreateUserDTO = {
            name: 'teste',
            email: 'teste@gmail.com',
            password: 'secretpass'
        }

        const createdUser = await userRepository.create(user);

        const { id } = createdUser;

        const statement: ICreateStatementDTO = {
            user_id: id as string,
            amount: 100,
            type: OperationType.DEPOSIT,
            description: "Valor de deposito teste",
        }

        const createdStatement = await statementRepository.create(statement);

        const balance = await getBalanceUseCase.execute({ user_id: id as string });

        expect(balance).toHaveProperty('balance');
    });

    it('should not be able to get balance if user doest not exist', async () => {
        expect(async () => {
            await getBalanceUseCase.execute({ user_id: 'ef1256' });
        }).rejects.toBeInstanceOf(GetBalanceError);
    });
});