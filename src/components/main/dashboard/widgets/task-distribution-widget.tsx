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
  AlertTriangle,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';
import { useTheme } from 'next-themes';
import { Badge } from '@/components/ui/badge';

interface TaskDistributionData {
  HIGHEST: number;
  HIGH: number;
  MEDIUM: number;
  LOW: number;
  LOWEST: number;
}

interface TaskDistributionWidgetProps {
  data: TaskDistributionData;
  isLoading?: boolean;
}

export const TaskDistributionWidget = ({
  data,
  isLoading = false,
}: TaskDistributionWidgetProps) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  // Calculate total tasks
  const totalTasks = Object.values(data).reduce((sum, count) => sum + count, 0);

  // Prepare data for the pie chart with better colors for both themes
  const pieData = [
    {
      name: 'Highest',
      value: data.HIGHEST,
      color: isDark ? 'rgba(239, 68, 68, 0.9)' : 'rgba(220, 38, 38, 0.9)', // red
      icon: <AlertTriangle className='h-3 w-3' />,
    },
    {
      name: 'High',
      value: data.HIGH,
      color: isDark ? 'rgba(249, 115, 22, 0.9)' : 'rgba(234, 88, 12, 0.9)', // orange
      icon: <AlertCircle className='h-3 w-3' />,
    },
    {
      name: 'Medium',
      value: data.MEDIUM,
      color: isDark ? 'rgba(250, 204, 21, 0.9)' : 'rgba(202, 138, 4, 0.9)', // yellow
      icon: <AlertCircle className='h-3 w-3' />,
    },
    {
      name: 'Low',
      value: data.LOW,
      color: isDark ? 'rgba(74, 222, 128, 0.9)' : 'rgba(22, 163, 74, 0.9)', // green
      icon: <CheckCircle2 className='h-3 w-3' />,
    },
    {
      name: 'Lowest',
      value: data.LOWEST,
      color: isDark ? 'rgba(96, 165, 250, 0.9)' : 'rgba(59, 130, 246, 0.9)', // blue
      icon: <CheckCircle2 className='h-3 w-3' />,
    },
  ].filter((item) => item.value > 0);

  // Custom tooltip for the pie chart
  const CustomPieTooltip = ({
    active,
    payload,
  }: TooltipProps<number, string>) => {
    if (active && payload && payload.length > 0) {
      const data = payload[0].payload as any;
      return (
        <div className='bg-card border rounded-md shadow-sm p-2 text-xs text-foreground'>
          <p className='font-medium'>{data.name} Priority</p>
          <div className='flex items-center gap-1'>
            <div
              className='w-2 h-2 rounded-full'
              style={{ backgroundColor: data.color }}
            />
            <span>
              {data.value} tasks ({Math.round((data.value / totalTasks) * 100)}
              %)
            </span>
          </div>
        </div>
      );
    }
    return null;
  };

  // Custom legend renderer
  const CustomLegend = (props: any) => {
    const { payload } = props;
    return (
      <ul className='flex flex-wrap justify-center gap-3 text-xs mt-2'>
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
      <Card className='h-full'>
        <CardHeader className='pb-1 pt-2 px-3'>
          <CardTitle className='text-sm flex items-center gap-1'>
            <BarChart3 className='h-4 w-4 text-primary' />
            Task Distribution
          </CardTitle>
        </CardHeader>
        <CardContent className='p-2'>
          <div className='h-[140px] bg-muted rounded animate-pulse' />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className='h-full overflow-y-auto'>
      <CardHeader className='pb-1 pt-2 px-3 border-b'>
        <CardTitle className='text-sm flex items-center gap-1'>
          <BarChart3 className='h-4 w-4 text-primary' />
          Task Distribution by Priority
        </CardTitle>
      </CardHeader>
      <CardContent className='p-4'>
        {totalTasks > 0 ? (
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <div className='space-y-4'>
              <div className='bg-primary/5 p-3 rounded-lg mb-2'>
                <div className='text-xs font-medium'>Total Tasks</div>
                <div className='text-lg font-bold'>{totalTasks}</div>
              </div>

              <div className='space-y-3'>
                {pieData.map((entry, index) => {
                  const percentage = Math.round(
                    (entry.value / totalTasks) * 100
                  );

                  return (
                    <div key={`priority-${index}`} className='space-y-1'>
                      <div className='flex items-center justify-between'>
                        <div className='flex items-center gap-1.5'>
                          <div
                            className='w-2 h-2 rounded-full'
                            style={{ backgroundColor: entry.color }}
                          />
                          <span className='text-xs font-medium'>
                            {entry.name}
                          </span>
                        </div>
                        <div className='flex items-center gap-1.5'>
                          <Badge
                            variant='outline'
                            className='text-[10px] px-1 py-0 h-4'
                            style={{
                              backgroundColor: `${entry.color}15`,
                              color: entry.color,
                              borderColor: `${entry.color}30`,
                            }}
                          >
                            {entry.value}
                          </Badge>
                          <span
                            className='text-xs font-medium'
                            style={{ color: entry.color }}
                          >
                            {percentage}%
                          </span>
                        </div>
                      </div>
                      <div className='h-2 bg-muted rounded-full overflow-hidden'>
                        <div
                          className='h-full rounded-full transition-all duration-500 ease-in-out'
                          style={{
                            width: `${percentage}%`,
                            backgroundColor: entry.color,
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className='h-[240px] flex items-center justify-center'>
              <ResponsiveContainer width='100%' height='100%'>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx='50%'
                    cy='50%'
                    innerRadius={45}
                    outerRadius={75}
                    paddingAngle={2}
                    dataKey='value'
                    nameKey='name'
                    stroke='none'
                  >
                    {pieData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={entry.color}
                        strokeWidth={0}
                      />
                    ))}
                    <Label
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
                              {totalTasks}
                            </tspan>
                            <tspan
                              x={cx}
                              dy='1.5em'
                              className='text-xs text-muted-foreground'
                            >
                              Tasks
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
                    height={36}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        ) : (
          <div className='flex flex-col items-center justify-center h-[calc(100%-32px)] text-center'>
            <PieChartIcon className='h-8 w-8 text-muted-foreground mb-2' />
            <p className='text-sm text-muted-foreground'>
              No task data available
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
