import { Style } from "@/utils/types";
import Title from "./Title";
import { Badge } from "../ui/badge";

const Styles = ({ styles }: { styles: string }) => {
  const stylesList: Style[] = JSON.parse(styles as string);
  const noStyles = stylesList.every((style) => !style.selected);

  if (noStyles) {
    return null;
  }
  return (
    <div className="mt-4">
      <Title text="Music Styles" />
      <div className="grid gap-x-4 md:grid-cols-2">
        {stylesList.map((style) => {
          if (!style.selected) {
            return null;
          }
          return (
            <Badge
              key={style.name}
              className="mb-2 flex w-fit items-center gap-x-2"
            >
              <span className="text-sm font-light capitalize">
                {style.name}
              </span>
            </Badge>
          );
        })}
      </div>
    </div>
  );
};
export default Styles;
