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

type EmailActionsProps = {
  emailId: string;
  isVerified: boolean;
  isPrimary: boolean;
  emailAddress: string;
  onResendCode: (emailId: string) => void;
  onDelete: (emailId: string) => void;
};

const EmailActions = ({
  emailId,
  isVerified,
  isPrimary,
  emailAddress,
  onResendCode,
  onDelete,
}: EmailActionsProps) => {
  if (!isVerified) {
    return (
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onResendCode(emailId)}
        type="button"
      >
        Resend verification
      </Button>
    );
  }

  if (!isPrimary && isVerified) {
    return (
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="text-destructive hover:text-destructive/90"
            type="button"
          >
            Remove
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will remove the email address{" "}
              <span className="text-destructive">{emailAddress}</span> from your
              account. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => onDelete(emailId)}
              className="bg-destructive hover:bg-destructive/90"
            >
              Remove
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );
  }

  return null;
};

export default EmailActions;
