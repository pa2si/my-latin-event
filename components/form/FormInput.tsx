import React, { forwardRef } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

type FormInputProps = {
  name: string;
  type: string;
  label?: string;
  defaultValue?: string;
  placeholder?: string;
  required?: boolean;
  value?: number | string;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
  readOnly?: boolean;
  onFocus?: (event: React.FocusEvent<HTMLInputElement>) => void;
};

const FormInput = forwardRef<HTMLInputElement, FormInputProps>(
  (
    {
      label,
      name,
      type,
      defaultValue,
      placeholder,
      required,
      value,
      className,
      onChange,
      readOnly,
      onFocus,
    },
    ref,
  ) => {
    return (
      <div className="mb-2">
        <Label htmlFor={name} className="capitalize">
          {label || name}
        </Label>
        <Input
          id={name}
          name={name}
          type={type}
          defaultValue={defaultValue}
          placeholder={placeholder}
          onChange={onChange}
          required={required}
          value={value}
          className={className}
          ref={ref}
          readOnly={readOnly}
          onFocus={onFocus}
        />
      </div>
    );
  },
);

FormInput.displayName = "FormInput"; // This is required to avoid issues with forwardRef

export default FormInput;
