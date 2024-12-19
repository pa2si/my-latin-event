import React, { forwardRef } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

type FormInputProps = {
  name: string;
  type: string;
  label?: string;
  defaultValue?: string;
  placeholder?: string;
  description?: string;
  required?: boolean;
  value?: number | string;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
  onFocus?: (event: React.FocusEvent<HTMLInputElement>) => void;
  disabled?: boolean;
};

const FormInput = forwardRef<HTMLInputElement, FormInputProps>(
  (
    {
      label,
      name,
      type,
      defaultValue,
      placeholder,
      description,
      required,
      value,
      className,
      onChange,
      onFocus,
      disabled,
    },
    ref,
  ) => {
    return (
      <div className="mb-2">
        <Label htmlFor={name} className="capitalize font-antonio text-md tracking-wide">
          {label || name}
        </Label>
        {description && <p className="text-sm text-gray-500">{description}</p>}
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
          onFocus={onFocus}
          disabled={disabled}
        />
      </div>
    );
  },
);

FormInput.displayName = "FormInput"; // This is required to avoid issues with forwardRef

export default FormInput;
