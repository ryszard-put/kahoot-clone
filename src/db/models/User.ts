import { Schema, Model, Types, Document, model } from 'mongoose';
import { generateSalt, hashPassword, comparePassword } from '../hashing'

interface User {
  username: String;
  password: String;
  salt: String;
  quizes: Types.ObjectId[];
}

interface UserDocument extends User, Document {
  validatePassword: (password: string) => boolean;
}

interface UserModel extends Model<UserDocument> {};

const UserSchema = new Schema<UserDocument>({
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  salt: {
    type: String,
    required: false
  },
  quizes: [{
    type: Schema.Types.ObjectId,
    ref: 'Quiz'
  }]
});

UserSchema.pre<UserDocument>('save', function(next) {
  if (this.salt) return next();
  const oldPassword = this.password;
  this.salt = generateSalt();
  this.password = hashPassword(<string>oldPassword, <string>this.salt);
  return next();
});

UserSchema.methods.validatePassword = function(password: string) {
  return comparePassword(password, this.password, this.salt);
}

const UserModel = model<UserDocument, UserModel>('User', UserSchema);

export default UserModel;