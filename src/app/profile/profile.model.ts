import {BadgeModel} from '../badges/badges.model';
import {ShortPostModel} from '../home/home.model';

export interface ProfileModel {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  personalEmail: string;
  facebook: string;
  linkedin: string;
  instagram: string;
  acceptanceStatus: string;
  address1: string;
  address2: string;
  city: string;
  state: string;
  zipCode: string;
  phoneNumber: string;
  birthday: string;
  schoolYear: string;
  schoolState: string;
  schoolCity: string;
  degreeLevel: string;
  graduationYear: string;
  major: string;
  major2: string;
  schoolName: string;
  emailVerified: number;
  level: number;
  bio: string;
  profilePic: string;
  Badges: BadgeModel[];
  Posts: ShortPostModel[];
}

export interface UpdatedProfileModel {
  email: string;
  firstName: string;
  lastName: string;
  personalEmail: string;
  facebook: string;
  linkedin: string;
  instagram: string;
  address1: string;
  address2: string;
  city: string;
  state: string;
  zipCode: string;
  phoneNumber: string;
  birthday: string;
  schoolYear: string;
  schoolState: string;
  schoolCity: string;
  degreeLevel: string;
  graduationYear: string;
  major: string;
  major2: string;
  schoolName: string;
  bio: string;
}

export interface changeProfilePictureModel {
  message: string;
  profilePic: string;
}

// export class ImageSnippet {
//   pending = false;
//   status = 'init';
//   constructor(public src: string, public file: File) {
//   }
// }
