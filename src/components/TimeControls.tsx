'use client';

import React from 'react';
import { Switch } from "@/src/components/ui/switch";
import { Button } from "@/src/components/ui/button";
import { Slider } from "@/src/components/ui/slider";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { TimeRange } from "@/src/types";

interface Props {
  timeRange: TimeRange;
  isTimeScroll: boolean;
  onTimeChange: (range: TimeRange) => void;
  onToggleTimeScroll: (enabled: boolean) => void;
}

export default function TimeControls({
  timeRange,
  isTimeScroll,
  onTimeChange,
  onToggleTimeScroll
}: Props) {
  const handleSliderChange = (value: number[]) => {
    onTimeChange({
      start: value[0],
      end: value[1]
    });
  };

  const moveTime = (direction: "back" | "forward") => {
    const span = timeRange.end - timeRange.start;
    const shift = direction === "back" ? -span : span;
    onTimeChange({
      start: timeRange.start + shift,
      end: timeRange.end + shift
    });
  };

  return (
    <div className="fixed w-full bg-white p-4 rounded shadow-lg">
      <div className="flex items-center gap-4 bg-white border rounded-lg">
        <Button
          variant="outline"
          size="icon"
          onClick={() => moveTime("back")}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        {timeRange.start}

        <div className="flex-1">
          <Slider
            min={-20000}
            max={2024}
            step={100}
            value={[timeRange.start, timeRange.end]}
            onValueChange={handleSliderChange}
            className="w-full"
          />
        </div>

        {timeRange.end}
        <Button
          variant="outline"
          size="icon"
          onClick={() => moveTime("forward")}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>

        {/* <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">Scroll for Time</span>
          <Switch
            checked={isTimeScroll}
            onCheckedChange={onToggleTimeScroll}
          />
        </div> */}
      </div>
    </div>
  );
}