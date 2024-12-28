import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, CalendarDays, Building2, Heart, UserPlus } from "lucide-react";

interface StatsContainerProps {
  stats: {
    usersCount: number;
    eventsCount: number;
    organizersCount: number;
    likesCount: number;
    followsCount: number;
  };
}

const statsConfig = [
  {
    title: "Total Users",
    value: (stats: StatsContainerProps["stats"]) => stats.usersCount,
    icon: Users,
    helperText: "Active user profiles",
  },
  {
    title: "Total Events",
    value: (stats: StatsContainerProps["stats"]) => stats.eventsCount,
    icon: CalendarDays,
    helperText: "Events created",
  },
  {
    title: "Total Organizers",
    value: (stats: StatsContainerProps["stats"]) => stats.organizersCount,
    icon: Building2,
    helperText: "Active organizers",
  },
  {
    title: "Total Likes",
    value: (stats: StatsContainerProps["stats"]) => stats.likesCount,
    icon: Heart,
    helperText: "Likes on events",
  },
  {
    title: "Total Follows",
    value: (stats: StatsContainerProps["stats"]) => stats.followsCount,
    icon: UserPlus,
    helperText: "Organizer follows",
  },
];

const StatsContainer = ({ stats }: StatsContainerProps) => {
  return (
    <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-5">
      {statsConfig.map((stat) => {
        const Icon = stat.icon;
        return (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <Icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value(stats)}</div>
              <p className="text-xs text-muted-foreground">{stat.helperText}</p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default StatsContainer;
