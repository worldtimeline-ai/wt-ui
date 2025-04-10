import React, { useState, useEffect, useRef } from 'react';
import TopLoadingBar from "../components/TopLoadingBar";

const YearRangeSelector = (props: any) => {
    const { isLoading, mapState, setMapState } = props;
    const CURRENT_YEAR = 2025;
    const EARLIEST_YEAR = -3000;
    const DEFAULT_START_YEAR = mapState.year.start;
    const DEFAULT_END_YEAR = mapState.year.end;

    const [selectedRange, setSelectedRange] = useState({ start: DEFAULT_START_YEAR, end: DEFAULT_END_YEAR });
    const [viewWindow, setViewWindow] = useState({ start: DEFAULT_START_YEAR - 45, end: DEFAULT_END_YEAR });
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState(0);
    const [wasDragging, setWasDragging] = useState(false);
    const [activeDragHandle, setActiveDragHandle] = useState(null);

    const timelineRef = useRef<any>(null);

    useEffect(() => {
        setMapState({
            ...mapState,
            year: {
                start: selectedRange.start,
                end: selectedRange.end,
            }
        });
    }, [selectedRange]);

    // Function to add/remove years from view window start or end
    const adjustViewWindow = (position: string, amount: number) => {
        setViewWindow(prev => {
            if (position === 'start') {
                const newStart = Math.max(EARLIEST_YEAR, prev.start - amount);
                return { ...prev, start: newStart };
            } else {
                const newEnd = Math.min(CURRENT_YEAR, prev.end + amount);
                return { ...prev, end: newEnd };
            }
        });
    };

    // Handle click on timeline to set selection to ±5 years from clicked point
    const handleTimelineClick = (e: { clientX: number; }) => {
        // Ignore if we're already in a dragging operation
        if (isDragging || wasDragging) return;

        // Calculate the year based on click position
        const timelineRect = timelineRef.current?.getBoundingClientRect();
        const relativeX = e.clientX - timelineRect.left;
        const clickedYear = positionToYear(relativeX);

        // Set selection to ±5 years from click point, respecting bounds
        const startYear = Math.max(EARLIEST_YEAR, clickedYear - 5);
        const endYear = Math.min(CURRENT_YEAR, clickedYear + 5);

        setSelectedRange({
            start: startYear,
            end: endYear
        });
    };

    // Handle scroll to change visible range
    const handleScroll = (e: any) => {
        e.stopPropagation();

        const scrollAmount = e.deltaX * 0.5; // Adjust sensitivity
        let animationFrameId: number = 0;

        const updateViewWindow = () => {
            setViewWindow((prev) => {
                const range = prev.end - prev.start;
                let newStart = Math.max(EARLIEST_YEAR, prev.start + scrollAmount);
                let newEnd = Math.min(CURRENT_YEAR, newStart + range);

                // Adjust if we hit the upper bound
                if (newEnd === CURRENT_YEAR) {
                    newStart = newEnd - range;
                }

                return { start: newStart, end: newEnd };
            });
        };

        cancelAnimationFrame(animationFrameId);
        animationFrameId = requestAnimationFrame(updateViewWindow);
    };


    // Convert year to pixel position
    const yearToPosition = (year: number) => {
        const timelineWidth = timelineRef.current ? timelineRef.current.offsetWidth : 1000;
        const viewRange = viewWindow.end - viewWindow.start;
        return ((year - viewWindow.start) / viewRange) * timelineWidth;
    };

    // Convert pixel position to year
    const positionToYear = (position: number) => {
        const timelineWidth = timelineRef.current ? timelineRef.current.offsetWidth : 1000;
        const viewRange = viewWindow.end - viewWindow.start;
        return Math.round(viewWindow.start + (position / timelineWidth) * viewRange);
    };

    // Mouse handlers for dragging
    const handleMouseDown = (e: any, handle: any) => {
        e.stopPropagation();
        setIsDragging(true);
        setDragStart(e.clientX);
        setActiveDragHandle(handle);
    };

    const handleMouseMove = (e: any) => {
        if (!isDragging) return;

        const deltaX = e.clientX - dragStart;
        const timelineRect = timelineRef.current.getBoundingClientRect();
        const relativeX = e.clientX - timelineRect.left;
        const newPosition = Math.max(0, Math.min(timelineRect.width, relativeX));
        const newYear = positionToYear(newPosition);

        setSelectedRange(prev => {
            if (activeDragHandle === 'start') {
                return { ...prev, start: Math.min(prev.end - 1, newYear) };
            } else if (activeDragHandle === 'end') {
                return { ...prev, end: Math.max(prev.start + 1, newYear) };
            } else if (activeDragHandle === 'middle') {
                const rangeSize = prev.end - prev.start;
                const deltaYear = positionToYear(dragStart + deltaX) - positionToYear(dragStart);

                let newStart = prev.start + deltaYear;
                let newEnd = prev.end + deltaYear;

                // Ensure range stays within bounds
                if (newStart < EARLIEST_YEAR) {
                    newStart = EARLIEST_YEAR;
                    newEnd = newStart + rangeSize;
                } else if (newEnd > CURRENT_YEAR) {
                    newEnd = CURRENT_YEAR;
                    newStart = newEnd - rangeSize;
                }

                return { start: newStart, end: newEnd };
            }
            return prev;
        });

        setDragStart(e.clientX);
    };

    const handleMouseUp = (e: any) => {
        e.stopPropagation();
        setIsDragging(false);
        setActiveDragHandle(null);
        setWasDragging(true);
        setTimeout(() => setWasDragging(false), 100);
    };

    // Effect to add document-level event listeners
    useEffect(() => {
        if (isDragging) {
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
        }

        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isDragging, dragStart]);

    // Calculate tick positions based on visible range
    const getTimelineTicks = () => {
        const viewRange = viewWindow.end - viewWindow.start;
        let tickInterval;

        // Adapt tick interval based on visible range
        if (viewRange > 1000) tickInterval = 500;
        else if (viewRange > 500) tickInterval = 100;
        else if (viewRange > 100) tickInterval = 50;
        else if (viewRange > 50) tickInterval = 10;
        else tickInterval = 5;

        const firstTick = Math.ceil(viewWindow.start / tickInterval) * tickInterval;
        const ticks = [];

        for (let year = firstTick; year <= viewWindow.end; year += tickInterval) {
            // Format year label (BCE/CE)
            let label = year <= 0 ? `${Math.abs(year)} BCE` : `${year} CE`;

            // Special cases for important years
            if (year === 0) label = "1 CE";
            if (year === -1) label = "1 BCE";

            ticks.push({
                year,
                position: yearToPosition(year),
                label
            });
        }

        return ticks;
    };

    return (
        <div className="w-full flex flex-col gap-0 max-w-4xl mx-auto pt-4">
            <div className="flex items-center relative gap-1">
                <button
                    className="bg-blue-500 text-white rounded-lg text-xs h-8 w-10 flex items-center justify-center"
                    onClick={() => adjustViewWindow('start', 10)}
                >
                    -10
                </button>

                <div
                    className={`w-full h-8 bg-gray-100 rounded-lg relative mx-2 overflow-hidden cursor-pointer ${isLoading ? 'rounded-b-none' : ''}`}
                    onWheel={handleScroll}
                    onClick={handleTimelineClick}
                    ref={timelineRef}
                >
                    {/* Timeline ticks */}
                    {getTimelineTicks().map((tick) => (
                        <div
                            key={tick.year}
                            className="absolute bottom-0 h-6 border-l border-gray-400"
                            style={{ left: `${tick.position}px` }}
                        >
                            <div className="text-xs text-gray-600 ml-1">{tick.label}</div>
                        </div>
                    ))}

                    {/* Selected range */}
                    <div
                        className="absolute top-0 h-10 bg-blue-300 opacity-50 cursor-move"
                        style={{
                            left: `${yearToPosition(selectedRange.start)}px`,
                            width: `${yearToPosition(selectedRange.end) - yearToPosition(selectedRange.start)}px`
                        }}
                        onMouseDown={(e) => handleMouseDown(e, 'middle')}
                    />

                    {/* Start handle */}
                    <div
                        className="absolute top-0 h-10 w-1 bg-blue-600 cursor-ew-resize"
                        style={{ left: `${yearToPosition(selectedRange.start) - 2}px` }}
                        onMouseDown={(e) => handleMouseDown(e, 'start')}
                    />

                    {/* End handle */}
                    <div className='flex flex-col'>
                        <div
                            className="absolute top-0 h-10 w-1 bg-blue-600 cursor-ew-resize"
                            style={{ left: `${yearToPosition(selectedRange.end) - 2}px` }}
                            onMouseDown={(e) => handleMouseDown(e, 'end')}
                        />
                    </div>
                </div>

                <div
                    className="absolute top-0 bg-white/50 rounded-lg px-1 text-[8px]"
                    style={{ left: `${yearToPosition(selectedRange.start) + 30}px`, top: '35px' }}
                >{mapState.year.start <= 0 ? `${Math.abs(mapState.year.start)} BCE` : `${mapState.year.start} CE`}</div>
                <div
                    className="absolute top-0 bg-white/50 rounded-lg px-1 text-[8px]"
                    style={{ left: `${yearToPosition(selectedRange.end) + 30}px`, top: '35px' }}
                >{mapState.year.end <= 0 ? `${Math.abs(mapState.year.end)} BCE` : `${mapState.year.end} CE`}</div>

                <button
                    className="bg-blue-500 text-white rounded-lg text-xs h-8 w-10 flex items-center justify-center"
                    onClick={() => adjustViewWindow('end', 10)}
                >
                    +10
                </button>
            </div>
            <div className='mx-12 relative flex items-center'>
                <TopLoadingBar isLoading={isLoading} />
            </div>
        </div>
    );
};

export default YearRangeSelector;