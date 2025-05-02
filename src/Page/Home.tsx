
import { addLocations } from "@/store/locationSlice";
import { AppDispatch, RootState } from "@/store/store";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { Coordinates, FormValues } from "@/type/type";
import { v4 as uuid4 } from 'uuid';
import FormPage from "./FormPage";
import LocationList from "./LocationList";
import Map from "./Map";

export const Home = () => {
  const [coords, setCoords] = useState<Coordinates | null>(null)
  const [locationData, setLocationData] = useState<FormValues | null>(null);
  const locs = useSelector((state: RootState) => state.location?.locations);
  const dispatch = useDispatch<AppDispatch>();

  const handleSubmit = (values: FormValues) => {
    try {
      const uid = uuid4();
      setLocationData({ ...values })
      dispatch(addLocations({ id: uid, ...values }));
    } catch (error) {
      console.log(error);
    }
  }

  const handleSelectMap = ({ lat, lng }: Coordinates) => {
    setCoords({ lat, lng })
  }

  return (
    <>
      <div className="flex md:flex-row flex-col gap-5 bg-gray-100 mt-4">
        <Map locationData={locationData} setLocation={handleSelectMap} />
        <div className="flex flex-1 flex-col align-center p-4">
          <h1 className="text-2xl font-bold mb-4">Location Form</h1>
          <FormPage coordinates={coords} onSubmitValues={handleSubmit} />
        </div>
      </div>
      {Array.isArray(locs) && locs.length > 0 ? (
        <LocationList locations={locs} />
      ) : (
        <p className="text-center text-gray-500 mt-3">No locations available.</p>
      )}
    </>
  )
};
