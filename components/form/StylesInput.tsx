"use client";

import { motion } from "framer-motion";
import { useEffect } from "react";
import { Style } from "@/utils/styles";
import { Checkbox } from "@/components/ui/checkbox";
import { staggeredAnimationFromLeft } from "@/utils/animations";
import { useGenreStylesStore } from "@/utils/store";
import { useGenreStyles } from "@/utils/useGenreStyles";
import { FiMusic } from "react-icons/fi";

function StylesInput({
  defaultGenre,
  defaultStyles,
}: {
  defaultGenre: string;
  defaultStyles: Style[];
}) {
  const { styles, setStyles } = useGenreStylesStore();
  useGenreStyles(defaultGenre, defaultStyles);

  useEffect(() => {
    if (styles.length === 0) {
      setStyles(defaultStyles);
    }
  }, [defaultStyles, styles.length, setStyles]);

  const handleChange = (style: Style) => {
    setStyles(
      styles.map((s) =>
        s.name === style.name ? { ...s, selected: !s.selected } : s,
      ),
    );
  };

  return (
    <section>
      <input type="hidden" name="styles" value={JSON.stringify(styles)} />
      <div className="mb-12 flex-row justify-center">
        <div className="mb-5 flex flex-row items-center gap-1 text-xl">
          <h3 className="text-lg font-medium">Styles</h3>
          <div className="">
            <FiMusic />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-x-20 gap-y-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {styles.map((style) => (
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
                className="flex items-center gap-x-2 text-sm font-medium capitalize leading-none"
              >
                {style.name}
              </label>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default StylesInput;
