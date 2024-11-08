"use client";

import React, { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import FormContainer from "@/components/form/FormContainer";
import FormInput from "@/components/form/FormInput";
import { SubmitButton } from "@/components/form/Buttons";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";
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
import { EmailAddressResource } from "@clerk/types";
import { deleteEmailAction, setPrimaryEmailAction } from "@/utils/actions";

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
  const { user, isLoaded } = useUser();
  const [verifyingEmailId, setVerifyingEmailId] = useState<string | null>(null);
  const [verificationCode, setVerificationCode] = useState("");
  const [pendingEmail, setPendingEmail] = useState<
    EmailAddressResource | undefined
  >();

  const handleAddEmail = async (formData: FormData): Promise<string> => {
    if (!isLoaded) {
      return "Please wait while we load your information.";
    }

    if (!user) {
      return "You must be logged in to add an email.";
    }

    try {
      const email = formData.get("newEmail") as string;

      if (!email) {
        return "Please enter an email address.";
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

      // toast({
      //   className: "bg-primary/90 text-secondary",
      //   description: `Verification code sent to ${email}. Please check your inbox.`,
      // });

      return `Verification code sent to ${email}. Please check your inbox.`;
    } catch (error) {
      console.error("Error adding email:", error);
      const errorMessage =
        error instanceof Error && error.message
          ? error.message
          : "Something went wrong. Please try again.";
      return errorMessage;
    }
  };

  const handleVerifyCode = async (formData: FormData): Promise<string> => {
    if (!pendingEmail) {
      return "No pending email to verify.";
    }

    try {
      const code = formData.get("code") as string;
      const verificationResult = await pendingEmail.attemptVerification({
        code,
      });

      if (verificationResult?.verification?.status === "verified") {
        setVerifyingEmailId(null);
        setVerificationCode("");
        setPendingEmail(undefined);

        toast({
          className: "bg-primary/90 text-secondary",
          description:
            "Email verified successfully! Page will refresh to show updated emails.",
        });

        return "Email verified successfully!";
      } else {
        return "Incorrect verification code. Please try again.";
      }
    } catch (error) {
      console.error("Verification error:", error);
      return "Invalid verification code. Please check and try again.";
    }
  };

  const handleResendCode = async (emailId: string) => {
    try {
      const emailToVerify =
        pendingEmail || user?.emailAddresses.find((e) => e.id === emailId);

      if (!emailToVerify) {
        throw new Error("Email not found");
      }

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

  const handleDelete = async (emailId: string) => {
    const formData = new FormData();
    formData.append("emailId", emailId);

    const result = await deleteEmailAction({}, formData);
    toast({
      className: "bg-primary/90 text-secondary",
      description: result.message,
    });
  };

  if (!isLoaded) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Email Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center p-4">Loading...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Email Settings</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Verification Form */}
        {verifyingEmailId && (
          <div className="space-y-4">
            <Alert variant="default" className="border-green-200 bg-green-50">
              <AlertDescription className="text-green-800">
                A verification code has been sent to your email address. Please
                enter it below to complete the verification process.
              </AlertDescription>
            </Alert>
            <FormContainer
              action={async (prevState: any, formData: FormData) => {
                const result = await handleVerifyCode(formData);
                if (result.includes("successfully")) {
                  // Wait a brief moment to show the success message
                  setTimeout(() => {
                    window.location.reload();
                  }, 1000);
                }
                return { message: result };
              }}
            >
              <FormInput
                type="text"
                name="code"
                label="Verification Code"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                required
                description="Enter the 6-digit code sent to your email"
              />
              <div className="flex gap-2">
                <SubmitButton text="Verify" />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => handleResendCode(verifyingEmailId)}
                >
                  Resend Code
                </Button>
              </div>
            </FormContainer>
          </div>
        )}

        {/* Current Emails List */}
        <div className="space-y-4">
          <h3 className="text-sm font-medium">Your Email Addresses</h3>

          {emails.length > 0 && (
            <FormContainer action={setPrimaryEmailAction}>
              <RadioGroup
                name="value"
                defaultValue={emails.find((e) => e.isPrimary)?.id}
                className="space-y-3"
              >
                {emails.map((email) => (
                  <div
                    key={email.id}
                    className="flex items-center justify-between space-x-2 rounded-lg border p-3"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem
                        value={email.id}
                        disabled={
                          !email.verification?.status || email.isPrimary
                        }
                        id={email.id}
                      />
                      <div className="grid gap-1">
                        <Label htmlFor={email.id} className="font-normal">
                          {email.emailAddress}
                        </Label>
                        <div className="flex items-center gap-2">
                          <span
                            className={`text-xs ${
                              email.verification?.status === "verified"
                                ? "text-green-600"
                                : "text-yellow-600"
                            }`}
                          >
                            {email.verification?.status === "verified"
                              ? "Verified"
                              : "Unverified"}
                          </span>
                          {email.isPrimary && (
                            <span className="rounded bg-primary/10 px-2 py-0.5 text-xs text-primary">
                              Primary
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {!email.verification?.status && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleResendCode(email.id)}
                        type="button"
                      >
                        Resend verification
                      </Button>
                    )}

                    {!email.isPrimary &&
                      email.verification?.status === "verified" && (
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
                                <span className="text-destructive">
                                  {email.emailAddress}
                                </span>{" "}
                                from your account. This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDelete(email.id)}
                                className="bg-destructive hover:bg-destructive/90"
                              >
                                Remove
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      )}
                  </div>
                ))}
              </RadioGroup>
              <SubmitButton
                text="Set as Primary"
                className="mt-3"
                disabled={
                  !emails.some(
                    (e) =>
                      e.verification?.status === "verified" && !e.isPrimary,
                  )
                }
              />
            </FormContainer>
          )}
        </div>

        {/* Add New Email Form */}
        {!verifyingEmailId && (
          <div className="border-t pt-6">
            <h3 className="mb-4 text-sm font-medium">Add New Email</h3>
            <FormContainer
              action={async (prevState: any, formData: FormData) => {
                const result = await handleAddEmail(formData);
                return { message: result };
              }}
            >
              <FormInput
                type="email"
                name="newEmail"
                label="New Email Address"
                required
                description="A verification code will be sent to this address"
              />
              <SubmitButton text="Add Email" className="mt-4" />
            </FormContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default EmailSettings;
