import { NextFunction, Request, Response } from 'express';
import { AppError } from '../../../lib/error/app-error';
import userService, { UserService } from '../services/user.service';

class UserController {
    private userService: UserService;

    constructor() {
        this.userService = userService;
    }

    getProfile = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const user = await this.userService.getProfile(req.user.sub,req.user.sub);
            res.json({ success: true, data: user });
        } catch (error) {
            next(error);
        }
    };
    /*
     getUserProfile = async (req, res, next) => {
        try {
            const user = await this.userService.getProfile(req.params.id as string, req.user.sub);
            res.json({ message: 'success', success: true, data: user });
        } catch (error) { next(error); }
    };
     */
    updateProfile = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const user = await this.userService.updateProfile(req.user.sub, req.body);
            res.json({ success: true, data: user });
        } catch (error) {
            next(error);
        }
    };

    deleteAccount = async (req: Request, res: Response, next: NextFunction) => {
        try {
            await this.userService.deleteAccount(req.user.sub);
            res.json({ success: true, message: 'Account deleted' });
        } catch (error) {
            next(error);
        }
    };

    followUser = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const result = await this.userService.followUser(req.user.sub, req.params.id as string);
            res.json({ success: true, data: result });
        } catch (error) {
            next(error);
        }
    };

    unfollowUser = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const result = await this.userService.unfollowUser(req.user.sub, req.params.id as string);
            res.json({ success: true, data: result });
        } catch (error) {
            next(error);
        }
    };

    getFollowers = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const followers = await this.userService.getFollowers(req.params.id as string);
            res.json({ success: true, data: followers });
        } catch (error) {
            next(error);
        }
    };

    getFollowing = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const following = await this.userService.getFollowing(req.params.id as string);
            res.json({ success: true, data: following });
        } catch (error) {
            next(error);
        }
    };

    getSuggestions = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const users = await this.userService.getSuggestions(req.user.sub);
            res.json({ success: true, data: users });
        } catch (error) {
            next(error);
        }
    };

    searchUsers = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const query = (req.query.q as string) || (req.query.search as string) || '';
            const users = await this.userService.searchUsers(query);
            res.json({ success: true, data: users });
        } catch (error) {
            next(error);
        }
    };

    uploadProfilePicture = async (req: Request, res: Response, next: NextFunction) => {
        try {
            if (!req.file) throw new AppError('No file uploaded', 400);
            await this.userService.uploadProfilePicture(req.file, req.user.sub);
            res.json({ success: true, message: 'Profile picture uploaded' });
        } catch (error) {
            next(error);
        }
    };
}

export default new UserController();
