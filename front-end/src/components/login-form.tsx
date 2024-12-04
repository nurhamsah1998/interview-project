import { useNavigate } from "react-router-dom";

import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Label } from "./ui/label";
import { useState } from "react";
import axios from "axios";
import { Input } from "./ui/input";
import { useToast } from "../hooks/use-toast";
import { errorMessage } from "../lib/utils";

export function LoginForm() {
  const nav = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [form, setForm] = useState<{
    email: string;
    password: string;
  }>({
    email: "",
    password: "",
  });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleLogin = async (i: any) => {
    i?.preventDefault();
    setIsLoading(true);
    await axios
      .post(`${import.meta.env.MINI_PROJECT_BASE_URL}/auth/login`, { ...form })
      .then((res) => {
        localStorage.setItem("token", res?.data?.access_token);
        nav("/");
      })
      .catch((error) => {
        console.log(error);
        toast({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description: `${errorMessage(error)}`,
        });
      })
      .finally(() => {
        setIsLoading(false);
      });
  };
  return (
    <Card className="mx-auto max-w-sm">
      <CardHeader>
        <CardTitle className="text-2xl">Login</CardTitle>
        <CardDescription>
          Enter your email and password below to login to your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleLogin} className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              onChange={(i) =>
                setForm((prev) => ({ ...prev, email: i.target.value }))
              }
              value={form.email}
              placeholder="m@example.com"
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <div className="flex items-center gap-2">
              <Input
                onChange={(i) =>
                  setForm((prev) => ({ ...prev, password: i.target.value }))
                }
                value={form.password}
                id="password"
                type={showPassword ? "text" : "password"}
                required
              />
              <Button
                size="sm"
                type="button"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "Hide" : "Show"}
              </Button>
            </div>
          </div>
          <Button
            disabled={isLoading}
            onClick={handleLogin}
            type="submit"
            className="w-full"
          >
            Login
          </Button>
          <div className="flex justify-end">
            <Button
              onClick={() => {
                nav("/register");
              }}
              type="button"
              className=" w-fit"
            >
              Register ?
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
