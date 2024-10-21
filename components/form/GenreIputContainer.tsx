"use client";

import { Style } from "@/utils/styles";
import { useGenreStyles } from "@/utils/useGenreStyles";
import React from "react";
import GenresInput from "./GenresInput";

const GenreIputContainer = ({
  defaultGenre,
  defaultStyles,
}: {
  defaultGenre: string;
  defaultStyles: Style[];
}) => {
  const { setSelectedGenre } = useGenreStyles(defaultGenre, defaultStyles);

  return (
    <div>
      {" "}
      <GenresInput defaultValue={defaultGenre} onChange={setSelectedGenre} />
    </div>
  );
};

export default GenreIputContainer;
