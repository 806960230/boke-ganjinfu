"use client";
import * as React from "react";
import TemporaryDrawer from "@/components/drawer";
import { IArticle } from "@/utils/types";
import { useArticles } from "@/services/article";
import Table from "@/components/Table/table";
import { Row } from "@tanstack/react-table";
import SendIcon from "@mui/icons-material/Send";
import { Button } from "@mui/material";

export default function App() {
  const [pageSize, setPageSize] = React.useState<number>(10);
  const [pageNum, setPageNum] = React.useState<number>(1);
  const [show, setShow] = React.useState(false);
  const [curId, setCurId] = React.useState<string>("");
  const closeAndRefetchHandler = (isReload?: boolean) => {
    if (isReload) {
      setCurId("");
      refetch({});
    }
    setShow(false);
  };

  const { data, refetch } = useArticles(pageNum, pageSize);
  const OpenNow = () => {
    setShow(true);
    setCurId("");
  };
  const changePageContent = (row?: Row<IArticle>) => {
    if (row) {
      setCurId(row.original.id);
      setShow(true);
    } else {
      setCurId("");
      refetch({});
      setShow(false);
    }
  };

  return (
    <div className="p-2 w-full">
      <Table data={data ? data : []} refetchHandler={changePageContent}></Table>
      <Button
        className="w-full my-4"
        onClick={() => OpenNow()}
        variant="contained"
        endIcon={<SendIcon />}
      >
        创建文章
      </Button>
      {show && (
        <TemporaryDrawer
          id={curId}
          onClose={closeAndRefetchHandler}
        ></TemporaryDrawer>
      )}
    </div>
  );
}
