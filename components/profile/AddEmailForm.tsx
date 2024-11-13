import FormContainer from "@/components/form/FormContainer";
import FormInput from "@/components/form/FormInput";
import { SubmitButton } from "@/components/form/Buttons";
import { useFormStatus } from "react-dom";

type AddEmailFormProps = {
  onAddEmail: (
    prevState: any,
    formData: FormData,
  ) => Promise<{ message: string }>;
};

export const AddEmailForm = ({ onAddEmail }: AddEmailFormProps) => {
  const { pending } = useFormStatus();

  return (
    <div className="border-t pt-6">
      <h3 className="mb-4 text-sm font-medium">Add New Email</h3>
      <FormContainer action={onAddEmail}>
        <FormInput
          type="email"
          name="newEmail"
          label="New Email Address"
          required
          description="A verification code will be sent to this address"
          disabled={pending}
        />
        <SubmitButton text="Add Email" className="mt-4" />
      </FormContainer>
    </div>
  );
};
