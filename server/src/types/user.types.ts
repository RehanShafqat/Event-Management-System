export interface IUser {
  _id?: string;
  name: string;
  email: string;
  password: string;
  role: "user" | "admin" | "organizer";
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IUserLogin {
  email: string;
  password: string;
}

export interface IUserRegister
  extends Omit<IUser, "_id" | "createdAt" | "updatedAt"> {
  confirmPassword: string;
}
