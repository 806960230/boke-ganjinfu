"use client"
import Head from 'next/head';
import { useArticleInfo } from '../../../../services/article';
import MarkdownRenderer from '@/components/MarkdownRenderer';
import Link from 'next/link';


const Page = ({ params }: { params: { id: string } }) => {

    const { data, refetch, loading } = useArticleInfo(String(params.id));
    if (loading) {
        return <div>Loading...</div>;
    }
    if (!data) {
        return <div>获取不到文章详情，请重试...</div>
    }

    return (
        <div>
            <Head>
                <title>{data?.title}</title>
                <meta name="description" content={data?.title} />
            </Head>
            <h1 className="text-xl justify-center text-center">文章标题 : {data?.title}</h1>
            <h1 className="text-xl justify-center text-center">文章内容 : </h1>
            <div className="text-xl justify-center text-center fixed top-0 left-0 bg-gray-100 text-red-500">
                <Link href="/dashboard/">
                    《点击返回
                </Link>
            </div>
            <MarkdownRenderer content={data.content || ''} />
        </div>
    );
};


// export const getStaticProps: GetStaticProps<Props, Params> = async ({ params }) => {
//     const id = params?.id;

//     // 根据 ID 获取文章数据（假设从某个数据源获取）
//     const article = {
//         id,
//         title: `Title for ${id}`,
//         content: `Content for ${id}`,
//         date: '2131231'
//     };

//     return {
//         props: {
//             article,
//         },
//     };
// };
export default Page;