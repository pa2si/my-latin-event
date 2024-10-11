'use client';

import React from 'react';
import { Checkbox } from '@/components/ui/checkbox';

type FormCheckboxProps = {
  id: string;
  label: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
};

const FormCheckbox: React.FC<FormCheckboxProps> = ({
  id,
  label,
  checked,
  onCheckedChange,
}) => {
  return (
    <div className="flex items-center space-x-2">
      <Checkbox id={id} checked={checked} onCheckedChange={onCheckedChange} />
      <label
        htmlFor={id}
        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
      >
        {label}
      </label>
    </div>
  );
};

export default FormCheckbox;
