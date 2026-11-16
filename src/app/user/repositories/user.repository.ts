import { User } from '../models/user.model';
import { IUser } from '../../../lib/interface/interface';
import { AbstractRepository } from '../../../lib/db/abstract.repository';
import { UserDocument } from '../models/user.model';


export class UserRepository extends AbstractRepository<IUser> {

    constructor() {
        super(User);
    }

    async findByEmail(email: string): Promise<UserDocument | null> {
        return User.findOne({ email: email });
    }

    async checkUserExistByEmail(email: string) {
        return this.getOne({ email });
    }

    async updateUserByEmail(email: string, data: Partial<IUser>) {

        return this.update({ email }, data, {});
    }

    async createUser(data: IUser) {
        return this.create(data);
    }
    async findById(userId: string): Promise<UserDocument | null> {
        return User.findById(userId);
    }
    async updateById(UserId: string, data: Partial<IUser>): Promise<UserDocument | null> {
        return User.findByIdAndUpdate(UserId, data, { new: true })
    }
    async deleteById(userId: string): Promise<UserDocument | null> {
        return User.findByIdAndDelete(userId);
    }
    async follow(followerId: string, followingId: string) {
        await User.findByIdAndUpdate(followerId, { $addToSet: { following: followingId } });
        await User.findByIdAndUpdate(followingId, { $addToSet: { followers: followerId } })
    }
    async unfollow(followerId: string, followingId: string) {
        await User.findByIdAndUpdate(followerId, { $pull: { following: followingId } });
        await User.findByIdAndUpdate(followingId, { $pull: { followers: followerId } })
    }
    async getFollowers(userId: string) {
        return User.findById(userId).populate(
            'followers', 'userName email'
        );
    }
    async getFollowing(userId: string) {
        return User.findById(userId).populate(
            'following', 'userName email'
        );
    }
    async getSuggestions(userId: string) {
        const me = await User.findById(userId).select('following');
        const excludeIds = [userId, ...(me?.following?.map((id) => id.toString()) || [])];
        return User.find({ _id: { $nin: excludeIds } }).select('userName email');
    }

    async searchUsers(query: string) {
        return User.find({
            $or: [
                { userName: { $regex: query, $options: 'i' } },
                { email: { $regex: query, $options: 'i' } },
            ],
        }).select('userName email');
    }

}


export default new UserRepository();