
"use client";

import React from 'react';
import { cn } from '@/lib/utils';

interface GaugeProps {
  value: number; // Current value
  maxValue: number; // Max value for the gauge scale
  label: string;
  unit: string;
  size?: number; // Diameter of the gauge in pixels
  strokeWidth?: number; // Thickness of the gauge arc
}

const Gauge: React.FC<GaugeProps> = ({
  value,
  maxValue,
  label,
  unit,
  size = 180, // Default size
  strokeWidth = 20, // Default stroke width
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * Math.PI; // Semi-circle
  const offset = circumference - (Math.min(value, maxValue) / maxValue) * circumference;

  const percentage = Math.min((value / maxValue) * 100, 100);

  const gradientId = `gaugeGradient-${label.replace(/\s+/g, '')}`;

  return (
    <div className="flex flex-col items-center p-4 rounded-lg shadow-md bg-card" style={{ width: size }}>
      <svg width={size} height={size / 2} viewBox={`0 0 ${size} ${size / 2}`} className="transform ">
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="hsl(var(--accent))" />
            <stop offset={`${Math.max(0, percentage - 20)}%`} stopColor="hsl(var(--accent))" />
            <stop offset={`${percentage}%`} stopColor="hsl(var(--primary))" />
            <stop offset="100%" stopColor="hsl(var(--primary))" />
          </linearGradient>
        </defs>
        {/* Background Arc */}
        <path
          d={`M ${strokeWidth / 2} ${size / 2} A ${radius} ${radius} 0 0 1 ${size - strokeWidth / 2} ${size / 2}`}
          fill="none"
          stroke="hsl(var(--muted))"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
        />
        {/* Value Arc */}
        {value > 0 && (
          <path
            d={`M ${strokeWidth / 2} ${size / 2} A ${radius} ${radius} 0 0 1 ${size - strokeWidth / 2} ${size / 2}`}
            fill="none"
            stroke={`url(#${gradientId})`}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
          />
        )}
      </svg>
      <div className="mt-[-20px] text-center relative z-10">
        <div className="text-2xl lg:text-3xl font-bold text-foreground">
          {value.toFixed(value < 10 && value !== 0 ? 1 : 0)}
          <span className="text-sm text-muted-foreground ml-1">{unit}</span>
        </div>
        <div className="text-sm lg:text-base text-muted-foreground">{label}</div>
      </div>
    </div>
  );
};

export default Gauge;
