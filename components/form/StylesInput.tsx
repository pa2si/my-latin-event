"use client";
222
import { Style } from "@/utils/types";
import { motion } from "framer-motion";
import { useEffect } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { staggeredAnimationFromLeft } from "@/utils/animations";
import { useGenreStylesStore } from "@/utils/store";
import { useGenreStyles } from "@/utils/useGenreStyles";
import { FiMusic } from "react-icons/fi";

function StylesInput({
  defaultGenres,
  defaultStyles,
}: {
  defaultGenres: string[];
  defaultStyles: Style[];
}) {
  const { styles, setStyles } = useGenreStylesStore();
  useGenreStyles(defaultGenres, defaultStyles);

  useEffect(() => {
    if (styles.length === 0) {
      setStyles(defaultStyles);
    }
  }, [defaultStyles, styles.length, setStyles]);

  const handleChange = (style: Style) => {
    setStyles(
      styles.map((s) =>
        s.name === style.name ? { ...s, selected: !s.selected } : s
      ),
    );
  };

  return (
    <section>
      <input
        type="hidden"
        name="styles"
        value={JSON.stringify(styles.filter(s => s.selected).map(s => s.name))}
      />
      <div className="mb-12 flex-row justify-center">
        <div className="mb-1 flex flex-row items-center justify-between">
          <div className="flex items-center gap-1 text-xl">
            <h3 className="text-lg font-medium">Styles</h3>
            <FiMusic />
            <span className="ml-2 text-sm text-muted-foreground">
              ({styles.filter(s => s.selected).length} selected)
            </span>
          </div>
        </div>
        <p className="mb-5 text-sm text-muted-foreground">
          Not required, but selecting specific styles helps attendees understand what music to expect alongside the genre selection.
        </p>

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
