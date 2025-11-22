export interface SinglePostModel {
  id: number;
  title: string;
  picUrl: string | File;
  subTitle: string;
  content: string;
  type: string;
  category: string;
  createdAt: Date;
  updatedAt: Date;
  UserId: number;
  User: Author;
  tags: string;
  Comments: Comment[];
  Likes: Like[];
}

export interface UpdatePostModel {
  id: number;
  title: string;
  picUrl: string | File;
  subTitle: string;
  content: string;
  category: string;
  tags: string;
}

export interface Author {
  id: number;
  firstName: string;
  lastName: string;
  bio: string;
  profilePic: string;
}

export interface Comment {
  id: number;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  UserId: number;
  PostId: number;
  User: Author;
}

export interface Like {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  UserId: number;
  PostId: number;
  User: Author;
}
