import { RadioGroup } from "@/components/ui/radio-group";
import FormContainer from "@/components/form/FormContainer";
import { SubmitButton } from "@/components/form/Buttons";
import { EmailListItem } from "./EmailListItem";
import type { EmailListProps } from "@/utils/types";

export const EmailList = ({
  emails,
  onResendCode,
  onDelete,
  setPrimaryAction,
}: EmailListProps) => {
  const shouldShowSetPrimary = () => {
    return (
      emails.length > 1 &&
      emails.some((e) => e.verification?.status === "verified" && !e.isPrimary)
    );
  };

  const handleDelete = async (emailId: string) => {
    const formData = new FormData();
    formData.append("emailId", emailId);
    await onDelete({}, formData);
  };

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-medium">Your Email Addresses</h3>

      {emails.length > 0 && (
        <FormContainer action={setPrimaryAction}>
          <RadioGroup
            name="value"
            defaultValue={emails.find((e) => e.isPrimary)?.id}
            className="space-y-3"
          >
            {emails.map((email) => (
              <EmailListItem
                key={email.id}
                email={email}
                onResendCode={onResendCode}
                onDelete={handleDelete}
              />
            ))}
          </RadioGroup>
          {shouldShowSetPrimary() && (
            <SubmitButton
              text="Set as Primary"
              className="mt-3"
              disabled={
                !emails.some(
                  (e) => e.verification?.status === "verified" && !e.isPrimary,
                )
              }
            />
          )}
        </FormContainer>
      )}
    </div>
  );
};

export default EmailList;
