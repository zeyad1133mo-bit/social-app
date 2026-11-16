import userRepository, { UserRepository } from "../repositories/user.repository";
import { UpdateProfileDto } from "../dto/dto";
import { userNotExist, cannotFollowYourself, alreadyFollowing, notFollowing } from "../error";

export class UserService {
    private readonly userRepository: UserRepository = userRepository;

    // get profile
    getProfile = async (profileId: string,viewrId: string ) => {
        // 1. check user existence
        const user = await this.userRepository.findById(profileId);
        // 1.1 if not exist >> throw error
        if (!user) throw userNotExist;

        const isSelf = profileId === viewrId;
        const isFollower =  (user.following?? []).some((id) => id.toString() === viewrId);
        if(user.isPrivate && !isSelf && !isFollower){
            return {_id: user._id, userName: user.userName, isPrivate: true};
        }
        return user;

    };

    // update profile
    updateProfile = async (userId: string, data: UpdateProfileDto) => {
        // 1. update user data
        const user = await this.userRepository.updateById(userId, data);
        // 1.1 if not exist >> throw error
        if (!user) throw userNotExist;
        return user;
    };

    // delete account
    deleteAccount = async (userId: string) => {
        // 1. delete user from DB
        const user = await this.userRepository.deleteById(userId);
        // 1.1 if not exist >> throw error
        if (!user) throw userNotExist;
        return user;
    };

    // follow user
    followUser = async (followerId: string, followingId: string) => {
        // 1. check if user tries to follow himself
        if (followerId === followingId) throw cannotFollowYourself;

        // 2. check target user existence
        const targetUser = await this.userRepository.findById(followingId);
        if (!targetUser) throw userNotExist;

        // 3. check current user existence
        const me = await this.userRepository.findById(followerId);
        if (!me) throw userNotExist;

        // 4. check if already following
        const isFollowing = me.following?.some((id) => id.toString() === followingId);
        if (isFollowing) throw alreadyFollowing;

        // 5. follow user
        await this.userRepository.follow(followerId, followingId);
        return { followed: true };
    };

    // unfollow user
    unfollowUser = async (followerId: string, followingId: string) => {
        // 1. check if user tries to unfollow himself
        if (followerId === followingId) throw cannotFollowYourself;

        // 2. check target user existence
        const targetUser = await this.userRepository.findById(followingId);
        if (!targetUser) throw userNotExist;

        // 3. check current user existence
        const me = await this.userRepository.findById(followerId);
        if (!me) throw userNotExist;

        // 4. check if not following
        const isFollowing = me.following?.some((id) => id.toString() === followingId);
        if (!isFollowing) throw notFollowing;

        // 5. unfollow user
        await this.userRepository.unfollow(followerId, followingId);
        return { unfollowed: true };

    };

    // get followers
    getFollowers = async (userId: string) => {
        // 1. get user with followers
        const user = await this.userRepository.getFollowers(userId);
        // 1.1 if not exist >> throw error
        if (!user) throw userNotExist;
        return user.followers ?? [];
    };

    // get following
    getFollowing = async (userId: string) => {
        // 1. get user with following
        const user = await this.userRepository.getFollowing(userId);
        // 1.1 if not exist >> throw error
        if (!user) throw userNotExist;
        return user.following ?? [];
    };

    // get suggestions
    getSuggestions = async (userId: string) => {
        // 1. check user existence
        const user = await this.userRepository.findById(userId);
        // 1.1 if not exist >> throw error
        if (!user) throw userNotExist;
        // 2. get suggested users (not me & not already following)
        return this.userRepository.getSuggestions(userId);
    };

    // search users
    searchUsers = async (query: string) => {
        // 1. check query existence
        if (!query || !query.trim()) return [];
        // 2. search users by userName or email
        return this.userRepository.searchUsers(query.trim());
    };
}

export default new UserService();
