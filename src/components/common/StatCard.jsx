import React from 'react';
import { cn } from '@/lib/utils';
import { Card } from '@/components/ui/card';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

const StatCard = ({
                    title,
                    value,
                    change,
                    changeLabel,
                    icon,
                    color = 'bg-primary',
                    onClick,
                  }) => {
  const isPositive = change && change > 0;
  const isValuePositive = value && parseInt(value) >= 0;
  const isValueNegative = value && parseInt(value) < 0;
  const isNegative = change && change < 0;

  return (
      <Card
          className={cn(
              "p-5 transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 cursor-pointer",
              onClick && "cursor-pointer"
          )}
          onClick={onClick}
      >
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className={`text-2xl font-bold ${isValuePositive ? 'text-foreground' : 'text-red-500'}`}>{value}</p>
            {change !== undefined && (
                <div className="flex items-center gap-1">
                  {isPositive ? (
                      <ArrowUpRight className="w-4 h-4 text-green-500" />
                  ) : isNegative ? (
                      <ArrowDownRight className="w-4 h-4 text-red-500" />
                  ) : null}
                  <span className={cn(
                      "text-xs font-medium",
                      isPositive && "text-green-600",
                      isNegative && "text-red-600",
                      !isPositive && !isNegative && "text-muted-foreground"
                  )}>
                {change > 0 ? '+' : ''}{change}%
              </span>
                  {changeLabel && (
                      <span className="text-xs text-muted-foreground">{changeLabel}</span>
                  )}
                </div>
            )}
          </div>
          <div className={cn("p-3 rounded-xl", color)}>
            <div className="text-white">{icon}</div>
          </div>
        </div>
      </Card>
  );
};

export default StatCard;