'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import {
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  ResponsiveContainer,
} from 'recharts';
import { BarChart3, PieChart as PieChartIcon } from 'lucide-react';

interface AnalyticsWidgetProps {
  tasksByPriority: {
    priority: string;
    count: number;
    color: string;
  }[];
  taskCompletionTrend: {
    name: string;
    value: number;
  }[];
  isLoading?: boolean;
}

export const AnalyticsWidget = ({
  tasksByPriority,
  taskCompletionTrend,
  isLoading = false,
}: AnalyticsWidgetProps) => {
  if (isLoading) {
    return (
      <Card className='h-full'>
        <CardHeader className='pb-2'>
          <CardTitle className='text-xl flex items-center gap-2'>
            <BarChart3 className='h-5 w-5 text-primary' />
            Analytics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className='h-[200px] bg-muted rounded animate-pulse' />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className='h-full'>
      <CardHeader className='pb-2'>
        <CardTitle className='text-xl flex items-center gap-2'>
          <BarChart3 className='h-5 w-5 text-primary' />
          Analytics
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue='distribution'>
          <TabsList className='mb-4'>
            <TabsTrigger value='distribution'>
              Priority Distribution
            </TabsTrigger>
            <TabsTrigger value='trend'>Completion Trend</TabsTrigger>
          </TabsList>

          <TabsContent value='distribution'>
            <div className='h-[200px]'>
              <ChartContainer
                config={{
                  HIGHEST: {
                    label: 'Highest',
                    theme: {
                      light: 'hsl(var(--destructive))',
                      dark: 'hsl(var(--destructive))',
                    },
                  },
                  HIGH: {
                    label: 'High',
                    theme: {
                      light: 'hsl(var(--chart-1))',
                      dark: 'hsl(var(--chart-1))',
                    },
                  },
                  MEDIUM: {
                    label: 'Medium',
                    theme: {
                      light: 'hsl(var(--chart-2))',
                      dark: 'hsl(var(--chart-2))',
                    },
                  },
                  LOW: {
                    label: 'Low',
                    theme: {
                      light: 'hsl(var(--chart-3))',
                      dark: 'hsl(var(--chart-3))',
                    },
                  },
                  LOWEST: {
                    label: 'Lowest',
                    theme: {
                      light: 'hsl(var(--chart-4))',
                      dark: 'hsl(var(--chart-4))',
                    },
                  },
                }}
              >
                <PieChart>
                  <Pie
                    data={tasksByPriority}
                    dataKey='count'
                    nameKey='priority'
                    cx='50%'
                    cy='50%'
                    outerRadius={80}
                    label={({ name, percent }) =>
                      `${name} ${(percent * 100).toFixed(0)}%`
                    }
                  >
                    {tasksByPriority.map((entry) => (
                      <Cell
                        key={entry.priority}
                        fill={`var(--color-${entry.priority})`}
                      />
                    ))}
                  </Pie>
                  <ChartTooltip
                    content={
                      <ChartTooltipContent
                        labelFormatter={(value) => `${value} Priority`}
                        formatter={(value) => [`${value} tasks`, 'Count']}
                      />
                    }
                  />
                </PieChart>
              </ChartContainer>
            </div>
          </TabsContent>

          <TabsContent value='trend'>
            <div className='h-[200px]'>
              <ChartContainer
                config={{
                  value: {
                    label: 'Tasks Completed',
                    theme: {
                      light: 'hsl(var(--primary))',
                      dark: 'hsl(var(--primary))',
                    },
                  },
                }}
              >
                <AreaChart data={taskCompletionTrend}>
                  <defs>
                    <linearGradient id='colorValue' x1='0' y1='0' x2='0' y2='1'>
                      <stop
                        offset='5%'
                        stopColor='hsl(var(--primary))'
                        stopOpacity={0.8}
                      />
                      <stop
                        offset='95%'
                        stopColor='hsl(var(--primary))'
                        stopOpacity={0}
                      />
                    </linearGradient>
                  </defs>
                  <XAxis
                    dataKey='name'
                    stroke='#888888'
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    stroke='#888888'
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => `${value}`}
                  />
                  <Area
                    type='monotone'
                    dataKey='value'
                    stroke='hsl(var(--primary))'
                    fillOpacity={1}
                    fill='url(#colorValue)'
                  />
                  <ChartTooltip
                    content={
                      <ChartTooltipContent
                        formatter={(value) => [`${value} tasks`, 'Completed']}
                      />
                    }
                  />
                </AreaChart>
              </ChartContainer>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
