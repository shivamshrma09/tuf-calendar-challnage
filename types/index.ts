export interface Task {
  id: string;
  date: string;
  title: string;
  description?: string;
  color?: string;
}

export interface Festival {
  date: string;
  name: string;
}

export interface MonthData {
  month: number;
  year: number;
  image: string;
  theme: {
    primary: string;
    accent: string;
    gradient: string;
  };
}

export type DateRangeState = {
  start: Date | null;
  end: Date | null;
  selecting: boolean;
};
