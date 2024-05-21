export interface IArticle {
    id: string;

    title: string;

    content: string;

    date: string;

    action?: string;
}

export interface IPage {
    pageNum: number;
    pageSize: number;
    total: number;
}
export type TArticlesQuery = { [key: string]: { __typename?: 'Query', data: IArticle[], page: IPage } };

export type TArticleQuery = { [key: string]: { __typename?: 'Query', data: IArticle, page: IPage } };

export type TBaseArticle = Partial<IArticle>;