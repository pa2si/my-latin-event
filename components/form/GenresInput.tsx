import { Label } from '@/components/ui/label';
import { genres } from '@/utils/genres';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const name = 'genre';

const GenresInput = ({
  defaultValue,
  onChange,
}: {
  defaultValue?: string;
  onChange: (value: string) => void;
}) => {
  return (
    <div className="mb-2">
      <Label htmlFor={name} className="capitalize">
        Genres
      </Label>
      <Select
        defaultValue={defaultValue || genres[0].label}
        name={name}
        required
        onValueChange={onChange}
      >
        <SelectTrigger id={name}>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {genres.map((item) => {
            return (
              <SelectItem key={item.label} value={item.label}>
                <span className="flex items-center gap-2">{item.label}</span>
              </SelectItem>
            );
          })}
        </SelectContent>
      </Select>
    </div>
  );
};

export default GenresInput;
