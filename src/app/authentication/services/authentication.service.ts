import { RegisterDto, LoginDto, SendOtpDto, VerifyOtpDto, ForgotPasswordDto } from '../dto/dto';
import bcrypt from 'bcryptjs';
import userRepository, { UserRepository } from '../../user/repositories/user.repository'
import { userAlreadyExist, userNotExist, userAlreadyVerified, userNotVerified } from '../../user/error';
import { otpExpired, invalidCode, invalidPassword } from '../error';
import { hashPassword, comparePassword, generateAccessToken, generateRefreshToken } from '../utils';
import { AppError } from '../../../lib/error/app-error';
import { cacheProvider } from '../../../lib/cache/init';
import { generateOTPCode } from '../../../lib/utils/otp';
import { toSeconds } from '../../../pkg/utils/time';
import { nodemailerProvider } from '../../../lib/email/init';
import { NodeMailerProvider } from '../../../pkg/email/nodeMailer';
import { verifyGoogleToken } from '../../../lib/utils/google-auth';
import { Provider, Gender } from '../enum/enum';
import jwt from 'jsonwebtoken';
import { env } from '../../../lib/config/env';
import { TUserPayload } from '../../../lib/types/userPayload.interface';

export class AuthService {
  private twoStepVerificationKey = '2-step-verification:';
  private sendOtpKey = 'otp:';
  private readonly userRepository: UserRepository = userRepository;
  private readonly mailProvider: NodeMailerProvider;
  private refreshTokenKey = 'refresh-token:';

