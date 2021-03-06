import bcrypt from 'bcrypt';
import config from 'config';
import jwt from 'jsonwebtoken';
import { UserDto } from '@/modules/auth/users/users.dto';
import HttpException from '@/shared/exceptions/HttpException';
import { DataStoredInToken, TokenData } from '@/modules/auth/auth.interface';
import { User } from '@/modules/auth/users/users.interface';
import { isEmpty } from '@/shared/utils/util';
import UserRepository from './users/users.repository';

class AuthService {
  public userRepository = new UserRepository();

  public async signup(userData: UserDto): Promise<User> {
    if (isEmpty(userData)) throw new HttpException(400, 'Error in payload');

    const user: User = await this.userRepository.findUserByEmail(
      userData.email
    );

    if (user) {
      throw new HttpException(
        409,
        `You're email ${userData.email} already exists`
      );
    }
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const createUserData: User = await this.userRepository.createUser({
      ...userData,
      password: hashedPassword,
    });

    return createUserData;
  }

  public async login(
    userData: UserDto
  ): Promise<{ cookie: string; user: User }> {
    if (isEmpty(userData)) throw new HttpException(400, 'Error in payload');

    const user: User = await this.userRepository.findUserByEmail(
      userData.email
    );

    if (!user) {
      throw new HttpException(
        409,
        `No account exists for this email: ${userData.email}`
      );
    }

    const isPassword_Matching: boolean = await bcrypt.compare(
      userData.password,
      user.password
    );

    if (!isPassword_Matching) {
      throw new HttpException(409, 'Your password is not matching');
    }

    const tokenData = this.createToken(user);
    const cookie = this.createCookie(tokenData);

    return { cookie, user };
  }

  public async logout(userData: UserDto): Promise<User> {
    if (isEmpty(userData)) throw new HttpException(400, 'Error in payload');

    const user: User = await this.userRepository.findUserByEmail(
      userData.email
    );

    if (!user) {
      throw new HttpException(409, `Email ${userData.email} not found`);
    }

    return user;
  }

  public createToken(user: User): TokenData {
    const dataStoredInToken: DataStoredInToken = { _id: user._id };
    const secret: string = config.get('secretKey');
    const expiresIn: number = 60 * 60 * 10; //10Hours

    return {
      expiresIn,
      token: jwt.sign(dataStoredInToken, secret, { expiresIn }),
    };
  }

  public createCookie(tokenData: TokenData): string {
    return `Authorization=${tokenData.token}; HttpOnly; Max-Age=${tokenData.expiresIn};`;
  }
}

export default AuthService;
