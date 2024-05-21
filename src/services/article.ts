
import { TBaseArticle, TArticleQuery, TArticlesQuery } from '../utils/types';
import { useQuery, useMutation, useLazyQuery } from '@apollo/client';
import { COMMIT_ARTICLE, DEL, GET_ARTICLE, GET_ARTICLES } from '../graphql/article';
import { client } from '../utils/apollo';


// 返回列表文章
export const useArticles = (
    pageNum = 1,
    pageSize = 10,
) => {
    const { loading, data, refetch } = useQuery<TArticlesQuery>(GET_ARTICLES, {
        client,
        variables: {
            page: {
                pageNum,
                pageSize,
            },
        },
    });

    const refetchHandler = async (params: {
        name?: string;
        pageSize?: number;
        current?: number;
    }) => {
        const { data: res, errors } = await refetch({
            name: params.name,
            page: {
                pageNum: params.current || 1,
                pageSize: params.pageSize || 10,
            },
        });

        if (errors) {
            return {
                success: false,
            };
        }
        return {
            total: res?.getArticles.page.total,
            data: res?.getArticles.data,
            success: true,
        };
    };

    return {
        loading,
        refetch: refetchHandler,
        page: data?.getArticles.page,
        data: data?.getArticles.data,
    };
};


// 编辑文章
export const useEditArticleInfo = (): [handleEdit: Function, loading: boolean] => {
    const [edit, { loading }] = useMutation(COMMIT_ARTICLE, { client });
    const handleEdit = async (
        id: number,
        params: TBaseArticle,
        callback: (isReload: boolean) => void,
    ) => {
        const res = await edit({
            variables: {
                id,
                params,
            },
        });
        if (res.data.updateArticleInfo.code === 200) {
            callback(true);
            return res.data
        }
    };

    return [handleEdit, loading];
};


// 拿到文章详情懒加载
export const useArticle = (id: string) => {
    const [get, { loading }] = useLazyQuery(GET_ARTICLE, { client });

    const getArticle = async (id: string) => {
        const res = await get({
            variables: {
                id,
            },
        });

        return res.data.getArticle.data;
    };

    return { getArticle, loading };
};

// 拿到文章详情
export const useArticleInfo = (id: string) => {
    const { data, loading, refetch } = useQuery<TArticleQuery>(GET_ARTICLE, {
        client,
        variables: {
            id,
        },
    });

    return { data: data?.getArticle.data, loading, refetch };
};


// 删除文章
export const useDeleteArticle = (): [handleEdit: Function, loading: boolean] => {
    const [del, { loading }] = useMutation(DEL, { client });
    const delHandler = async (id: string, callback: () => void) => {
        const res = await del({
            variables: {
                id,
            },
        });
        if (res.data.del.code === 200) {
            callback();
            return;
        }
    };

    return [delHandler, loading];
};
