import { Destination } from "./Destination";

export interface Plan {
  id: number;
  title: string;
  overview: string;
  duration: string;
  rating: number;
  imageUri: string;
  isFavorite: boolean;
  destinations?: Destination[];
}
