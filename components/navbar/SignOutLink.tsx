"use client";

import { SignOutButton } from "@clerk/nextjs";
import { useToast } from "../ui/use-toast";
import { LuLogOut } from "react-icons/lu";

const SignOutLink = () => {
  const { toast } = useToast();
  const handleLogout = () => {
    toast({
      description: "You have been signed out.",
      className: "bg-primary/90 text-secondary",
    });
  };
  return (
    <SignOutButton redirectUrl="/">
      <button className="flex w-full items-center gap-2" onClick={handleLogout}>
        <LuLogOut size={20} />
        Logout
      </button>
    </SignOutButton>
  );
};
export default SignOutLink;
