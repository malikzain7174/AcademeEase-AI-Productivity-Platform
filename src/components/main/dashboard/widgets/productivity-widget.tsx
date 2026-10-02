'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  TooltipProps,
  Legend,
  Label,
} from 'recharts';
import {
  BarChart3,
  PieChartIcon,
  CheckCircle,
  Clock,
  ListTodo,
  ArrowUp,
  TrendingUp,
} from 'lucide-react';
import { useTheme } from 'next-themes';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';

interface ProductivityStats {
  completed: number;
  total: number;
  inProgress: number;
  notStarted: number;
  completionRate: number;
}

interface ProductivityWidgetProps {
  stats: ProductivityStats;
  isLoading?: boolean;
}

export const ProductivityWidget = ({
  stats,
  isLoading = false,
}: ProductivityWidgetProps) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  // Prepare data for the pie chart with better colors for both themes
  const pieData = [
    {
      name: 'Completed 🎉',
      value: stats.completed,
      color: isDark ? 'rgba(74, 222, 128, 0.9)' : 'rgba(22, 163, 74, 0.9)', // green
      icon: <CheckCircle className='h-3 w-3' />,
    },
    {
      name: 'In Progress 🚀',
      value: stats.inProgress,
      color: isDark ? 'rgba(250, 204, 21, 0.9)' : 'rgba(202, 138, 4, 0.9)', // yellow
      icon: <Clock className='h-3 w-3' />,
    },
    {
      name: 'Backlog 📝',
      value: stats.notStarted,
      color: isDark ? 'rgba(148, 163, 184, 0.9)' : 'rgba(71, 85, 105, 0.9)', // slate
      icon: <ListTodo className='h-3 w-3' />,
    },
  ].filter((item) => item.value > 0);

  // Custom tooltip for the pie chart
  const CustomPieTooltip = ({
    active,
    payload,
  }: TooltipProps<number, string>) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className='bg-popover border rounded-md shadow-md p-2 text-xs'>
          <p className='font-medium'>{data.name}</p>
          <p className='text-muted-foreground'>
            {data.value} task{data.value !== 1 ? 's' : ''}
          </p>
          <p className='text-muted-foreground'>
            {Math.round((data.value / stats.total) * 100)}% of total
          </p>
        </div>
      );
    }
    return null;
  };

  // Custom legend for the pie chart
  const CustomLegend = (props: any) => {
    const { payload } = props;
    return (
      <ul className='flex flex-wrap justify-center gap-3 text-xs mt-1'>
        {payload.map((entry: any, index: number) => (
          <li key={`legend-${index}`} className='flex items-center gap-1.5'>
            <div
              className='w-2.5 h-2.5 rounded-full'
              style={{ backgroundColor: entry.color }}
            />
            <span className='font-medium'>{entry.value}</span>
          </li>
        ))}
      </ul>
    );
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader className='pb-2'>
          <CardTitle className='text-base font-medium flex items-center gap-2'>
            <BarChart3 className='h-4 w-4' />
            Productivity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className='space-y-4'>
            <div className='flex justify-between'>
              <div className='space-y-1'>
                <Skeleton className='h-4 w-24' />
                <Skeleton className='h-3 w-16' />
              </div>
              <Skeleton className='h-10 w-10 rounded-full' />
            </div>
            <div className='space-y-2'>
              <Skeleton className='h-3 w-full' />
              <Skeleton className='h-3 w-full' />
              <Skeleton className='h-3 w-full' />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Calculate percentages
  const completedPercentage =
    stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0;
  const inProgressPercentage =
    stats.total > 0 ? Math.round((stats.inProgress / stats.total) * 100) : 0;
  const backlogPercentage =
    stats.total > 0 ? Math.round((stats.notStarted / stats.total) * 100) : 0;

  return (
    <Card className='h-full overflow-y-auto'>
      <CardHeader className='pb-1 pt-2 px-3 border-b'>
        <CardTitle className='text-sm flex items-center gap-1'>
          <BarChart3 className='h-4 w-4 text-primary' />
          Productivity Stats
        </CardTitle>
      </CardHeader>
      <CardContent className='p-3'>
        <div className='grid grid-cols-1 md:grid-cols-12 gap-3'>
          {/* Left side - Completion Rate and Status Bars */}
          <div className='md:col-span-7 space-y-3'>
            {/* Completion Rate Card */}
            <div className='flex items-center justify-between bg-primary/5 p-2 rounded-lg'>
              <div className='flex items-center gap-2'>
                <div className='h-7 w-7 rounded-full bg-primary/10 flex items-center justify-center'>
                  <BarChart3 className='h-3.5 w-3.5 text-primary' />
                </div>
                <div className='space-y-0.5'>
                  <h3 className='text-sm font-medium'>Completion Rate</h3>
                  <p className='text-xs text-muted-foreground'>
                    {stats.completed} of {stats.total} tasks
                  </p>
                </div>
              </div>
              <div className='h-11 w-11 rounded-full border flex items-center justify-center'>
                <span className='text-xs font-medium'>
                  {stats.completionRate.toFixed(0)}%
                </span>
              </div>
            </div>

            {/* Status bars */}
            <div className='space-y-2'>
              {/* Completed */}
              <div className='space-y-1'>
                <div className='flex items-center justify-between'>
                  <div className='flex items-center gap-1.5'>
                    <div className='w-2 h-2 rounded-full bg-success' />
                    <span className='text-xs font-medium'>Completed 🎉</span>
                  </div>
                  <div className='flex items-center gap-1.5'>
                    <Badge
                      variant='outline'
                      className='text-[10px] px-1 py-0 h-4 bg-success/10 text-success border-success/30'
                    >
                      {stats.completed}
                    </Badge>
                    <span className='text-xs font-medium text-success'>
                      {completedPercentage}%
                    </span>
                  </div>
                </div>
                <div className='h-2 bg-muted rounded-full overflow-hidden'>
                  <div
                    className='h-full bg-success rounded-full transition-all duration-500 ease-in-out'
                    style={{ width: `${completedPercentage}%` }}
                  />
                </div>
              </div>

              {/* In Progress */}
              <div className='space-y-1'>
                <div className='flex items-center justify-between'>
                  <div className='flex items-center gap-1.5'>
                    <div className='w-2 h-2 rounded-full bg-warning' />
                    <span className='text-xs font-medium'>In Progress 🚀</span>
                  </div>
                  <div className='flex items-center gap-1.5'>
                    <Badge
                      variant='outline'
                      className='text-[10px] px-1 py-0 h-4 bg-warning/10 text-warning border-warning/30'
                    >
                      {stats.inProgress}
                    </Badge>
                    <span className='text-xs font-medium text-warning'>
                      {inProgressPercentage}%
                    </span>
                  </div>
                </div>
                <div className='h-2 bg-muted rounded-full overflow-hidden'>
                  <div
                    className='h-full bg-warning rounded-full transition-all duration-500 ease-in-out'
                    style={{ width: `${inProgressPercentage}%` }}
                  />
                </div>
              </div>

              {/* Backlog */}
              <div className='space-y-1'>
                <div className='flex items-center justify-between'>
                  <div className='flex items-center gap-1.5'>
                    <div className='w-2 h-2 rounded-full bg-muted-foreground' />
                    <span className='text-xs font-medium'>Backlog 📝</span>
                  </div>
                  <div className='flex items-center gap-1.5'>
                    <Badge
                      variant='outline'
                      className='text-[10px] px-1 py-0 h-4'
                    >
                      {stats.notStarted}
                    </Badge>
                    <span className='text-xs font-medium'>
                      {backlogPercentage}%
                    </span>
                  </div>
                </div>
                <div className='h-2 bg-muted rounded-full overflow-hidden'>
                  <div
                    className='h-full bg-muted-foreground rounded-full transition-all duration-500 ease-in-out'
                    style={{ width: `${backlogPercentage}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Task Insights */}
            <div className='bg-card border rounded-lg p-2'>
              <div className='flex items-center gap-1 mb-1'>
                <TrendingUp className='h-3.5 w-3.5 text-primary' />
                <span className='text-xs font-medium'>Task Insights</span>
              </div>
              <div className='grid grid-cols-2 gap-2 text-xs'>
                <div className='flex flex-col'>
                  <span className='text-muted-foreground'>
                    Completion Trend
                  </span>
                  <span
                    className={`font-medium ${stats.completionRate >= 50 ? 'text-success' : 'text-destructive'}`}
                  >
                    {stats.completionRate >= 50
                      ? 'On Track'
                      : 'Needs Attention'}
                  </span>
                </div>
                <div className='flex flex-col'>
                  <span className='text-muted-foreground'>
                    Productivity Score
                  </span>
                  <span className='font-medium'>
                    {completedPercentage > 70
                      ? 'Excellent'
                      : completedPercentage > 40
                        ? 'Good'
                        : 'Improving'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right side - Pie Chart */}
          <div className='md:col-span-5'>
            <div className='h-[200px] flex items-center justify-center'>
              {stats.total > 0 ? (
                <ResponsiveContainer width='100%' height='100%'>
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx='50%'
                      cy='50%'
                      innerRadius={40}
                      outerRadius={65}
                      paddingAngle={2}
                      dataKey='value'
                      stroke='none'
                      nameKey='name'
                    >
                      {pieData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={entry.color}
                          strokeWidth={0}
                        />
                      ))}
                      <Label
                        color='text-muted-foreground'
                        content={({ viewBox }) => {
                          const { cx, cy } = viewBox as any;
                          return (
                            <text
                              x={cx}
                              y={cy}
                              textAnchor='middle'
                              dominantBaseline='middle'
                              className='text-xs font-medium'
                            >
                              <tspan
                                x={cx}
                                dy='-0.5em'
                                className='text-sm font-bold'
                              >
                                {stats.total}
                              </tspan>
                              <tspan
                                x={cx}
                                dy='1.5em'
                                className='text-xs text-muted-foreground'
                              >
                                Total Tasks
                              </tspan>
                            </text>
                          );
                        }}
                      />
                    </Pie>
                    <Tooltip content={<CustomPieTooltip />} />
                    <Legend
                      content={<CustomLegend />}
                      verticalAlign='bottom'
                      height={30}
                    />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className='flex flex-col items-center justify-center text-center'>
                  <PieChartIcon className='h-8 w-8 text-muted-foreground mb-2' />
                  <p className='text-xs text-muted-foreground'>
                    No task data available
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
