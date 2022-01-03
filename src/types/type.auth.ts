export type Register = {
  email?: string;
  name?: string;
  password?: string;
  deviceId?: string;
  phone?: string;
  avatar?: number;
};

export type Login = {
  email: string;
  password: string;
};
