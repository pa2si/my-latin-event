"use client";

import { useFormState } from "react-dom";
import { useEffect, useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";

type State = {
  message: string;
  success?: boolean;
};

const initialState: State = {
  message: "",
};

const FormContainer = ({
  action,
  children,
}: {
  action: (prevState: State, formData: FormData) => Promise<State>;
  children: React.ReactNode;
}) => {
  const [state, formAction] = useFormState<State, FormData>(
    action,
    initialState,
  );
  const { toast } = useToast();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const { message } = state;

    if (message) {
      toast({
        description: state.message,
        className: "bg-primary/90 text-secondary",
      });

      if (state.success === true) {
        const timer = setTimeout(() => {
          router.push("/");
        }, 1000);
        return () => clearTimeout(timer);
      }
    }
  }, [state, toast, router, mounted]);

  return <form action={formAction}>{children}</form>;
};

export default FormContainer;

// "use client";

// import { useFormState } from "react-dom";
// import { useEffect } from "react";
// import { useToast } from "@/components/ui/use-toast";
// import { actionFunction } from "@/utils/types";

// const initialState = {
//   message: "",
// };

// const FormContainer = ({
//   action,
//   children,
// }: {
//   action: actionFunction;
//   children: React.ReactNode;
// }) => {
//   const [state, formAction] = useFormState(action, initialState);
//   const { toast } = useToast();

//   useEffect(() => {
//     const { message } = state;
//     if (message) {
//       toast({
//         description: message,
//         className: "bg-primary/90 text-secondary",
//       });
//     }
//   }, [state, toast]);

//   return <form action={formAction}>{children}</form>;
// };

// export default FormContainer;
