export interface TimeRange {
  start: number;
  end: number;
}

export interface ViewState {
  center: [number, number];
  zoom: number;
}

export interface MapState {
  timeRange: TimeRange;
  view: ViewState;
  isTimeScroll: boolean;
}
