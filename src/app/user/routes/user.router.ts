import { Router } from 'express';
import userController from '../controllers/user.controller';
import { authGuard } from '../../../lib/auth/authGuard';
import { multerUploadSingle } from '../../../lib/media/multer';

export const userRouter = Router();

userRouter.get('/me', authGuard, userController.getProfile);
userRouter.patch('/me', authGuard, userController.updateProfile);
userRouter.delete('/me', authGuard, userController.deleteAccount);
userRouter.get('/suggestions', authGuard, userController.getSuggestions);
userRouter.get('/search', authGuard, userController.searchUsers);
userRouter.post('/:id/follow', authGuard, userController.followUser);
userRouter.post('/:id/unfollow', authGuard, userController.unfollowUser);
userRouter.get('/:id/followers', authGuard, userController.getFollowers);
userRouter.get('/:id/following', authGuard, userController.getFollowing);

userRouter.post('/me/profile-picture', authGuard, multerUploadSingle('file'), userController.uploadProfilePicture);
userRouter.delete('/delete-profile-picture',userController.deleteProfilePicture);

userRouter.get('/:id', authGuard, userController.getUserProfile);





