import {ShortUserModel} from '../home/home.model';

export interface BadgeModel {
  id: number;
  name: string;
  description: string;
  picUrl: string;
  title: string;
}

export interface BadgeUsersModel {
  Badge: BadgeModel;
  Users: ShortUserModel[];
}
