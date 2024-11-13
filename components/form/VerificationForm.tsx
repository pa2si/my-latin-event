import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import FormContainer from "@/components/form/FormContainer";
import FormInput from "@/components/form/FormInput";
import { SubmitButton } from "@/components/form/Buttons";
import { useFormStatus } from "react-dom";
import { ReloadIcon } from "@radix-ui/react-icons";

type VerificationFormProps = {
  verificationCode: string;
  setVerificationCode: (code: string) => void;
  onResendCode: () => void;
  onVerify: (
    prevState: any,
    formData: FormData,
  ) => Promise<{ message: string }>;
};

export const VerificationForm = ({
  verificationCode,
  setVerificationCode,
  onResendCode,
  onVerify,
}: VerificationFormProps) => {
  const { pending } = useFormStatus();

  return (
    <div className="space-y-4">
      <Alert variant="default" className="w-fit border-green-200 bg-green-50">
        <AlertDescription className="text-green-800">
          A verification code has been sent to your email address. Please enter
          it below to complete the verification process.
        </AlertDescription>
      </Alert>
      <FormContainer action={onVerify}>
        <FormInput
          type="text"
          name="code"
          label="Verification Code"
          value={verificationCode}
          onChange={(e) => setVerificationCode(e.target.value)}
          required
          description="Enter the 6-digit code sent to your email"
          disabled={pending}
        />
        <div className="flex gap-2">
          <SubmitButton text="Verify" />
          <Button
            type="button"
            variant="outline"
            onClick={onResendCode}
            disabled={pending}
          >
            {pending ? (
              <>
                <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                Please wait...
              </>
            ) : (
              "Resend Code"
            )}
          </Button>
        </div>
      </FormContainer>
    </div>
  );
};
