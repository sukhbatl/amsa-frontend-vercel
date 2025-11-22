import {TUZProfileModel} from '../home/home.model';

export class MembersModel {
  tuz?: {[key: string]: TUZProfileModel[]};
  sb?: TUZProfileModel[];
  current_tuz?: TUZProfileModel[];
}


