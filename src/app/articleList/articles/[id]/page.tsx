"use client";
import Head from "next/head";
import { useArticleInfo } from "../../../../services/article";
import MarkdownRenderer from "@/components/MarkdownRenderer";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import Link from "next/link";

const Page = ({ params }: { params: { id: string } }) => {
  const { data, refetch, loading } = useArticleInfo(String(params.id));
  if (loading) {
    return <div>Loading...</div>;
  }
  if (!data) {
    return <div>获取不到文章详情，请重试...</div>;
  }

  return (
    <div>
      <Head>
        <title>{data?.title}</title>
        <meta name="description" content={data?.title} />
      </Head>
      <h1 className="text-xl justify-center text-center mt-10">
        文章标题 : {data?.title}
      </h1>
      <h1 className="text-xl justify-center text-center my-5">文章内容 : </h1>
      <div className="text-xl justify-center fixed top-20 left-0 bg-sky-600 text-red-500 text-white rounded-full w-10 h-10 text-center items-center cursor-pointer">
        <Link href="/articleList">
          <ArrowBackIosIcon className="mt-2 ml-2" />
        </Link>
      </div>
      <MarkdownRenderer content={data.content || ""} />
    </div>
  );
};

export default Page;
