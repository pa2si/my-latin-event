import React from "react";
import { Trash2 } from "lucide-react";
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
import FormContainer from "@/components/form/FormContainer";
import { EditOrganizerDialog } from "./OrganizerDialog";

type OrganizerProfileProps = {
  organizer: Organizer;
};

const OrganizerProfile: React.FC<OrganizerProfileProps> = ({ organizer }) => {
  return (
    <div className="flex items-center justify-between space-x-2 rounded-lg border p-3 hover:bg-accent/5">
      <div className="flex items-center space-x-4">
        <img
          src={organizer.organizerImage || "/api/placeholder/40/40"}
          alt={organizer.organizerName}
          className="h-10 w-10 rounded-full object-cover"
        />
        <div className="grid gap-1">
          <p className="font-medium">{organizer.organizerName}</p>
          <p className="text-sm text-muted-foreground">{organizer.slogan}</p>
        </div>
      </div>

      <div className="flex space-x-2">
        <EditOrganizerDialog organizer={organizer} />

        <AlertDialog>
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
                <span className="font-semibold">
                  {organizer.organizerName}{" "}
                </span>{" "}
                and all associated events. This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <FormContainer
                action={async () => {
                  try {
                    const result = await deleteOrganizerAction(organizer.id);
                    if (result.success) {
                      return {
                        message: "Organizer deleted successfully!",
                      };
                    }
                    return {
                      message: result.message || "Failed to delete organizer",
                    };
                  } catch (error) {
                    return {
                      message: "An error occurred. Please try again.",
                    };
                  }
                }}
              >
                <AlertDialogAction
                  type="submit"
                  className="bg-destructive hover:bg-destructive/90"
                >
                  Delete
                </AlertDialogAction>
              </FormContainer>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
};

export default OrganizerProfile;
