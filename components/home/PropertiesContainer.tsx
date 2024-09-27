import { fetchProperties } from '@/utils/actions';
import PropertiesList from './PropertiesList';
import EmptyList from './EmptyList';
import type { PropertyCardProps } from '@/utils/types';

const PropertiesContainer = async ({
  genre,
  search,
}: {
  genre?: string;
  search?: string;
}) => {
  const properties: PropertyCardProps[] = await fetchProperties({
    genre,
    search,
  });

  if (properties.length === 0) {
    return (
      <EmptyList
        heading="No results."
        message="Try changing or removing some of your filters."
        btnText="Clear Filters"
      />
    );
  }

  return <PropertiesList properties={properties} />;
};
export default PropertiesContainer;
