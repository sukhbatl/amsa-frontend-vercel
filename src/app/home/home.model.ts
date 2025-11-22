export interface HomeModel {
  recentArticles: ShortPostModel[];
  recentBlogs: ShortPostModel[];
  recentTuz: TUZProfileModel[];
}


export interface ShortPostModel {
  id: number;
  title: string;
  subtitle: string;
  picUrl: string;
  type: string;
  category: string;
  tags: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface TUZProfileModel {
  name: string;
  year: number;
  UserId: number;
  User: ShortUserModel;
}

export interface ShortUserModel {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  schoolName: string;
  profilePic: string;
  linkedin: string;
}
