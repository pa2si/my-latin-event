import { genres } from '@/utils/genres';
import { ScrollArea, ScrollBar } from '../ui/scroll-area';
import Link from 'next/link';

const GenresList = ({ genre, search }: { genre?: string; search?: string }) => {
  const searchTerm = search ? `&search=${search}` : '';
  return (
    <section>
      <ScrollArea className="py-6">
        <div className="flex gap-x-4">
          {genres.map((item) => {
            const isActive = item.label === genre; // genre from query params
            return (
              <Link
                key={item.label}
                href={`/?genre=${item.label}${searchTerm}`}
              >
                <article
                  className={`p-3 flex flex-col items-center cursor-pointer duration-300  hover:text-primary w-[100px] ${
                    isActive ? 'text-primary' : ''
                  }`}
                >
                  <item.icon className="w-8 h-8 " />
                  <p className="capitalize text-sm mt-1">{item.label}</p>
                </article>
              </Link>
            );
          })}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </section>
  );
};
export default GenresList;
