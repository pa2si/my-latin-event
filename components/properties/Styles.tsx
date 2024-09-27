import { Style } from '@/utils/styles';
import { FaMusic } from 'react-icons/fa';
import Title from './Title';

const Styles = ({ styles }: { styles: string }) => {
  const stylesList: Style[] = JSON.parse(styles as string);
  const noStyles = stylesList.every((style) => !style.selected);

  if (noStyles) {
    return null;
  }
  return (
    <div className="mt-4">
      <Title text="Expect this music styles" />
      <div className="grid md:grid-cols-2 gap-x-4">
        {stylesList.map((style) => {
          if (!style.selected) {
            return null;
          }
          return (
            <div key={style.name} className="flex items-center gap-x-2 mb-2 ">
              <FaMusic className="h-4 w-4 text-primary" />
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
