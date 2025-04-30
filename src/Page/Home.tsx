import LocationPicker from "@/components/LocationPicker";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { addLocations } from "@/store/locationSlice";
import { AppDispatch, RootState } from "@/store/store";
import { useState } from "react";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import { useDispatch, useSelector } from "react-redux";
import { v4 as uuid } from 'uuid';

import { Button } from "@/components/ui/button";
import { Eye, Pencil } from "lucide-react";
import FormPage from "./FormPage";

interface FormValues {
  name: string;
  latitude: string;
  longitude: string;
  description?: string | undefined;
  image?: undefined;
}

export const Home = () => {
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null)
  const [locationData, setLocationData] = useState<FormValues | null>(null);
  const locations = useSelector((state: RootState) => state.location?.locations);
  const dispatch = useDispatch<AppDispatch>();

  const handleSubmit = (values: FormValues) => {
    setLocationData({ ...values })
    const id = uuid();
    dispatch(addLocations({ id, ...values }));
  }

  return (
    <>
      <div className="flex md:flex-row flex-col gap-5 bg-gray-100 mt-4">
        <MapContainer
          center={[16.8166942, 96.2072375]}
          className="h-[80vh] md:w-1/2"
          zoom={13}
          zoomControl={false}
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <LocationPicker onSelect={(lat, lng) => {
            setCoords({ lat, lng })
          }} />
          {
            locationData &&
            <Marker
              position={[parseFloat(locationData?.latitude), parseFloat(locationData?.longitude)]}
            >
              <Popup>
                <div className="flex flex-col gap-2">
                  <span className="text-lg">{locationData.name}</span>
                  {locationData?.description && <p style={{ marginBlock: 1 }}>{locationData?.description}</p>}
                  <div>
                    <span className="text-sm text-slate-600">{locationData.latitude}</span> <br />
                    <span className="text-sm text-slate-600">{locationData.longitude}</span>
                  </div>
                </div>
              </Popup>
            </Marker>
          }
        </MapContainer>
        <div className="flex flex-1 flex-col align-center p-4">
          <h1 className="text-2xl font-bold mb-4">Location Form</h1>
          <FormPage coordinates={coords} onSubmitValues={handleSubmit} />
        </div>
      </div>
      {
        locations?.length > 0 ?
          <Table className="rounded-md border my-5 bg-white">
            <TableHeader>
              <TableRow>
                <TableHead>No.</TableHead>
                <TableHead>Location Name</TableHead>
                <TableHead>Latitude</TableHead>
                <TableHead>Longitude</TableHead>
                <TableHead>Description</TableHead>
                <TableHead className="text-center">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {
                locations?.map((location: FormValues, index: number) => {
                  return <TableRow>
                    <TableCell className="font-medium">{index + 1}</TableCell>
                    <TableCell>{location.name}</TableCell>
                    <TableCell>{location.latitude}</TableCell>
                    <TableCell>{location.longitude}</TableCell>
                    <TableCell>{location.description}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Eye className="mr-2 h-4 w-4" />
                          Detail
                        </Button>
                        <Button variant="default" size="sm">
                          <Pencil className="mr-2 h-4 w-4" />
                          Edit
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                }
                )
              }
            </TableBody>
          </Table> : <></>
      }
    </>
  )
};
