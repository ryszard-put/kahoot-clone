import { connect } from 'mongoose';
import { UserModel } from './models'

export const connectDB = async () => {
  await connect(`mongodb://${process.env.DB_HOST}:27017/${process.env.DB_NAME}`);
}

export const loadDB = async () => {
  // await UserModel.deleteMany({});


  // const admin = new UserModel({
  //   username: 'admin',
  //   password: 'admin'
  // });

  // await admin.save();


  // const normal = new UserModel({
  //   username: 'normal',
  //   password: 'normal'
  // })

  // await normal.save();
}