import {User} from '../../user/models/user.model';
import {IUser} from '../../../lib/interface/interface';
import {AbstractRepository} from '../../../lib/db/abstract.repository';

export class AuthRepository extends AbstractRepository<IUser> {
    constructor() {
        super(User);
    }

    async findByEmail(email: string){
        return this.getOne({ email });
    }

    async checkUserExistByEmail(email: string){
        return this.getOne({ email });
    }

    async updateUserByEmail(email: string, data: Partial<IUser>){
        return this.update({ email }, data, {});
    }

    async createUser(data: IUser){
        return this.create(data);
    }
}

export default new AuthRepository();
