import React from 'react';

import CarCardSkeleton from '@/components/CarCardSkeleton';

const SearchSkeleton = () => {
  return (
    <>
      {Array.from({ length: 8 }).map((_, index) => (
        <div className="col-span-1" key={index}>
          <CarCardSkeleton />
        </div>
      ))}
    </>
  );
};

export default SearchSkeleton;
