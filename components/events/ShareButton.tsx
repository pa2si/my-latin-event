"use client";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "../ui/button";
import { LuCopy, LuShare2 } from "react-icons/lu";

import {
  TwitterShareButton,
  EmailShareButton,
  LinkedinShareButton,
  TwitterIcon,
  EmailIcon,
  LinkedinIcon,
  FacebookIcon,
  FacebookShareButton,
} from "react-share";
import { useToast } from "@/components/ui/use-toast";

function ShareButton({ eventId, name }: { eventId: string; name: string }) {
  const url = process.env.NEXT_PUBLIC_APP_URL;
  const shareLink = `${url}/events/${eventId}`;
  const { toast } = useToast();

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareLink);
      toast({
        description: "Link copied to clipboard",
        className: "bg-primary/90 text-secondary",
        duration: 2000,
      });
    } catch (err) {
      toast({
        variant: "destructive",
        description: "Failed to copy link",
        className: "bg-primary/90 text-secondary",
      });
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="icon" className="p-2">
          <LuShare2 />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        side="top"
        align="end"
        sideOffset={10}
        className="flex w-full items-center justify-center gap-x-2"
      >
        <FacebookShareButton url={shareLink} title={name}>
          <FacebookIcon size={32} round />
        </FacebookShareButton>
        <TwitterShareButton url={shareLink} title={name}>
          <TwitterIcon size={32} round />
        </TwitterShareButton>
        <LinkedinShareButton url={shareLink} title={name}>
          <LinkedinIcon size={32} round />
        </LinkedinShareButton>
        <EmailShareButton url={shareLink} subject={name}>
          <EmailIcon size={32} round />
        </EmailShareButton>
        <Button
          onClick={handleCopy}
          variant="ghost"
          size="icon"
          className="h-8 w-8 rounded-full bg-primary text-secondary hover:bg-primary/80"
        >
          <LuCopy size={20} />
        </Button>
      </PopoverContent>
    </Popover>
  );
}
export default ShareButton;
