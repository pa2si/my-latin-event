'use client';

import { Card, CardHeader } from '@/components/ui/card';
import { LuMinus, LuPlus } from 'react-icons/lu';
import { Button } from '../ui/button';
import { useState } from 'react';

const formatCamelCase = (str: string) => {
  return str.replace(/([A-Z])/g, ' $1').trim();
};

const CounterInput = ({
  detail,
  defaultValue,
}: {
  detail: string;
  defaultValue?: number;
}) => {
  const [count, setCount] = useState(defaultValue || 0);

  const detailDisplayNames: Record<string, string> = {
    floors: 'Floors',
    bars: 'Bars',
    outdoorAreas: 'Outdoor Areas',
  };

  const increaseCount = () => {
    setCount((prevCount) => prevCount + 1);
  };

  const decreaseCount = () => {
    setCount((prevCount) => {
      if (prevCount > 0) {
        return prevCount - 1;
      }
      return prevCount;
    });
  };

  return (
    <Card className="mb-4">
      <input type="hidden" name={detail} value={count} />
      <CardHeader className="flex flex-col gap-y-5">
        <div className="flex items-center justify-between flex-wrap">
          <div className="flex flex-col">
            <h2 className="capitalize font-antonio font-bold tracking-wide text-md">
              {detailDisplayNames[detail] || formatCamelCase(detail)}
            </h2>
            <p className="text-muted-foreground text-sm font-antonio  tracking-wide text-md">
              Specify the number of {detailDisplayNames[detail] || formatCamelCase(detail).toLowerCase()}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="icon"
              type="button"
              onClick={decreaseCount}
            >
              <LuMinus className="w-5 h-5 text-primary" />
            </Button>
            <span className="text-xl  w-5 text-center font-antonio font-bold text-md">{count}</span>
            <Button
              variant="outline"
              size="icon"
              type="button"
              onClick={increaseCount}
            >
              <LuPlus className="w-5 h-5 text-primary" />
            </Button>
          </div>
        </div>
      </CardHeader>
    </Card>
  );
};

export default CounterInput;
