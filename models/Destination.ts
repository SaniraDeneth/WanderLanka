export interface Destination {
  distance: number | undefined;
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
}
