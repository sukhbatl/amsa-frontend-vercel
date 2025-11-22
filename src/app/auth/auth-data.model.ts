export interface AuthRegisterModel {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  birthday: string;
  address1: string;
  address2: string;
  city: string;
  state: string;
  zipCode: string;
  phoneNumber: string;
  personalEmail: string;
  facebook: string;
  linkedin: string;
  instagram: string;
  schoolYear: string;
  degreeLevel: string;
  graduationYear: string;
  major: string;
  major2: string;
  schoolName: string;
  schoolState: string;
  schoolCity: string;
}

export interface AuthGuestRegisterModel {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  birthday: string;
}

export interface AuthLoginModel {
  email: string;
  password: string;
}

export interface AuthTokenModel {
  token: string;
  expiresIn: number;
  userId: number;
  level: number;
}
