"use client";

import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import FormContainer from "@/components/form/FormContainer";
import FormInput from "@/components/form/FormInput";
import { SubmitButton } from "@/components/form/Buttons";
import { changePasswordAction } from "@/utils/actions";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const ChangePassword = () => {
  const router = useRouter();
  const [shouldRedirect, setShouldRedirect] = useState(false);

  useEffect(() => {
    if (shouldRedirect) {
      const timer = setTimeout(() => {
        router.push("/");
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [shouldRedirect, router]);

  const handleAction = async (prevState: any, formData: FormData) => {
    const result = await changePasswordAction(prevState, formData);
    if (result.message === "Password updated successfully! Redirecting...") {
      setShouldRedirect(true);
    }
    return result;
  };

  return (
    <section>
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Change Password</CardTitle>
        </CardHeader>
        <CardContent>
          <FormContainer action={handleAction}>
            <div className="space-y-4">
              <FormInput
                type="password"
                name="currentPassword"
                label="Current Password"
                required
                description="Enter your current password for verification"
              />

              <div className="my-6 h-px bg-border" />

              <FormInput
                type="password"
                name="password"
                label="New Password"
                required
                description="Must be at least 8 characters"
              />

              <FormInput
                type="password"
                name="confirmPassword"
                label="Confirm New Password"
                required
              />
            </div>

            <SubmitButton
              text="Update Password"
              className="mt-4 md:max-w-fit"
            />
          </FormContainer>
        </CardContent>
      </Card>
    </section>
  );
};

export default ChangePassword;
