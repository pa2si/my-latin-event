import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

type FormInputProps = {
  name: string;
  type: string;
  label?: string;
  defaultValue?: string;
  placeholder?: string;
  required?: boolean;
  value?: number;
  onChange?: (value: string) => void;
  className?: string;
};

function FormInput({
  label,
  name,
  type,
  defaultValue,
  placeholder,
  required,
  value,
  className,
}: FormInputProps) {
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
        required={required}
        value={value}
        className={className}
      />
    </div>
  );
}

export default FormInput;
