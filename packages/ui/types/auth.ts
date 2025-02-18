export interface ILoginBody {
  email: string;
  password: string;
}

export interface IChangePasswordBody {
  oldPassword: string;
  newPassword: string;
}
