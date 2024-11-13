"use client";

import React, { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "@/components/ui/use-toast";
import { EmailAddressResource } from "@clerk/types";
import { deleteEmailAction, setPrimaryEmailAction } from "@/utils/actions";
import { VerificationForm } from "@/components/form/VerificationForm";
import { EmailList } from "@/components/profile/EmailList";
import { AddEmailForm } from "@/components/profile/AddEmailForm";
import { LoadingSpinner } from "@/components/profile/LoadingsSpinner";

type EmailData = {
  id: string;
  emailAddress: string;
  verification: {
    status: string | undefined;
  } | null;
  isPrimary: boolean;
};

type EmailSettingsProps = {
  emails: EmailData[];
};

const EmailSettings = ({ emails }: EmailSettingsProps) => {
  const router = useRouter();
  const { user, isLoaded } = useUser();
  const [verifyingEmailId, setVerifyingEmailId] = useState<string | null>(null);
  const [verificationCode, setVerificationCode] = useState("");
  const [pendingEmail, setPendingEmail] = useState<
    EmailAddressResource | undefined
  >();
  console.log("User emails:", user?.emailAddresses);
  console.log("Passed emails:", emails);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAddEmail = async (
    prevState: any, // Add this parameter
    formData: FormData, // FormData will be passed as second parameter
  ): Promise<{ message: string }> => {
    if (!user) {
      return { message: "You must be logged in to add an email." };
    }

    try {
      const email = formData.get("newEmail") as string; // Now this should work

      if (!email) {
        return { message: "Please enter an email address." };
      }

      const res = await user.createEmailAddress({ email });

      if (!res) {
        throw new Error("Failed to create email address");
      }

      await user.reload();

      const emailAddress = user.emailAddresses.find((a) => a.id === res.id);

      if (!emailAddress) {
        throw new Error("Failed to find newly created email");
      }

      setPendingEmail(emailAddress);
      await emailAddress.prepareVerification({ strategy: "email_code" });
      setVerifyingEmailId(emailAddress.id);

      return {
        message: `Verification code sent to ${email}. Please check your inbox.`,
      };
    } catch (error) {
      console.error("Error adding email:", error);
      return {
        message:
          error instanceof Error
            ? error.message
            : "Something went wrong. Please try again.",
      };
    }
  };

  const handleVerifyCode = async (
    prevState: any,
    formData: FormData,
  ): Promise<{ message: string }> => {
    if (!pendingEmail) {
      return { message: "No pending email to verify." };
    }

    try {
      const code = (formData.get("code") as string).trim();

      if (code.length !== 6 || !/^\d+$/.test(code)) {
        return { message: "Please enter a valid 6-digit code." };
      }

      const verificationResult = await pendingEmail.attemptVerification({
        code,
      });

      if (verificationResult?.verification?.status === "verified") {
        setVerifyingEmailId(null);
        setVerificationCode("");
        setPendingEmail(undefined);
        router.refresh();

        toast({
          className: "bg-primary/90 text-secondary",
          description: "Email verified successfully!",
        });

        return { message: "Email verified successfully!" };
      }
      return { message: "Incorrect verification code. Please try again." };
    } catch (error) {
      console.error("Verification error:", error);
      return {
        message: "Invalid verification code. Please check and try again.",
      };
    }
  };

  const handleResendCode = async (emailId: string) => {
    try {
      const emailToVerify =
        pendingEmail || user?.emailAddresses.find((e) => e.id === emailId);
      if (!emailToVerify) throw new Error("Email not found");

      await emailToVerify.prepareVerification({ strategy: "email_code" });
      toast({
        className: "bg-primary/90 text-secondary",
        description: "A new verification code has been sent to your email.",
      });
    } catch (error) {
      console.error("Resend error:", error);
      toast({
        description: "Failed to resend code. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (!isLoaded) {
    return (
      <Card>
        <CardContent>
          <div className="flex h-[200px] items-center justify-center">
            <LoadingSpinner size="lg" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <section>
      <Card className="-m-8 border-0 shadow-none">
        <CardHeader>
          <CardTitle>Email Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {verifyingEmailId && (
            <VerificationForm
              verificationCode={verificationCode}
              setVerificationCode={setVerificationCode}
              onResendCode={() => handleResendCode(verifyingEmailId)}
              onVerify={handleVerifyCode}
            />
          )}

          <EmailList
            emails={emails}
            onResendCode={handleResendCode}
            onDelete={deleteEmailAction}
            setPrimaryAction={setPrimaryEmailAction}
          />

          {!verifyingEmailId && <AddEmailForm onAddEmail={handleAddEmail} />}
        </CardContent>
      </Card>
    </section>
  );
};

export default EmailSettings;
