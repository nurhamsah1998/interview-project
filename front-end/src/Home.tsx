import axios from "axios";
import { Clock9, UserRound } from "lucide-react";
import { useEffect, useState } from "react";
import { errorMessage } from "./lib/utils";
import { useNavigate } from "react-router-dom";
import { useToast } from "./hooks/use-toast";
import { Button } from "./components/ui/button";

function Home() {
  const { toast } = useToast();
  const nav = useNavigate();
  const [isLoadingFetch, setIsLoadingFetch] = useState<boolean>(false);
  const [data, setData] = useState<
    {
      title: string;
      content: string;
      imgUrl?: string;
      createdAt: string;
      author: {
        name: string;
      };
    }[]
  >([]);
  const fetchPost = async () => {
    setIsLoadingFetch(true);
    await axios
      .get(`${import.meta.env.MINI_PROJECT_BASE_URL}/post`, {
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
              <div className="mt-1 flex gap-1 items-center">
                <UserRound size={18} className="text-slate-600" />
                <p className="text-slate-600 text-xs">{item.author.name}</p>
              </div>
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

export default Home;
