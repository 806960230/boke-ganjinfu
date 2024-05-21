import { gql } from '@apollo/client';


export const CREATE_ARTICLE = gql`
  mutation createArticle($params: ArticleInput!) {
    createArticle(params: $params) {
      code
      message
    }
  }
`;


export const COMMIT_ARTICLE = gql`
  mutation updateArticleInfo($params: ArticleInput!, $id: String) {
    updateArticleInfo(params: $params, id: $id) {
      code
      message
    }
  }
`;

export const GET_ARTICLE = gql`
  query getArticle($id: String!) {
    getArticle(id: $id){
      code
      message
      data {
        id
        title
        content
        date
      }
    }
  }
`;


export const DEL = gql`
  mutation del( $id: String!) {
    del(id:$id){
      code
      message
    }
  }
`;

export const GET_ARTICLES = gql`
  query getArticles($page: PageInput!) {
    getArticles(page: $page){
      code
      message
      data {
        id
        title
        content
        date
      },
       page {
        pageNum
        pageSize
        total
      }
    }
  }
`;