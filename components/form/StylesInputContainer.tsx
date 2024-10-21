"use client";

import { Style } from "@/utils/styles";
import { useGenreStyles } from "@/utils/useGenreStyles";
import { FiMusic } from "react-icons/fi";
import StylesInput from "./StylesInput";

const StylesInputContainer = ({
  defaultGenre,
  defaultStyles,
}: {
  defaultGenre: string;
  defaultStyles: Style[];
}) => {
  const { styles } = useGenreStyles(defaultGenre, defaultStyles);

  return (
    <div className="mb-12 flex-row justify-center">
      <div className="flex flex-row items-center gap-1 text-xl">
        <h3 className="mb-6 mt-10 text-lg font-medium">Styles</h3>
        <div className="mt-4">
          <FiMusic />
        </div>
      </div>
      <StylesInput styles={styles} />
    </div>
  );
};

export default StylesInputContainer;
