"use client";

import { SignOutButton } from "@clerk/nextjs";
import { useToast } from "../ui/use-toast";

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
      <button className="w-full text-left" onClick={handleLogout}>
        Logout
      </button>
    </SignOutButton>
  );
};
export default SignOutLink;
