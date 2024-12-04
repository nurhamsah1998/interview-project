import React from "react";
import { Button } from "./components/ui/button";
import { useNavigate } from "react-router-dom";

function NotFound() {
  const nav = useNavigate();
  return (
    <div className="flex justify-center items-center h-dvh">
      <div className="flex flex-col gap-3 justify-center">
        <h3 className=" text-3xl font-semibold text-slate-700">
          Page Not Found !
        </h3>
        <Button onClick={() => nav("/")}>Home</Button>
      </div>
    </div>
  );
}

export default NotFound;
