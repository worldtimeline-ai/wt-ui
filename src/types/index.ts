export interface TimeRange {
  start: number;
  end: number;
}

export interface ViewState {
  center: { lat: number, lng: number };
  zoom: number;
}

export interface MapState {
  year: TimeRange;
  view: ViewState;
}

export interface MapPeriod {
  id: number;
  name: string;
  startYear: number;
  endYear: number;
  geoData: string;
}
