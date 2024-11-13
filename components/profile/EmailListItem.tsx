import { RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import type { EmailListItemProps } from "@/utils/types";
import EmailActions from "./EmailActions";
import EmailStatus from "./EmailStatus";

export const EmailListItem = ({
  email,
  onResendCode,
  onDelete,
}: EmailListItemProps) => {
  return (
    <div className="flex items-center justify-between space-x-2 rounded-lg border p-3">
      <div className="flex items-center space-x-2">
        <RadioGroupItem
          value={email.id}
          disabled={!email.verification?.status || email.isPrimary}
          id={email.id}
        />
        <div className="grid gap-1">
          <Label htmlFor={email.id} className="font-normal">
            {email.emailAddress}
          </Label>
          <EmailStatus
            isVerified={email.verification?.status === "verified"}
            isPrimary={email.isPrimary}
          />
        </div>
      </div>

      <EmailActions
        emailId={email.id}
        isVerified={email.verification?.status === "verified"}
        isPrimary={email.isPrimary}
        emailAddress={email.emailAddress}
        onResendCode={onResendCode}
        onDelete={onDelete}
      />
    </div>
  );
};

export default EmailListItem;
