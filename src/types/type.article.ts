export type ArticleCreateParamsType = {
  title: string;
  description?: string;
  avatar?: string;
  content: string;
  userId: number;
};

export type ArticleUpdateParamsType = {
  title?: string;
  description?: string;
  avatar?: string;
  content?: string;
  isDeleted?: boolean;
};
