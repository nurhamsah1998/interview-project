import React, { useState } from "react";
import { Input } from "./components/ui/input";
import { Textarea } from "./components/ui/textarea";
import { Label } from "./components/ui/label";
import { Button } from "./components/ui/button";
import axios from "axios";
import { useToast } from "./hooks/use-toast";
import { errorMessage } from "./lib/utils";
import { Switch } from "./components/ui/switch";

function Post() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [form, setForm] = useState<{
    title: string;
    content: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    file: any;
    published: boolean;
  }>({
    title: "",
    content: "",
    file: null,
    published: false,
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setIsLoading(true);
    const formData = new FormData();
    formData.append("image", form.file);
    await axios
      .post(`${import.meta.env.MINI_PROJECT_BASE_URL}/post`, form, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then(() => {
        toast({
          variant: "default",
          title: "Successfully created post.",
        });
        setForm({ title: "", content: "", file: null, published: false });
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
    <div>
      <form onSubmit={handleSubmit}>
        <div className="space-y-5">
          <div>
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              name="title"
              placeholder="title"
              className="mt-1"
              onChange={(i) =>
                setForm((prev) => ({ ...prev, title: i.target.value }))
              }
              value={form.title}
            />
          </div>
          <div>
            <Label htmlFor="content">Description</Label>
            <Textarea
              onChange={(i) =>
                setForm((prev) => ({ ...prev, content: i.target.value }))
              }
              value={form.content}
              id="content"
              name="content"
              className=" resize-none min-h-52 w-full mt-1"
              placeholder="Type description here."
            />
          </div>
          <div>
            {form.file && (
              <div>
                <img
                  src={URL.createObjectURL(form?.file)}
                  className="max-w-[200px]"
                  alt="img"
                />
              </div>
            )}

            <Label htmlFor="picture">Picture</Label>
            <Input
              id="picture"
              onChange={(i: React.ChangeEvent<HTMLInputElement>) =>
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
              id="published"
              checked={form.published}
              onCheckedChange={(i) =>
                setForm((prev) => ({ ...prev, published: i }))
              }
            />
            <Label htmlFor="published">Publish ?</Label>
          </div>
        </div>
        <Button disabled={isLoading} className="mt-6 w-full" type="submit">
          Post
        </Button>
      </form>
    </div>
  );
}

export default Post;
