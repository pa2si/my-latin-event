import { Style } from '@/utils/styles';
import { LuFolderCheck } from 'react-icons/lu';
import Title from './Title';

const Styles = ({ styles }: { styles: string }) => {
  const stylesList: Style[] = JSON.parse(styles as string);
  const noStyles = stylesList.every((style) => !style.selected);

  if (noStyles) {
    return null;
  }
  return (
    <div className="mt-4">
      <Title text="What this place offers" />
      <div className="grid md:grid-cols-2 gap-x-4">
        {stylesList.map((style) => {
          if (!style.selected) {
            return null;
          }
          return (
            <div key={style.name} className="flex items-center gap-x-4 mb-2 ">
              <LuFolderCheck className="h-6 w-6 text-primary" />
              <span className="font-light text-sm capitalize">
                {style.name}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
export default Styles;
