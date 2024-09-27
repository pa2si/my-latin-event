'use client';
import { useState } from 'react';
import { styles, Style } from '@/utils/styles';
import { Checkbox } from '@/components/ui/checkbox';

function StylesInput({ defaultValue }: { defaultValue?: Style[] }) {
  const stylesWithIcons = defaultValue?.map(({ name, selected }) => ({
    name,
    selected,
    icon: styles.find((style) => style.name === name)!.icon,
  }));
  const [selectedStyles, setSelectedStyles] = useState<Style[]>(
    stylesWithIcons || styles
  );
  const handleChange = (style: Style) => {
    setSelectedStyles((prev) => {
      return prev.map((a) => {
        if (a.name === style.name) {
          return { ...a, selected: !a.selected };
        }
        return a;
      });
    });
  };

  return (
    <section>
      <input
        type="hidden"
        name="styles"
        value={JSON.stringify(selectedStyles)}
      />
      <div className="grid grid-cols-2 gap-4">
        {selectedStyles.map((style) => {
          return (
            <div key={style.name} className="flex items-center space-x-2">
              <Checkbox
                id={style.name}
                checked={style.selected}
                onCheckedChange={() => handleChange(style)}
              />
              <label
                htmlFor={style.name}
                className="text-sm font-medium leading-none capitalize flex gap-x-2 items-center"
              >
                {style.name} <style.icon className="w-4 h-4" />
              </label>
            </div>
          );
        })}
      </div>
    </section>
  );
}
export default StylesInput;
