"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { useState } from "react";
import GuestLocationContainer from "./GuestLocationContainer";

const LocationDialog = () => {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Set Your Location</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Location Settings</DialogTitle>
        </DialogHeader>
        <GuestLocationContainer onClose={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
};

export default LocationDialog;
