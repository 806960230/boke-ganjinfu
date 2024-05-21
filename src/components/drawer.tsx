import * as React from "react";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import Button from "@mui/material/Button";
import { TextField } from "@mui/material";
import { useArticleInfo, useEditArticleInfo } from "@/services/article";
import { useForm } from "react-hook-form";

interface IProp {
  id: string;
  onClose: (refetch?: boolean) => void;
}

export default function TemporaryDrawer({ id, onClose }: IProp) {
  const [open, setOpen] = React.useState<boolean>(true);
  const { data: Article, loading } = useArticleInfo(id);
  const [handleEdit, editLoading] = useEditArticleInfo();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();
  const title = watch("title");
  const date = watch("date");
  const content = watch("content");
  const toggleDrawer = (newOpen: boolean) => () => {
    // setOpen(false);
    onClose();
  };
  const SubmitEvent = async (data: any) => {
    handleEdit(
      id,
      {
        title: data.Title,
        content: data.Content,
        date: data.Date,
      },
      onClose
    );
  };

  const DrawerList = (
    <Box sx={{ width: 800 }} role="presentation">
      <form onSubmit={handleSubmit(SubmitEvent)}>
        <TextField
          id="standard-basic"
          label="Title"
          variant="standard"
          defaultValue={Article?.title}
          className="w-90 mx-10"
          {...register("Title", { required: true })}
        />
        <TextField
          id="standard-basic"
          label="Date"
          defaultValue={Article?.date}
          variant="standard"
          className="w-90 mx-10"
          {...register("Date", { required: true })}
        />
        <TextField
          id="outlined-multiline-static"
          label="Content"
          multiline
          rows={10}
          className="w-90 my-20 ml-10 mr-10"
          defaultValue={Article?.content}
          // defaultValue="Default Value"
          {...register("Content", { required: true })}
        />
        <div className="ml-10 flex justify-evenly mt-10">
          <Button variant="contained" size="medium" type="submit">
            提交
          </Button>
          <Button
            variant="contained"
            size="medium"
            onClick={toggleDrawer(false)}
          >
            取消
          </Button>
        </div>
      </form>
    </Box>
  );
  if (loading) {
    return <div>正在加载中...</div>;
  }
  return (
    <div className="flex justify-center mb-10">
      <Drawer open={open} onClose={toggleDrawer(false)}>
        {DrawerList}
      </Drawer>
    </div>
  );
}
