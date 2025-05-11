import { LayoutDashboard, Trophy, Users, ChevronDown } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function PresidentDashboard() {
  return (
    <div className="min-h-screen">
      {/* Main Content */}
      <div className="ml-64 p-8">
        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
          <StatCard
            title="Active Competitions"
            value={12}
            change={2}
            icon={<Trophy className="h-5 w-5 text-[#e50914]" />}
          />
          <StatCard
            title="Pending Applications"
            value={24}
            change={5}
            icon={<Users className="h-5 w-5 text-my-purple" />}
          />
          {/* More stat cards */}
        </div>

        {/* Recent Activity */}
        <div className="grid gap-4 lg:grid-cols-3 mb-6">
          <Card className="lg:col-span-2 border-gray-700">
            <CardHeader>
              <CardTitle className="">Recent Activity</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <ActivityItem
                title="New competition submission"
                description="Hackathon 2023 submitted by Tech Team"
                time="2h ago"
                icon={<Trophy className="h-4 w-4 text-[#e50914]" />}
              />
              {/* More activity items */}
            </CardContent>
          </Card>

          <Card className="border-gray-700">
            <CardHeader>
              <CardTitle className="">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button
                variant="outline"
                className="w-full justify-start border-gray-600"
              >
                <Trophy className="mr-2 h-4 w-4 text-[#e50914]" />
                Approve New Competition
              </Button>
              {/* More quick actions */}
            </CardContent>
          </Card>
        </div>

        {/* Performance Chart */}
        <Card className=" border-gray-700">
          <CardHeader>
            <CardTitle className="">Team Performance</CardTitle>
          </CardHeader>
          <CardContent className="h-80">
            {/* Chart would be implemented here */}
            <div className="flex items-center justify-center h-full bg-gray-300 rounded-lg">
              <p className="text-sm text-gray-400">
                Performance chart visualization
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function StatCard({ title, value, change, icon }) {
  const isPositive = change >= 0;

  return (
    <Card className=" border-gray-700">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium ">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p
          className={`text-xs ${
            isPositive ? "text-green-400" : "text-red-400"
          }`}
        >
          {isPositive ? "+" : ""}
          {change} from last week
        </p>
      </CardContent>
    </Card>
  );
}

function ActivityItem({ title, description, time, icon }) {
  return (
    <div className="flex items-start gap-4">
      <div className="p-2 rounded-lg">{icon}</div>
      <div className="flex-1">
        <h4 className="font-medium">{title}</h4>
        <p className="text-sm">{description}</p>
      </div>
      <Badge variant="outline" className="ml-auto border-gray-600">
        {time}
      </Badge>
    </div>
  );
}
