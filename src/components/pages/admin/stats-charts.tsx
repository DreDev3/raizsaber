'use client';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import {
  Area,
  AreaChart,
  CartesianGrid,
  XAxis
} from 'recharts';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart';
import { format } from 'date-fns';

type StatsChartsProps = {
  newUsersStats: StatsChartData[];
  purchasedCoursesStats: StatsChartData[];
};

const newAccountsChartConfig = {
  count: {
    label: 'Usuários',
    color: 'hsl(var(--chart-1))',
  }
} satisfies ChartConfig;

const purchasedCoursesChartConfig = {
  date: {
    label: 'Data',
    color: 'hsl(var(--chart-2))',
  },
  count: {
    label: 'Compras',
    color: 'hsl(var(--chart-2))',
  }
} satisfies ChartConfig;

export const StatsCharts = ({ newUsersStats, purchasedCoursesStats }: StatsChartsProps) => {
  return (
    <div className='w-full grid md:grid-cols-2 gap-8'>
      <Card>
        <CardHeader>
          <CardTitle>Novos Usuários</CardTitle>
          <CardDescription>Ultimos 7 dias</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={newAccountsChartConfig}>
            <AreaChart
              accessibilityLayer
              data={newUsersStats}
              margin={{
                left: 12,
                right: 12,
              }}
            >
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey='date'
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickFormatter={(value) => format(value, 'dd/MM')}
                interval='preserveStartEnd'
              />
              <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
              <defs>
                <linearGradient id='fillAccounts' x1='0' y1='0' x2='0' y2='1'>
                  <stop
                    offset='5%'
                    stopColor='var(--primary)'
                    stopOpacity={0.8}
                  />
                  <stop
                    offset='95%'
                    stopColor='var(--primary)'
                    stopOpacity={0.1}
                  />
                </linearGradient>

              </defs>
              <Area
                dataKey='count'
                type='monotone'
                fill='url(#fillAccounts)'
                fillOpacity={0.4}
                stroke='var(--primary)'
                stackId='a'
              />
            </AreaChart>
          </ChartContainer>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Cursos Comprados</CardTitle>
          <CardDescription>Ultimos 7 dias</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={purchasedCoursesChartConfig}>
            <AreaChart
              accessibilityLayer
              data={purchasedCoursesStats}
              margin={{
                left: 12,
                right: 12,
              }}
            >
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey='date'
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickFormatter={(value) => {
                  return new Date(value).toLocaleDateString('pt-BR', {
                    month: 'numeric',
                    day: 'numeric',
                  });
                }}
                interval='preserveStartEnd'
              />
              <ChartTooltip
                cursor={false}
                content={
                  <ChartTooltipContent
                    labelFormatter={(value, payload) => {
                      const rawDate = payload?.[0]?.payload?.date;

                      const dateToParse = rawDate || value;

                      const date = new Date(dateToParse);
                      return date.toLocaleDateString('pt-BR', {
                        month: 'numeric',
                        day: 'numeric',
                      });
                    }}
                    indicator='dot' />
                } />
              <defs>
                <linearGradient id='fillValue' x1='0' y1='0' x2='0' y2='1'>
                  <stop
                    offset='5%'
                    stopColor='var(--primary)'
                    stopOpacity={0.8}
                  />
                  <stop
                    offset='95%'
                    stopColor='var(--primary)'
                    stopOpacity={0.1}
                  />
                </linearGradient>

              </defs>
              <Area
                dataKey='count'
                type='monotone'
                fill='url(#fillValue)'
                fillOpacity={0.4}
                stroke='var(--primary)'
                stackId='a'
              />
            </AreaChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
};