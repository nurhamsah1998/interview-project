/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import { Clock9 } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "./hooks/use-toast";
import { errorMessage } from "./lib/utils";
import { Button } from "./components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./components/ui/dialog";
import { Label } from "./components/ui/label";
import { Input } from "./components/ui/input";
import { Textarea } from "./components/ui/textarea";
import { Switch } from "./components/ui/switch";

interface FormType {
  title: string;
  content: string;
  oldImgUrl: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  file: any;
  published: boolean;
}
function Mypost() {
  const { toast } = useToast();
  const nav = useNavigate();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isLoadingFetch, setIsLoadingFetch] = useState<boolean>(false);
  const [form, setForm] = useState<FormType>({
    title: "",
    content: "",
    oldImgUrl: "",
    file: {},
    published: false,
  });
  const [data, setData] = useState<
    { title: string; content: string; imgUrl?: string; createdAt: string }[]
  >([]);
  const fetchPost = async () => {
    setIsLoadingFetch(true);
    await axios
      .get(`${import.meta.env.MINI_PROJECT_BASE_URL}/post/my-post`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        setData(res?.data);
      })
      .catch((error) => {
        console.log(error);
        if (error?.response?.data?.message === "jwt expired") {
          toast({
            variant: "destructive",
            title: "Uh oh! Something went wrong.",
            description: `${errorMessage(error)}`,
          });
          localStorage.clear();
          nav("/login");
        }
      })
      .finally(() => {
        setIsLoadingFetch(false);
      });
  };
  useEffect(() => {
    fetchPost();
  }, []);
  const handleClickUpdate = (item: FormType & { imgUrl: string }) => {
    setForm({
      title: item.title,
      content: item.content,
      file: "",
      oldImgUrl: item.imgUrl,
      published: item.published,
    });
  };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleDelete = async (item: FormType & { id: any }) => {
    setIsLoading(true);
    await axios
      .delete(`${import.meta.env.MINI_PROJECT_BASE_URL}/post/${item?.id}`, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then(() => {
        toast({
          variant: "default",
          title: "Successfully delete post.",
        });
        setForm({
          title: "",
          content: "",
          file: {},
          published: false,
          oldImgUrl: "",
        });
        setTimeout(() => {
          (closeDialog.current as any)?.click();
        }, 100);
      })
      .catch((error) => {
        console.log(error);
        toast({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description: `${errorMessage(error) || "Internal server error"}`,
        });
      })
      .finally(() => {
        setIsLoading(false);
        fetchPost();
      });
  };
  const closeDialog = useRef(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleSubmitUpdate = async (e: any, item: FormType & { id: any }) => {
    e.preventDefault();
    setIsLoading(true);
    const formData = new FormData();
    formData.append("image", form.file);
    await axios
      .patch(
        `${import.meta.env.MINI_PROJECT_BASE_URL}/post/${item?.id}`,
        { ...form },
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      )
      .then(() => {
        toast({
          variant: "default",
          title: "Successfully update post.",
        });
        setForm({
          title: "",
          content: "",
          file: {},
          published: false,
          oldImgUrl: "",
        });
        setTimeout(() => {
          (closeDialog.current as any)?.click();
          fetchPost();
        }, 100);
      })
      .catch((error) => {
        console.log(error);
        toast({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description: `${errorMessage(error) || "Internal server error"}`,
        });
      })
      .finally(() => {
        setIsLoading(false);
      });
  };
  return (
    <div className="space-y-5">
      {isLoadingFetch ? (
        <div>
          <div className="h-20 w-full bg-slate-400 rounded-md animate-pulse" />
        </div>
      ) : data.length !== 0 ? (
        data?.map((item, index) => (
          <div
            key={index}
            className="border-2 border-slate-200 p-3 rounded-md shadow-md"
          >
            <div>
              {item.imgUrl && (
                <div>
                  <img
                    src={`${import.meta.env.MINI_PROJECT_BASE_URL}/post${
                      item.imgUrl
                    }`}
                    className="max-w-[200px]"
                    alt="img"
                  />
                </div>
              )}
              <p className=" text-2xl font-bold text-slate-700">{item.title}</p>
              <p>{item.content}</p>
              <div className="mt-4 flex gap-1 items-center">
                <Clock9 size={18} className="text-slate-600" />
                <p className="text-slate-600 text-xs">
                  {new Date(item.createdAt).toLocaleString()}
                </p>
              </div>
            </div>
            <div className="flex gap-2 mt-3">
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="bg-red-600 hover:bg-red-500">
                    Delete
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Delete Post</DialogTitle>
                  </DialogHeader>
                  <div>
                    <p>Are you sure to delete this post ?</p>
                  </div>
                  <DialogFooter>
                    <Button
                      onClick={() => handleDelete(item as any)}
                      disabled={isLoading}
                    >
                      Delete{" "}
                    </Button>
                    <DialogClose asChild>
                      <Button
                        className=" hidden"
                        ref={closeDialog}
                        disabled={isLoading}
                        type="button"
                      >
                        CLose
                      </Button>
                    </DialogClose>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    onClick={() => handleClickUpdate(item as any)}
                    className="bg-green-600 hover:bg-green-500"
                  >
                    Update
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Edit Post</DialogTitle>
                  </DialogHeader>
                  <div>
                    <form onSubmit={(e) => handleSubmitUpdate(e, item as any)}>
                      <div className="space-y-5">
                        <div>
                          <Label htmlFor="title">Title</Label>
                          <Input
                            id="title"
                            name="title"
                            placeholder="title"
                            className="mt-1"
                            onChange={(i) =>
                              setForm((prev) => ({
                                ...prev,
                                title: i.target.value,
                              }))
                            }
                            value={form.title}
                          />
                        </div>
                        <div>
                          <Label htmlFor="content">Description</Label>
                          <Textarea
                            onChange={(i) =>
                              setForm((prev) => ({
                                ...prev,
                                content: i.target.value,
                              }))
                            }
                            value={form.content}
                            id="content"
                            name="content"
                            className=" resize-none min-h-32 w-full mt-1"
                            placeholder="Type description here."
                          />
                        </div>
                        <div>
                          {item.imgUrl && (
                            <div>
                              <p>Current picture</p>
                              <div>
                                <img
                                  src={
                                    form.file && form.title
                                      ? URL.createObjectURL(form?.file)
                                      : `${
                                          import.meta.env.MINI_PROJECT_BASE_URL
                                        }/post${item.imgUrl}`
                                  }
                                  className="max-w-[200px]"
                                  alt="img"
                                />
                              </div>
                            </div>
                          )}
                          <Label htmlFor="picture">Picture</Label>
                          <Input
                            id="picture"
                            onChange={(
                              i: React.ChangeEvent<HTMLInputElement>
                            ) =>
                              setForm((prev) => ({
                                ...prev,
                                file: i.target.files ? i.target.files[0] : {},
                              }))
                            }
                            type="file"
                            accept="image/*"
                            className="mt-1 cursor-pointer"
                          />
                        </div>
                        <div className=" flex items-center gap-2">
                          <Switch
                            id="publish"
                            checked={form.published}
                            onCheckedChange={(i) =>
                              setForm((prev) => ({ ...prev, published: i }))
                            }
                          />
                          <Label htmlFor="publish">Publish ?</Label>
                        </div>
                      </div>

                      <DialogFooter>
                        <Button disabled={isLoading} type="submit">
                          Save changes
                        </Button>
                        <DialogClose asChild>
                          <Button
                            className=" hidden"
                            ref={closeDialog}
                            disabled={isLoading}
                            type="button"
                          >
                            CLose
                          </Button>
                        </DialogClose>
                      </DialogFooter>
                    </form>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        ))
      ) : (
        <div className="flex justify-center items-center flex-col gap-3">
          <p className=" text-3xl text-slate-600 font-bold">Empty post</p>
          <Button onClick={() => nav("/post")}>Tell me what happen?</Button>
        </div>
      )}
    </div>
  );
}

export default Mypost;
