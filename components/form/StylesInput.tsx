'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { Style } from '@/utils/styles';
import { Checkbox } from '@/components/ui/checkbox';
import { staggeredAnimationFromLeft } from '@/utils/animations';

function StylesInput({ styles }: { styles: Style[] }) {
  const [selectedStyles, setSelectedStyles] = useState<Style[]>(styles);

  useEffect(() => {
    setSelectedStyles(styles);
  }, [styles]);

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
        {selectedStyles.map((style) => (
          <motion.div
            key={style.name}
            className="flex items-center space-x-2"
            variants={staggeredAnimationFromLeft(0.15)}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            custom={style.name}
          >
            <Checkbox
              id={style.name}
              checked={style.selected}
              onCheckedChange={() => handleChange(style)}
            />
            <label
              htmlFor={style.name}
              className="text-sm font-medium leading-none capitalize flex gap-x-2 items-center"
            >
              {style.name}
            </label>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

export default StylesInput;
