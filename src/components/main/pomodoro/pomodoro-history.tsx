'use client';

import { useState, useEffect } from 'react';
import { format, isValid, parseISO } from 'date-fns';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { usePomodoroStore } from '@/store/pomodoro-store';
import { useTheme } from 'next-themes';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  CartesianGrid,
  Legend,
  Area,
  AreaChart,
} from 'recharts';
import {
  Clock,
  BarChart3,
  PieChart as PieChartIcon,
  Trash2,
  Calendar,
  Target,
  TrendingUp,
  Award,
  Clock4,
  Flame,
  Zap,
} from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { toast } from 'sonner';

// Theme-aware colors for charts
const getChartColors = (theme: string) => {
  const baseColors = {
    primary: '#0088FE',
    secondary: '#00C49F',
    accent1: '#FFBB28',
    accent2: '#FF8042',
    accent3: '#8884D8',
    accent4: '#82ca9d',
    muted: theme === 'dark' ? '#666' : '#ccc',
  };

  return {
    bar: baseColors.primary,
    pie: [
      baseColors.primary,
      baseColors.secondary,
      baseColors.accent1,
      baseColors.accent2,
      baseColors.accent3,
    ],
    line: baseColors.secondary,
    area: baseColors.accent4,
    grid: baseColors.muted,
  };
};

