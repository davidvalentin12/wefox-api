import { UserDto } from '@/modules/auth/users/users.dto';
import { User } from '@/modules/auth/users/users.interface';
import UserModel from '@/modules/auth/users/users.model';

class UserRepository {
  public users = UserModel;

  public async createUser(userData: UserDto): Promise<User> {
    const user: User = await this.users.create(userData);

    return user;
  }

  public async findUserByEmail(email: string): Promise<User> {
    const user: User = await this.users.findOne({ email: email });

    return user;
  }

  public async deleteUser(user: UserDto): Promise<void> {
    await this.users.deleteOne({ email: user.email });
  }
}

export default UserRepository;