  private async issueTokens(user: any) {
    const payload = { sub: user._id.toString(), userName: user.userName };
    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);
    await cacheProvider.set(`${this.refreshTokenKey}${payload.sub}`, refreshToken, toSeconds(7, 'days'));
    return { accessToken, refreshToken };

  }
  constructor() {
    this.mailProvider = nodemailerProvider;
  }


  register = async (registerDto: RegisterDto) => {
    // const x = 10;
    // x = 12;//  throw Error('Assignment to constant variable');
    // 1. check user existence
    const userExist = await this.userRepository.findByEmail(registerDto.email);
    // 2. if yes, throw an error.
    if (userExist) throw userAlreadyExist;
    // 3. prepare data [hash-password]
    registerDto.password = await hashPassword(registerDto.password);
    // 4. save user into DB -> isVerified: false
    const createdUser = await this.userRepository.create(registerDto);// role: doctor
    // 5.generate and save otp into DB
    const code = generateOTPCode();

    // logger.info(code);
    // await otpRepository.createOTP({
    //   code: code,
    //   email: userData.email,
    //   expiresAt: new Date(Date.now() + toMs(5, 'minutes')),
    // });
    await cacheProvider.set(`${this.sendOtpKey}${createdUser._id.toString()}`, code, toSeconds(3, 'minutes'));
    // 6. send email verification OTP
    await this.mailProvider.sendMail(createdUser.email, 'verification code', `<h1>Your verification code is ${code} </h1>`);
    return createdUser;
  }

  verifyAccount = async (verifyAccountDto: VerifyOtpDto) => {
    // 1. check user existence
    const user = await this.userRepository.findByEmail(verifyAccountDto.email);// {} | null
    // 1.1 if you don't exist >> error "User not exist."
    if (!user) throw userNotExist;
    // 1.2 if isVerified = true >> error "You already verified"
    if (user.isVerified === true) throw userAlreadyVerified;
    // 2. check otp validation
    // const otp = await otpRepository.getOtpByEmail(email);// {code,email} | null
    const cacheCode = await cacheProvider.get(`${this.sendOtpKey}${user._id.toString()}`);
    // 2.1 not exist into DB >> error >> "otp expired" >> resend otp
    if (!cacheCode) throw otpExpired;
    // 2.2 otp stored into DB >> code not equal code stored >> error >> 'Invalid otp'
    if (cacheCode !== verifyAccountDto.code) throw invalidCode;
    // 3. Switch your isVerified to true [update user]
    const updatedUser = await this.userRepository.updateUserByEmail(verifyAccountDto.email, { isVerified: true });
    // 4. delete otp from DB
    // await otpRepository.deleteOTPsByEmail(email);
    await cacheProvider.del(`${this.sendOtpKey}${user._id.toString()}`);

    return updatedUser;
  }

  // to enable 2 step verification
  enable2StepVerification = async (email: string) => {
    const code = generateOTPCode();
    await cacheProvider.set(`${this.twoStepVerificationKey}${email}`, code, toSeconds(3, 'minutes'));
    await this.mailProvider.sendMail(email, '2 step verification code', `your 2 step verification code is ${code}`);
  }


  async verifyCodeActiveTwoStepVerification(verifyCodeActiveTwoStepVerificationDto: VerifyOtpDto) {
    const { email, code } = verifyCodeActiveTwoStepVerificationDto;
    // 1. check user existence
    const user = await this.userRepository.checkUserExistByEmail(email);// {} | null
    // 1.1 if you don't exist >> error "User not exist."
    if (!user) throw userNotExist;
    // 2. check otp validation
    // const otp = await otpRepository.getOtpByEmail(email);// {code,email} | null
    const cacheCode = await cacheProvider.get(`${this.twoStepVerificationKey}${email}`);

    // 2.1 not exist into DB >> error >> "otp expired" >> resend otp
    if (!cacheCode) throw otpExpired;
    // 2.2 otp stored into DB >> code not equal code stored >> error >> 'Invalid otp'
    if (cacheCode !== code) throw invalidCode;

    // 3. generate access Token
    await this.userRepository.updateUserByEmail(email, { twoStepVerification: true });
    // 4. delete otp from DB
    // await otpRepository.deleteOTPsByEmail(email);
    await cacheProvider.del(`${this.twoStepVerificationKey}${email}`);

  }


  login = async (loginDto: LoginDto) => {
    const { email, password } = loginDto;
    // check into cache
    const cachedAttempt = await cacheProvider.get(`${loginDto.email}:login`);
    if (cachedAttempt === '0') throw new AppError('you reach max tries', 429);
    // 1. check user existence
    const user = await this.userRepository.findByEmail(loginDto.email);// {} | null

    // 1.1 not exist
    if (!user) throw userNotExist;
    // 1.2 not verified
    if (user.isVerified === false) throw userNotVerified;
    // 2. compare password
    if (!user.password) throw invalidPassword;
    const match = await comparePassword(loginDto.password, user.password);
    if (!match) throw invalidPassword;

    if (user.twoStepVerification == true) {
      const code = generateOTPCode();
      await cacheProvider.set(`${this.twoStepVerificationKey}${loginDto.email}`, code, toSeconds(1, 'minutes'));
      await this.mailProvider.sendMail(email, '2 step verification code', `<h3>your code is ${code}</h3>`)
      return { twoStepRequired: true };
    }

    // 3. generate access Token
    const accessToken = generateAccessToken({ sub: user._id.toString(), userName: user.userName });
    const refreshToken = generateRefreshToken({ sub: user._id.toString(), userName: user.userName });

    const ttlRemaining = await cacheProvider.ttl(`${loginDto.email}:login`);
    const attempts = Number(cachedAttempt ?? 5);
    const ttl = ttlRemaining && ttlRemaining > 0 ? ttlRemaining : toSeconds(3, 'minutes');
    await cacheProvider.set(`${loginDto.email}:login`, attempts - 1, ttl);

    return this.issueTokens(user);
  }

  verifyCodeTwoStepVerification = async (verifyCodeTwoStepVerification: VerifyOtpDto) => {
    // 1. check user existence
    const { email, code } = verifyCodeTwoStepVerification;
    const user = await this.userRepository.findByEmail(verifyCodeTwoStepVerification.email);// {} | null
    // 1.1 if you don't exist >> error "User not exist."
    if (!user) throw userNotExist;
    // 2. check otp validation
    // const otp = await otpRepository.getOtpByEmail(email);// {code,email} | null

    const cacheCode = await cacheProvider.get(`${this.twoStepVerificationKey}${verifyCodeTwoStepVerification.email}`);

    // 2.1 not exist into DB >> error >> "otp expired" >> resend otp
    if (!cacheCode) throw otpExpired;
    // 2.2 otp stored into DB >> code not equal code stored >> error >> 'Invalid otp'
    if (cacheCode !== verifyCodeTwoStepVerification.code) throw invalidCode;

    // 3. generate access Token
    const accessToken = generateAccessToken({ id: user._id, name: user.userName });
    const refreshToken = generateRefreshToken({ id: user._id, name: user.userName });
    // 4. delete otp from DB
    // await otpRepository.deleteOTPsByEmail(email);
    await cacheProvider.del(`${this.twoStepVerificationKey}${verifyCodeTwoStepVerification.email}`);

    return this.issueTokens(user);
  }

  sendOtp = async (sendOtpDto: SendOtpDto) => {
    // 1. check user existence
    const { email } = sendOtpDto;
    const user = await this.userRepository.findByEmail(sendOtpDto.email);// {} | null
    if (!user) throw userNotExist;
    // 2. delete all old OTPs
    // await otpRepository.deleteOTPsByEmail(email);
    // 3. generate OTP and save it into DB
    const code = generateOTPCode();
    // await otpRepository.createOTP({
    //   code: code,
    //   email: email,
    //   expiresAt: Date.now() + toMs(3, 'minutes')
    // });
    await cacheProvider.set(`${this.sendOtpKey}${user._id.toString()}`, code, toSeconds(3, 'minutes'));
    // 4. send otp email
    await this.mailProvider.sendMail(email, 'new otp', `<p>your new otp is ${code}</p>`);
  }

  async resetPassword(resetPasswordDto: ForgotPasswordDto) {
    // get user data.
    const { email, code, newPassword } = resetPasswordDto;
    const user = await this.userRepository.findByEmail(resetPasswordDto.email);
    if (!user) throw userNotExist;
    // const otp = await otpRepository.getOtpByEmail(email);// {} | null
    const otp = await cacheProvider.get(`${this.sendOtpKey}${user._id.toString()}`);
    if (!otp) throw otpExpired;
    if (otp !== code) throw invalidCode;
    // 2. hashPassword
    const hashedPassword = await hashPassword(resetPasswordDto.newPassword);
    // 3. update user password
    await userRepository.updateUserByEmail(email, { password: hashedPassword });
    // 4. delete otp
    // await otpRepository.deleteOTPsByEmail(email);
    await cacheProvider.del(`${this.sendOtpKey}${user._id.toString()}`)
  }

  loginWithCGoogle = async (idToken: string) => {
    // 1. verify idToken >> eofnasijdbgnuvseijdfbcgvhsiejfdbjebsfduhcgijbsehfijdcbgiseodbc
    const payload = await verifyGoogleToken(idToken);
    if (!payload?.email) throw new AppError('invalid google token', 403);
    // 2. check user exists
    const user = await this.userRepository.findByEmail(payload.email);
    // 3. if exists >> generate token
    if (user) {
      return generateAccessToken({
        id: user._id,
        email: user.email,
      });
    }

    // 4. if not exist create user >> generate Token

    const createdUser = await this.userRepository.createUser({
      // _id: payload.id,
      userName: payload.name ?? payload.email,
      email: payload.email,
      password: '',
      gender: Gender.MALE,
      provider: Provider.GOOGLE,
      isVerified: true,
    }); // 30%
    return generateAccessToken({
      id: createdUser._id,
      email: createdUser.email,
    });
  }
  // logout==>
  logout = async (userId: string) => {
    await cacheProvider.del(`${this.refreshTokenKey}${userId}`);
  }


  /**
   * 
   * @param {*} token   -> refreshToken
   * @returns 
   */
  async refreshTokenFn(token: string) {
    // validate refresh-token 
    const payload = jwt.verify(token, env.jwt.refreshSecret) as TUserPayload;// throw error

    const stored = await cacheProvider.get(`${this.refreshTokenKey}${payload.sub}`);
    if (!stored || stored !== token) throw new AppError('token revoked or invalid', 401)
    await cacheProvider.del(`${this.refreshTokenKey}${payload.sub}`);
    return this.issueTokens({ _id: payload.sub, userName: payload.userName })
  }

  // zod - joi - yup - class-validator

  // let userName;
  // userName.string().min(8).max(20).trim().lowercase().required();
  // let userName;

  // if (typeof userName !== 'string') throw new AppError('userName must be string', 400);
  // if (userName.length < 8 || userName.length > 20) throw new AppError('userName must be at least 8 characters',400);




}
export default new AuthService();
/*
function hashPassword(password: any): any {
    throw new Error('Function not implemented.');
}
*/
