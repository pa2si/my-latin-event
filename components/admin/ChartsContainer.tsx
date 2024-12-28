import Chart from "./Chart";

interface ChartData {
  name: string;
  events: number;
  likes: number;
  follows: number;
}

const ChartsContainer = ({ data }: { data: ChartData[] }) => {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {/* Events Growth Chart */}
      <div className="rounded-xl border bg-card p-8">
        <div>
          <h2 className="font-semibold">Events Growth</h2>
          <p className="text-sm text-muted-foreground">
            Number of new events per month
          </p>
        </div>
        <Chart data={data} type="events" colors={["#ea580c"]} />
      </div>

      {/* Engagement Chart */}
      <div className="rounded-xl border bg-card p-8">
        <div>
          <h2 className="font-semibold">User Engagement</h2>
          <p className="text-sm text-muted-foreground">
            Likes and follows per month
          </p>
        </div>
        <Chart data={data} type="engagement" colors={["#06b6d4", "#84cc16"]} />
      </div>
    </div>
  );
};

export default ChartsContainer;
