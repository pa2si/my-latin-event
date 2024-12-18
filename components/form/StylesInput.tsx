"use client";

import { Style } from "@/utils/types";
import { motion } from "framer-motion";
import { useEffect } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { staggeredAnimationFromLeft } from "@/utils/animations";
import { useGenreStylesStore } from "@/utils/store";
import { FiMusic } from "react-icons/fi";

const StylesInput = ({
  defaultGenres,
  defaultStyles,
}: {
  defaultGenres: string[];
  defaultStyles: Style[];
}) => {
  const {
    availableStyles,
    selectedStyles,
    setSelectedStyles,
  } = useGenreStylesStore();

  useEffect(() => {
    // Initialize selected styles from defaultStyles if provided
    if (defaultStyles?.length > 0) {
      setSelectedStyles(defaultStyles.filter(style => style.selected).map(style => style.name));
    }
  }, [defaultStyles, setSelectedStyles]);

  const handleChange = (styleName: string) => {
    setSelectedStyles(
      selectedStyles.includes(styleName)
        ? selectedStyles.filter(name => name !== styleName)
        : [...selectedStyles, styleName]
    );
  };

  return (
    <section>
      <input
        type="hidden"
        name="styles"
        value={JSON.stringify(selectedStyles)}
      />
      <div className="mb-12 mt-6 flex-row justify-center">
        <div className="mb-1 flex flex-row items-center justify-between">
          <div className="flex items-center gap-1 ">
            <FiMusic />
            <h3 className="font-medium">Styles</h3>
            <span className="ml-2 text-sm text-muted-foreground">
              ({selectedStyles.length} selected)
            </span>
          </div>
        </div>
        <p className="mb-5 text-sm text-muted-foreground">
          Not required, but selecting specific styles helps attendees understand what music to expect alongside the genre selection.
        </p>
        <div className="grid grid-cols-2 gap-x-20 gap-y-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {availableStyles.map((style) => (
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
                checked={selectedStyles.includes(style.name)}
                onCheckedChange={() => handleChange(style.name)}
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
};

export default StylesInput;
