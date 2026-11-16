import {NextFunction, Request, Response} from "express";
import authService, {AuthService} from "../services/authentication.service";


class AuthController {
    private authService: AuthService;

    constructor() {
        this.authService = authService;
    }

    
    register = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const user = await this.authService.register(req.body);
            res.status(201).json({ message: 'User created, verify your email', success: true, data: user });
        } catch (error) { next(error); }
    }


    verifyAccount = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const user = await this.authService.verifyAccount(req.body);
            res.json({ message: 'Account verified', success: true, data: user });
        } catch (error) { next(error); }
    };
    
    sendOtp = async (req: Request, res: Response, next: NextFunction) => {
        try {
            await this.authService.sendOtp(req.body);
            res.json({ message: 'OTP sent', success: true });
        } catch (error) { next(error); }
    };

    login = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const result = await this.authService.login(req.body);
            if (result && 'twoStepRequired' in result) {
                return res.json({ message: 'check your email for 2-step code', success: true });
            }
            res.json({ message: 'Logged in', success: true, data: result });
        } catch (error) { next(error); }
    };

    verify2Step = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const tokens = await this.authService.verifyCodeTwoStepVerification(req.body);
            res.json({ message: 'Logged in', success: true, data: tokens });
        } catch (error) { next(error); }
    };

    resetPassword = async (req: Request, res: Response, next: NextFunction) => {
        try {
            await this.authService.resetPassword(req.body);
            res.json({ message: 'Password updated', success: true });
        } catch (error) { next(error); }
    };

    googleLogin = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const accessToken = await this.authService.loginWithCGoogle(req.body.idToken);
            res.json({ message: 'success', success: true, data: { accessToken } });
        } catch (error) { next(error); }
    };

    refreshToken = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const tokens = await this.authService.refreshTokenFn(req.body.refreshToken);
            res.json({ message: 'token refreshed', success: true, data: tokens });
        } catch (error) { next(error); }
    };



    logout = async (req: Request, res: Response, next: NextFunction) => {
        try {
            await this.authService.logout(req.user.sub);
            res.json({ message: 'Logged out', success: true });
        } catch (error) { next(error); }
    };
}

export default new AuthController();



