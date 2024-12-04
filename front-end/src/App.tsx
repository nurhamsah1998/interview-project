import axios from "axios";
import { useEffect } from "react";
import { Navigate, Outlet, useNavigate } from "react-router-dom";
import { useToast } from "./hooks/use-toast";
import { errorMessage } from "./lib/utils";
import { SidebarProvider, SidebarTrigger } from "./components/ui/sidebar";
import { AppSidebar } from "./components/app-sidebar";
import { atom, useAtom } from "jotai";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const userProfile = atom<{ name: string; email: string; id: any }>({
  name: "",
  email: "",
  id: "",
});

function App() {
  const { toast } = useToast();
  const nav = useNavigate();
  const [, setProfile] = useAtom(userProfile);
  useEffect(() => {
    const fetchProfile = async () => {
      await axios
        .get(`${import.meta.env.MINI_PROJECT_BASE_URL}/profile`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        })
        .then((res) => {
          setProfile(res?.data);
        })
        .catch((error) => {
          console.log(error);
          if (
            error?.message === "Network Error" &&
            !error?.response?.data?.message
          ) {
            toast({
              variant: "destructive",
              title: "Uh oh! Something went wrong.",
              description: `Cannot connect to the server!`,
            });
            return;
          }
          if (error?.response?.data?.message === "jwt expired") {
            toast({
              variant: "destructive",
              title: "Uh oh! Something went wrong.",
              description: `${errorMessage(error)}`,
            });
            localStorage.clear();
            nav("/login");
          }
        });
    };
    fetchProfile();
  }, []);
  return localStorage.getItem("token") ? (
    <SidebarProvider>
      <AppSidebar />
      <div className="w-full">
        <SidebarTrigger />
        <div className="p-3 flex justify-center">
          <div className=" w-[90%]">
            <Outlet />
          </div>
        </div>
      </div>
    </SidebarProvider>
  ) : (
    <Navigate to="/login" replace />
  );
}

export default App;