export function PomodoroHistory() {
  const { completedSessions, clearCompletedSessions } = usePomodoroStore();
  const [chartView, setChartView] = useState<'daily' | 'weekly' | 'monthly'>(
    'daily'
  );
  const [analyticsView, setAnalyticsView] = useState<
    'duration' | 'count' | 'trend'
  >('duration');
  const { theme = 'light' } = useTheme();
  const [chartColors, setChartColors] = useState(
    getChartColors(theme || 'light')
  );

  // Update chart colors when theme changes
  useEffect(() => {
    setChartColors(getChartColors(theme || 'light'));
  }, [theme]);

  // Format time in minutes
  const formatMinutes = (seconds: number) => {
    return Math.round(seconds / 60);
  };

  // Safely format dates to prevent invalid date errors
  const safeFormatDate = (dateValue: Date | string | number) => {
    try {
      // If it's a string that might be ISO format
      if (typeof dateValue === 'string') {
        const parsedDate = parseISO(dateValue);
        if (isValid(parsedDate)) {
          return format(parsedDate, 'MMM d, h:mm a');
        }
      }

      // If it's a Date object or timestamp
      const date = new Date(dateValue);
      if (isValid(date)) {
        return format(date, 'MMM d, h:mm a');
      }

      return 'Invalid date';
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Invalid date';
    }
  };

  // Prepare data for daily chart
  const getDailyData = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      return date;
    }).reverse();

    return last7Days.map((date) => {
      const sessionsOnDay = completedSessions.filter((session) => {
        try {
          const sessionDate = new Date(session.completedAt);
          return (
            sessionDate.getDate() === date.getDate() &&
            sessionDate.getMonth() === date.getMonth() &&
            sessionDate.getFullYear() === date.getFullYear()
          );
        } catch (error) {
          return false;
        }
      });

      const totalMinutes = sessionsOnDay.reduce(
        (total, session) => total + formatMinutes(session.duration),
        0
      );

      return {
        date: format(date, 'EEE'),
        fullDate: format(date, 'MMM dd'),
        minutes: totalMinutes,
        sessions: sessionsOnDay.length,
        averageDuration:
          sessionsOnDay.length > 0
            ? Math.round(totalMinutes / sessionsOnDay.length)
            : 0,
      };
    });
  };

  // Prepare data for weekly chart
  const getWeeklyData = () => {
    const today = new Date();
    const currentWeek = getWeekNumber(today);

    const last4Weeks = Array.from({ length: 4 }, (_, i) => {
      const date = new Date(today);
      date.setDate(date.getDate() - i * 7);
      return {
        weekNumber: getWeekNumber(date),
        startDate: getStartOfWeek(date),
      };
    }).reverse();

    return last4Weeks.map(({ weekNumber, startDate }) => {
      const sessionsInWeek = completedSessions.filter((session) => {
        try {
          const sessionDate = new Date(session.completedAt);
          return getWeekNumber(sessionDate) === weekNumber;
        } catch (error) {
          return false;
        }
      });

      const totalMinutes = sessionsInWeek.reduce(
        (total, session) => total + formatMinutes(session.duration),
        0
      );

      return {
        date: `Week ${weekNumber}`,
        fullDate: format(startDate, 'MMM dd'),
        minutes: totalMinutes,
        sessions: sessionsInWeek.length,
        averageDuration:
          sessionsInWeek.length > 0
            ? Math.round(totalMinutes / sessionsInWeek.length)
            : 0,
      };
    });
  };

  // Prepare data for monthly chart
  const getMonthlyData = () => {
    const today = new Date();

    const last6Months = Array.from({ length: 6 }, (_, i) => {
      const date = new Date(today.getFullYear(), today.getMonth() - i, 1);
      return date;
    }).reverse();

    return last6Months.map((date) => {
      const sessionsInMonth = completedSessions.filter((session) => {
        try {
          const sessionDate = new Date(session.completedAt);
          return (
            sessionDate.getMonth() === date.getMonth() &&
            sessionDate.getFullYear() === date.getFullYear()
          );
        } catch (error) {
          return false;
        }
      });

      const totalMinutes = sessionsInMonth.reduce(
        (total, session) => total + formatMinutes(session.duration),
        0
      );

      return {
        date: format(date, 'MMM'),
        fullDate: format(date, 'MMMM yyyy'),
        minutes: totalMinutes,
        sessions: sessionsInMonth.length,
        averageDuration:
          sessionsInMonth.length > 0
            ? Math.round(totalMinutes / sessionsInMonth.length)
            : 0,
      };
    });
  };

  // Helper function to get week number
  const getWeekNumber = (date: Date) => {
    const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
    const pastDaysOfYear =
      (date.getTime() - firstDayOfYear.getTime()) / 86400000;
    return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
  };

  // Helper function to get start of week
  const getStartOfWeek = (date: Date) => {
    const result = new Date(date);
    result.setDate(result.getDate() - result.getDay());
    return result;
  };

  // Get chart data based on current view
  const getChartData = () => {
    switch (chartView) {
      case 'daily':
        return getDailyData();
      case 'weekly':
        return getWeeklyData();
      case 'monthly':
        return getMonthlyData();
      default:
        return getDailyData();
    }
  };

  const chartData = getChartData();

  // Prepare data for pie chart
  const pieData = [
    { name: '< 25 min', value: 0 },
    { name: '25-30 min', value: 0 },
    { name: '30-45 min', value: 0 },
    { name: '45+ min', value: 0 },
  ];

  completedSessions.forEach((session) => {
    const minutes = formatMinutes(session.duration);
    if (minutes < 25) {
      pieData[0].value += 1;
    } else if (minutes >= 25 && minutes < 30) {
      pieData[1].value += 1;
    } else if (minutes >= 30 && minutes < 45) {
      pieData[2].value += 1;
    } else {
      pieData[3].value += 1;
    }
  });

  // Calculate productivity stats
  const totalSessions = completedSessions.length;
  const totalMinutes = completedSessions.reduce(
    (total, session) => total + formatMinutes(session.duration),
    0
  );
  const averageSessionLength =
    totalSessions > 0 ? Math.round(totalMinutes / totalSessions) : 0;

  // Get most productive day
  const dailyData = getDailyData();
  const mostProductiveDay = [...dailyData].sort(
    (a, b) => b.minutes - a.minutes
  )[0];

  // Custom tooltip for charts
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <Card className='p-2 bg-background border shadow-sm'>
          <div className='text-sm font-medium'>{data.fullDate}</div>
          <div className='text-xs text-muted-foreground'>
            {data.minutes} minutes ({data.sessions} sessions)
          </div>
          {data.averageDuration > 0 && (
            <div className='text-xs text-muted-foreground'>
              Avg: {data.averageDuration} min/session
            </div>
          )}
        </Card>
      );
    }
    return null;
  };

  // Handle clear history
  const handleClearHistory = () => {
    clearCompletedSessions();
    toast.success('History Cleared', {
      description: 'Your Pomodoro session history has been cleared.',
    });
  };

  // Get trend data for line chart
  const getTrendData = () => {
    const data =
      chartView === 'daily'
        ? getDailyData()
        : chartView === 'weekly'
          ? getWeeklyData()
          : getMonthlyData();

    return data.map((item) => ({
      name: item.date,
      fullDate: item.fullDate,
      minutes: item.minutes,
      sessions: item.sessions,
      average: item.averageDuration,
    }));
  };

  return (
    <div className='space-y-6'>
      {completedSessions.length === 0 ? (
        <div className='text-center py-12'>
          <div className='flex justify-center mb-4'>
            <Clock className='h-12 w-12 text-muted-foreground opacity-50' />
          </div>
          <h3 className='text-lg font-medium mb-2'>
            No sessions completed yet
          </h3>
          <p className='text-muted-foreground max-w-md mx-auto'>
            Complete a Pomodoro session to see your productivity stats and
            history. Your progress will be tracked and visualized here.
          </p>
        </div>
      ) : (
        <>
          {/* Stats Overview Cards */}
          <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
            <Card className='bg-background/60 backdrop-blur-sm border-border/30 shadow-sm'>
              <CardContent className='pt-6'>
                <div className='flex items-center justify-between'>
                  <div>
                    <p className='text-sm font-medium text-muted-foreground'>
                      Total Focus Time
                    </p>
                    <h3 className='text-2xl font-bold mt-1'>
                      {totalMinutes} min
                    </h3>
                  </div>
                  <div className='h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center'>
                    <Clock className='h-6 w-6 text-primary' />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className='bg-background/60 backdrop-blur-sm border-border/30 shadow-sm'>
              <CardContent className='pt-6'>
                <div className='flex items-center justify-between'>
                  <div>
                    <p className='text-sm font-medium text-muted-foreground'>
                      Completed Sessions
                    </p>
                    <h3 className='text-2xl font-bold mt-1'>{totalSessions}</h3>
                  </div>
                  <div className='h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center'>
                    <Target className='h-6 w-6 text-primary' />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className='bg-background/60 backdrop-blur-sm border-border/30 shadow-sm'>
              <CardContent className='pt-6'>
                <div className='flex items-center justify-between'>
                  <div>
                    <p className='text-sm font-medium text-muted-foreground'>
                      Average Session
                    </p>
                    <h3 className='text-2xl font-bold mt-1'>
                      {averageSessionLength} min
                    </h3>
                  </div>
                  <div className='h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center'>
                    <TrendingUp className='h-6 w-6 text-primary' />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Chart Controls */}
          <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4'>
            <div className='flex flex-col gap-2'>
              <h3 className='text-lg font-medium'>Productivity Analytics</h3>
              <div className='flex gap-2'>
                <Tabs
                  value={chartView}
                  onValueChange={(value) =>
                    setChartView(value as 'daily' | 'weekly' | 'monthly')
                  }
                  className='w-auto'
                >
                  <TabsList className='grid w-[240px] grid-cols-3'>
                    <TabsTrigger value='daily'>Daily</TabsTrigger>
                    <TabsTrigger value='weekly'>Weekly</TabsTrigger>
                    <TabsTrigger value='monthly'>Monthly</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
            </div>

            <div className='flex items-center gap-2'>
              <Tabs
                value={analyticsView}
                onValueChange={(value) =>
                  setAnalyticsView(value as 'duration' | 'count' | 'trend')
                }
                className='w-auto'
              >
                <TabsList className='grid w-[240px] grid-cols-3'>
                  <TabsTrigger value='duration'>Duration</TabsTrigger>
                  <TabsTrigger value='count'>Sessions</TabsTrigger>
                  <TabsTrigger value='trend'>Trends</TabsTrigger>
                </TabsList>
              </Tabs>

              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant='outline'
                    size='icon'
                    className='h-8 w-8 rounded-full border-border/30 bg-background/60 backdrop-blur-sm'
                  >
                    <Trash2 className='h-4 w-4' />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent className='bg-background/95 backdrop-blur-md border-border/30'>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Clear History</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to clear your Pomodoro session
                      history? This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleClearHistory}>
                      Clear
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>

          {/* Main Chart */}
          <Card className='bg-background/60 backdrop-blur-sm border-border/30 shadow-sm p-4'>
            <div className='h-[250px] w-full'>
              {analyticsView === 'duration' && (
                <ResponsiveContainer width='100%' height='100%'>
                  <BarChart
                    data={chartData}
                    margin={{ top: 10, right: 10, left: 0, bottom: 20 }}
                  >
                    <CartesianGrid
                      strokeDasharray='3 3'
                      stroke={chartColors.grid}
                      vertical={false}
                    />
                    <XAxis
                      dataKey='date'
                      tick={{ fontSize: 12 }}
                      tickLine={false}
                      axisLine={{ stroke: chartColors.grid, strokeWidth: 1 }}
                    />
                    <YAxis
                      tick={{ fontSize: 12 }}
                      tickLine={false}
                      axisLine={{ stroke: chartColors.grid, strokeWidth: 1 }}
                      tickFormatter={(value) => `${value}m`}
                    />
                    <RechartsTooltip content={<CustomTooltip />} />
                    <Bar
                      dataKey='minutes'
                      fill={chartColors.bar}
                      radius={[4, 4, 0, 0]}
                      animationDuration={500}
                    />
                  </BarChart>
                </ResponsiveContainer>
              )}

              {analyticsView === 'count' && (
                <ResponsiveContainer width='100%' height='100%'>
                  <BarChart
                    data={chartData}
                    margin={{ top: 10, right: 10, left: 0, bottom: 20 }}
                  >
                    <CartesianGrid
                      strokeDasharray='3 3'
                      stroke={chartColors.grid}
                      vertical={false}
                    />
                    <XAxis
                      dataKey='date'
                      tick={{ fontSize: 12 }}
                      tickLine={false}
                      axisLine={{ stroke: chartColors.grid, strokeWidth: 1 }}
                    />
                    <YAxis
                      tick={{ fontSize: 12 }}
                      tickLine={false}
                      axisLine={{ stroke: chartColors.grid, strokeWidth: 1 }}
                    />
                    <RechartsTooltip content={<CustomTooltip />} />
                    <Bar
                      dataKey='sessions'
                      fill={chartColors.bar}
                      radius={[4, 4, 0, 0]}
                      animationDuration={500}
                    />
                  </BarChart>
                </ResponsiveContainer>
              )}

              {analyticsView === 'trend' && (
                <ResponsiveContainer width='100%' height='100%'>
                  <AreaChart
                    data={getTrendData()}
                    margin={{ top: 10, right: 10, left: 0, bottom: 20 }}
                  >
                    <CartesianGrid
                      strokeDasharray='3 3'
                      stroke={chartColors.grid}
                      vertical={false}
                    />
                    <XAxis
                      dataKey='name'
                      tick={{ fontSize: 12 }}
                      tickLine={false}
                      axisLine={{ stroke: chartColors.grid, strokeWidth: 1 }}
                    />
                    <YAxis
                      tick={{ fontSize: 12 }}
                      tickLine={false}
                      axisLine={{ stroke: chartColors.grid, strokeWidth: 1 }}
                    />
                    <RechartsTooltip content={<CustomTooltip />} />
                    <Area
                      type='monotone'
                      dataKey='minutes'
                      stroke={chartColors.line}
                      fill={chartColors.line + '40'}
                      activeDot={{ r: 6 }}
                      animationDuration={500}
                    />
                    <Area
                      type='monotone'
                      dataKey='average'
                      stroke={chartColors.area}
                      fill={chartColors.area + '20'}
                      activeDot={{ r: 6 }}
                      animationDuration={500}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              )}
            </div>
          </Card>

          {/* Secondary Analytics */}
          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            {/* Session Distribution */}
            <Card className='bg-background/60 backdrop-blur-sm border-border/30 shadow-sm p-4'>
              <CardHeader className='p-0 pb-4'>
                <CardTitle className='text-base font-medium flex items-center'>
                  <PieChartIcon className='h-4 w-4 mr-2' />
                  Session Duration Distribution
                </CardTitle>
              </CardHeader>
              <div className='h-[200px]'>
                <ResponsiveContainer width='100%' height='100%'>
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx='50%'
                      cy='50%'
                      labelLine={false}
                      outerRadius={80}
                      innerRadius={40}
                      fill='#8884d8'
                      dataKey='value'
                      nameKey='name'
                      label={({ name, percent }) =>
                        percent > 0
                          ? `${name} (${(percent * 100).toFixed(0)}%)`
                          : ''
                      }
                      animationDuration={500}
                    >
                      {pieData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={chartColors.pie[index % chartColors.pie.length]}
                        />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </Card>

            {/* Recent Sessions */}
            <Card className='bg-background/60 backdrop-blur-sm border-border/30 shadow-sm p-4'>
              <CardHeader className='p-0 pb-4'>
                <CardTitle className='text-base font-medium flex items-center'>
                  <Clock className='h-4 w-4 mr-2' />
                  Recent Sessions
                </CardTitle>
              </CardHeader>
              <ScrollArea className='h-[200px] pr-4'>
                <div className='space-y-3'>
                  {completedSessions.slice(0, 10).map((session, index) => (
                    <div
                      key={index}
                      className='flex justify-between items-center p-3 rounded-lg bg-background/80 border border-border/20 hover:border-border/40 transition-all duration-200'
                    >
                      <div className='flex items-center gap-3'>
                        <div className='h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center'>
                          <Zap className='h-4 w-4 text-primary' />
                        </div>
                        <div>
                          <p className='font-medium truncate max-w-[150px]'>
                            {session.goal}
                          </p>
                          <p className='text-xs text-muted-foreground'>
                            {safeFormatDate(session.completedAt)}
                          </p>
                        </div>
                      </div>
                      <Badge
                        variant='outline'
                        className='bg-background/60 backdrop-blur-sm'
                      >
                        {formatMinutes(session.duration)} min
                      </Badge>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </Card>
          </div>

          {/* Productivity Insights */}
          <Card className='bg-background/60 backdrop-blur-sm border-border/30 shadow-sm'>
            <CardHeader>
              <CardTitle className='text-base font-medium flex items-center'>
                <Flame className='h-4 w-4 mr-2' />
                Productivity Insights
              </CardTitle>
              <CardDescription>
                Summary of your Pomodoro productivity patterns
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <div className='space-y-4'>
                  <div className='flex items-center gap-3'>
                    <div className='h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center'>
                      <Award className='h-5 w-5 text-primary' />
                    </div>
                    <div>
                      <p className='text-sm text-muted-foreground'>
                        Most Productive Day
                      </p>
                      <p className='font-medium'>
                        {mostProductiveDay?.fullDate || 'N/A'}
                      </p>
                    </div>
                  </div>

                  <div className='flex items-center gap-3'>
                    <div className='h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center'>
                      <Clock4 className='h-5 w-5 text-primary' />
                    </div>
                    <div>
                      <p className='text-sm text-muted-foreground'>
                        Average Session Length
                      </p>
                      <p className='font-medium'>
                        {averageSessionLength} minutes
                      </p>
                    </div>
                  </div>
                </div>

                <div className='space-y-4'>
                  <div className='flex items-center gap-3'>
                    <div className='h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center'>
                      <Calendar className='h-5 w-5 text-primary' />
                    </div>
                    <div>
                      <p className='text-sm text-muted-foreground'>
                        Total Sessions
                      </p>
                      <p className='font-medium'>{totalSessions} sessions</p>
                    </div>
                  </div>

                  <div className='flex items-center gap-3'>
                    <div className='h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center'>
                      <Flame className='h-5 w-5 text-primary' />
                    </div>
                    <div>
                      <p className='text-sm text-muted-foreground'>
                        Total Focus Time
                      </p>
                      <p className='font-medium'>{totalMinutes} minutes</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
