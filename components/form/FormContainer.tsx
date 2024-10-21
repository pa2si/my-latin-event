"use client";
222;
import { useFormState } from "react-dom";
import { useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { actionFunction } from "@/utils/types";

const initialState = {
  message: "",
};

const FormContainer = ({
  action,
  children,
}: {
  action: actionFunction;
  children: React.ReactNode;
}) => {
  const [state, formAction] = useFormState(action, initialState);
  const { toast } = useToast();

  useEffect(() => {
    const { message } = state;
    if (message) {
      toast({ description: message });
    }
  }, [state, toast]);

  return <form action={formAction}>{children}</form>;
};

export default FormContainer;
