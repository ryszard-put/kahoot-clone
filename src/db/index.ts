import { connect } from 'mongoose';
import { UserModel, QuizModel } from './models'

export const connectDB = async () => {
  await connect(`mongodb://${process.env.DB_HOST}:27017/${process.env.DB_NAME}`);
}

export const loadDB = async () => {
  await QuizModel.deleteMany({});
  await UserModel.deleteMany({});


  const admin = new UserModel({
    username: 'admin',
    password: 'admin'
  });

  await admin.save();


  const math = new UserModel({
    username: 'matematyka',
    password: 'matematyka'
  });

  await math.save();


  const history = new UserModel({
    username: 'historia',
    password: 'historia'
  });

  await history.save();


  const normal1 = new UserModel({
    username: 'normal1',
    password: 'normal1'
  });

  await normal1.save();


  const normal2 = new UserModel({
    username: 'normal2',
    password: 'normal2'
  });

  await normal2.save();
}