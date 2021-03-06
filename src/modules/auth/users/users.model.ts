import { model, Schema, Document } from 'mongoose';
import { User } from '@/modules/auth/users/users.interface';

const userSchema: Schema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
});

const UserModel = model<User & Document>('User', userSchema);

export default UserModel;
