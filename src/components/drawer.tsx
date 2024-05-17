import * as React from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Button from '@mui/material/Button';
import { TextField } from '@mui/material';
import { useMutation } from '@apollo/client';
import { client } from "@/utils/apollo";
import { COMMIT_ARTICLE, CREATE_ARTICLE } from '@/graphql/article';
import { useArticle, useEditArticleInfo } from '@/services/article';
import { Form, useForm } from 'react-hook-form';


interface IProp {
    id: string;
    onClose: (refetch?: boolean) => void;
}

export default function TemporaryDrawer({ id, onClose }: IProp) {
    const [open, setOpen] = React.useState<boolean>(false);
    const { getArticle, loading } = useArticle(id);
    const [handleEdit, editLoading] = useEditArticleInfo();
    const { register, handleSubmit, watch, formState: { errors } } = useForm();
    const toggleDrawer = (newOpen: boolean) => () => {
        setOpen(newOpen);
    };
    const SubmitEvent = async (data: any) => {
        console.log('data====', data)
        handleEdit('', {
            title: data.Title,
            content: data.Content,
            date: data.Date
        }, onClose);
        toggleDrawer(false);
    }

    const DrawerList = (
        <Box sx={{ width: 800 }} role="presentation"  >
            <form onSubmit={handleSubmit(SubmitEvent)}>
                <TextField id="standard-basic" label="Title" variant="standard" className="w-90 mx-10" {...register("Title")} />
                <TextField id="standard-basic" label="Date" variant="standard" className="w-90 mx-10" {...register("Date")} />
                {/* <Divider /> */}
                <TextField
                    id="outlined-multiline-static"
                    label="Content"
                    multiline
                    rows={10}
                    className="w-90 my-20 ml-10 mr-10"
                    // defaultValue="Default Value"
                    {...register("Content")}
                />
                <div className="ml-10">
                    <Button type="submit">提交</Button>
                    <Button onClick={toggleDrawer(false)}>取消</Button>
                </div>
            </form>
        </Box>
    );

    return (
        <div>
            <Button onClick={toggleDrawer(true)} className='w-full font-bold text-xl border-2 border-dashed border-gray-400'>创建文章</Button>
            <Drawer open={open} onClose={toggleDrawer(false)}>
                {DrawerList}
            </Drawer>
        </div>
    );
}