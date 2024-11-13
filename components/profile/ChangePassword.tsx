import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import FormContainer from "@/components/form/FormContainer";
import FormInput from "@/components/form/FormInput";
import { SubmitButton } from "@/components/form/Buttons";
import { changePasswordAction } from "@/utils/actions";

const ChangePassword = () => {
  return (
    <section>
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Change Password</CardTitle>
        </CardHeader>
        <CardContent>
          <FormContainer action={changePasswordAction}>
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
