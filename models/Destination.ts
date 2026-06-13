export interface Destination {
  distance?: number;
  id: number;
  title: string;
  description: string;
  categoryId: number;
  vibeTag: string;
  latitude: number;
  longitude: number;
  imageUri: string;
  rating: number;
  entryFee: string;
  isFavorite: boolean;
  dayNumber?: number;
}
