import { User } from "../../entities/User";
import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { IUsersRepository } from "../../repositories/IUsersRepository";
import { ICreateUserDTO } from "../createUser/ICreateUserDTO";
import { ShowUserProfileError } from "./ShowUserProfileError";
import { ShowUserProfileUseCase } from "./ShowUserProfileUseCase";

let inMemoryUsersRepository: IUsersRepository;
let showUserProfileUseCase: ShowUserProfileUseCase;

describe('Show user profile', () => {
    beforeEach(() => {
        inMemoryUsersRepository = new InMemoryUsersRepository();
        showUserProfileUseCase = new ShowUserProfileUseCase(inMemoryUsersRepository);
    });

    it('should be able to show user profile if user exits', async () => {
        const user: ICreateUserDTO = {
            name: 'Usuário teste',
            email: 'usuarioteste@gmail.com',
            password: 'senhafortedousuario'
        };

        const createdUser = await inMemoryUsersRepository.create(user);
        
        const profile = await showUserProfileUseCase.execute(createdUser.id as string);

        expect(profile).toBeInstanceOf(User);
    });

    it('should not be able to show user profile if user doest exist', async () => {
        expect(async () => {
            const user_id = '123456';

            await showUserProfileUseCase.execute(user_id);
        }).rejects.toBeInstanceOf(ShowUserProfileError);
    });
});