"use client";

import { useFormStatus } from "react-dom";
import { Button } from "../ui/button";
import { ReloadIcon } from "@radix-ui/react-icons";
import { SignInButton } from "@clerk/nextjs";
import { FaRegHeart, FaHeart } from "react-icons/fa";
import { LuTrash2, LuPenSquare } from "react-icons/lu";
import { UserPlus } from "lucide-react";

type btnSize = "default" | "lg" | "sm";

type SubmitButtonProps = {
  className?: string;
  text?: string;
  size?: btnSize;
  disabled?: boolean;
  closeDialog?: boolean;
};

export function SubmitButton({
  className = "",
  text = "submit",
  size = "lg",
  disabled = false,
  closeDialog = false,
}: SubmitButtonProps) {
  const { pending } = useFormStatus();

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!closeDialog) return;

    const form = e.currentTarget.form;
    if (!form?.checkValidity()) return;

    // Let the form submission complete before closing
    setTimeout(() => {
      const formState = (form as any)._formState;
      if (formState && !formState.error) {
        const closeButton = document.querySelector("[data-dialog-close]");
        if (closeButton instanceof HTMLElement) {
          closeButton.click();
        }
      }
    }, 300);
  };

  return (
    <Button
      type="submit"
      disabled={pending || disabled}
      className={`capitalize ${className}`}
      size={size}
      onClick={handleClick}
    >
      {pending ? (
        <>
          <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
          Please wait...
        </>
      ) : (
        text
      )}
    </Button>
  );
}

export const CardSignInButton = () => {
  return (
    <SignInButton mode="modal">
      <Button
        type="button"
        size="icon"
        variant="outline"
        className="cursor-pointer p-2"
        asChild
      >
        <FaRegHeart />
      </Button>
    </SignInButton>
  );
};

export const FollowButton = () => {
  return (
    <SignInButton mode="modal">
      <Button
        type="button"
        size="icon"
        variant="outline"
        className="cursor-pointer p-2"
        asChild
      >
        <UserPlus />
      </Button>
    </SignInButton>
  );
};

export const CardSubmitButton = ({ isLiked }: { isLiked: boolean }) => {
  const { pending } = useFormStatus();
  return (
    <Button
      type="submit"
      size="icon"
      variant="outline"
      className="cursor-pointer p-2"
    >
      {pending ? (
        <ReloadIcon className="animate-spin" />
      ) : isLiked ? (
        <FaHeart className="text-primary" />
      ) : (
        <FaRegHeart />
      )}
    </Button>
  );
};

type actionType = "edit" | "delete";

type IconButtonProps = {
  actionType: actionType;
  variant?:
    | "default"
    | "outline"
    | "ghost"
    | "link"
    | "destructive"
    | "secondary";
};

export const IconButton = ({
  actionType,
  variant = "link",
}: IconButtonProps) => {
  const { pending } = useFormStatus();

  const renderIcon = () => {
    switch (actionType) {
      case "edit":
        return <LuPenSquare />;
      case "delete":
        return <LuTrash2 />;
      default:
        const never: never = actionType;
        throw new Error(`Invalid action type: ${never}`);
    }
  };

  return (
    <Button
      type="submit"
      size="icon"
      variant={variant}
      className="cursor-pointer p-2"
    >
      {pending ? <ReloadIcon className="animate-spin" /> : renderIcon()}
    </Button>
  );
};

interface SelectButtonProps {
  text: string;
  onClick: () => void;
  className?: string;
}

export const SelectButton: React.FC<SelectButtonProps> = ({
  text,
  onClick,
  className = "",
}) => {
  return (
    <Button
      variant="outline"
      onClick={onClick}
      type="button"
      className={`transition-all duration-300 ${className}`}
    >
      {text}
    </Button>
  );
};

export const FollowSubmitButton = ({
  isFollowing,
}: {
  isFollowing: boolean;
}) => {
  const { pending } = useFormStatus();
  return (
    <Button
      type="submit"
      variant={isFollowing ? "outline" : "default"}
      size="sm"
      className="mt-2"
    >
      {pending ? (
        <ReloadIcon className="animate-spin" />
      ) : isFollowing ? (
        "Following"
      ) : (
        "Follow"
      )}
    </Button>
  );
};
