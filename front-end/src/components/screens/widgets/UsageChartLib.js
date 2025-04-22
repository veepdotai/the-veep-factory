import { useEffect, useState } from 'react'

import { Logger } from 'react-logger-lib';

import { t } from 'src/components/lib/utils'

import { Container } from 'react-bootstrap';

import { CartesianGrid, Area, AreaChart, XAxis, YAxis } from 'recharts';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "src/components/ui/shadcn/card"
import { ChartConfig, ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent } from "src/components/ui/shadcn/chart"

import { scaleTime } from 'd3-scale'
import { timeFormat } from 'd3-time-format'
import { timeDay, timeHour, timeMinute, timeMonth, timeSecond, timeWeek, timeYear } from 'd3-time';

//export default function UsageChartLib() {

export const UsageChartLib = {
    log: Logger.of("UsageChartLib"),

    chart: function(data) {

        const chartConfig = {
            total_tokens: {
                label: "Total tokens",
                color: "hsl(12, 76%, 21%)",
    //            color: "hsl(var(--chart-total_tokens))",
            },
            completion_tokens: {
                label: "Completions tokens",
                color: "hsl(12, 76%, 56%)",
    //            color: "hsl(var(--chart-completion_tokens))",
            },
            prompt_tokens: {
                label: "Prompt tokens",
                color: "hsl(12, 76%, 21%)",
    //            color: "hsl(var(--chart-prompt_tokens))",
            },
        } //satisfies ChartConfig

        function getLinearGradient(id, stopColor = "", stop1 = "5%", stop2 = "95%" ) {
            let sc = stopColor || `var(--color-${id})`
            return (
                <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
                    <stop offset={stop1} stopColor={sc} stopOpacity={0.8} />
                    <stop offset={stop2} stopColor={sc} stopOpacity={0.1} />
                </linearGradient>
            )
        }

        const formatMillisecond = timeFormat('.%L'),
        formatSecond = timeFormat(':%S'),
        formatMinute = timeFormat('%I:%M'),
        formatHour = timeFormat('%I %p'),
        formatDay = timeFormat('%a %d'),
        formatWeek = timeFormat('%b %d'),
        formatMonth = timeFormat('%B'),
        formatYear = timeFormat('%Y');
        
        function multiFormat(date) {
            if (timeSecond(date) < date) {
              return formatMillisecond(date);
            }
            if (timeMinute(date) < date) {
              return formatSecond(date);
            }
            if (timeHour(date) < date) {
              return formatMinute(date);
            }
            if (timeDay(date) < date) {
              return formatHour(date);
            }
            if (timeMonth(date) < date) {
              if (timeWeek(date) < date) {
                return formatDay(date);
              }
              return formatWeek(date);
            }
            if (timeYear(date) < date) {
              return formatMonth(date);
            }
            return formatYear(date);
        }

        const timeValues = data.map(row => row.x);
        const numericValues = timeValues.map(time => time.valueOf());
        const timeScale = scaleTime().domain([Math.min(...numericValues), Math.max(...numericValues)]).nice();
        
        return (
            <Card>
                <CardHeader>
                    <CardTitle>{t("YourActivity")}</CardTitle>
                    <CardDescription>
                        {t("YourActivityDesc")}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <ChartContainer config={chartConfig}>
                        <AreaChart
                            accessibilityLayer
                            data={data}
                            margin={{
                                left: 12,
                                right: 12,
                            }}
                        >
                            <defs>
                                {getLinearGradient("total_tokens", "hsl(100, 50%, 25%)")}
                                {getLinearGradient("prompt_tokens", "hsl(100, 50%, 50%)")}
                                {getLinearGradient("completion_tokens", "hsl(100, 50%, 75%)")}
                            </defs>

                            <CartesianGrid vertical={false} />
                            <XAxis
                                type="number"
                                scale={timeScale}
                                domain={timeScale.domain().map(date => date.valueOf())}
                                dataKey="x"
                                ticks={timeScale.ticks(5).map(date => date.valueOf())}
                                tickFormatter={multiFormat}
                            />
                                {/*
                                tickFormatter={(value) => {
                                    const date = new Date(value)
                                    return date.toLocaleDateString("fr-FR", {
                                        month: "short",
                                        day: "numeric",
                                    })
                                }}
                                */}

                            {/*<YAxis type="number" domain={[0, 20000]} />*/}
                            <YAxis type="number" />

                            <ChartTooltip
                                cursor={false}
                                content={<ChartTooltipContent indicator="dot" />}
                            />
                            {/*
                            <Area
                                dataKey="total_tokens"
                                type="natural"
                                fill="url(#total_tokens)"
                                stroke="var(--color-total_tokens)"
                                fillOpacity={0.4}
                                stackId="a"
                            />
                            */}
                            <Area
                                dataKey="prompt_tokens"
                                type="natural"
                                fill="url(#prompt_tokens)"
                                stroke="var(--color-prompt_tokens)"
                                fillOpacity={0.4}
                                stackId="a"
                            />
                            <Area
                                dataKey="completion_tokens"
                                type="natural"
                                fill="url(#completion_tokens)"
                                stroke="var(--color-completion_tokens)"
                                fillOpacity={0.4}
                                stackId="a"
                            />
                        </AreaChart>
                        <ChartLegend content={<ChartLegendContent />} />
                    </ChartContainer>
                </CardContent>
                <CardFooter>
                    <div className="flex w-full items-start gap-2 text-sm">
                        <div className="grid gap-2">
                            <div className="flex items-center gap-2 font-medium leading-none">
                                {t("YourActivityFooter")}
                            </div>
                            <div className="flex items-center gap-2 leading-none text-muted-foreground">
                                {t("YourActivityFooterDesc")}
                            </div>
                        </div>
                    </div>
                </CardFooter>
            </Card>

)
    },

    widget: function(title, desc, content, footer = "", cn = "") {
        return (
            <Card className={cn}>
                <CardHeader>
                    <CardTitle className="text-sm font-medium">{title}</CardTitle>
                    <CardDescription className="">{desc}</CardDescription>
                </CardHeader>
                <CardContent className="text-2xl font-bold">
                    {content}
                </CardContent>
                { footer && 
                    <CardFooter className="text-sm text-muted-foreground">
                        {footer}
                    </CardFooter>
                }
            </Card>
        )
    }

}
