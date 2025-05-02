export interface FormValues {
  id?: string,
  name: string;
  latitude: string;
  longitude: string;
  description?: string | undefined;
  image: File;
}

export interface Coordinates{
  lat: number;
  lng: number
}