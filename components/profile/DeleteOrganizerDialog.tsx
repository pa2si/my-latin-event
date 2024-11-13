"use client";

import React, { useTransition } from "react";
import { Trash2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Organizer } from "@/utils/types";
import { deleteOrganizerAction } from "@/utils/actions";
import { useToast } from "@/components/ui/use-toast";

type DeleteOrganizerDialogProps = {
  organizer: Organizer;
};
export const DeleteOrganizerDialog: React.FC<DeleteOrganizerDialogProps> = ({
  organizer,
}) => {
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  const [open, setOpen] = React.useState(false);

  //because this is a client component, we need to handle the toast here
  const handleDelete = async (formData: FormData) => {
    startTransition(async () => {
      const result = await deleteOrganizerAction({}, formData);
      if (result.message) {
        toast({
          description: result.message,
          className: "bg-primary/90 text-secondary",
        });
      }
      setOpen(false);
    });
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="text-destructive hover:text-destructive/90"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This will permanently delete the organizer{" "}
            <span className="font-semibold">{organizer.organizerName} </span>{" "}
            and all associated events. This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <form action={handleDelete}>
            <input type="hidden" name="id" value={organizer.id} />
            <AlertDialogAction
              type="submit"
              className="bg-destructive hover:bg-destructive/90"
              disabled={isPending}
            >
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </AlertDialogAction>
          </form>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
