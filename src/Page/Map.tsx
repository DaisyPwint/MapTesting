import LocationPicker from "@/components/LocationPicker";
import { Coordinates, FormValues } from "@/type/type";
import L from 'leaflet';
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";

interface MapProps {
    locationData: FormValues | null,
    setLocation?: (values: Coordinates) => void
    viewOnly?: boolean | null
}

function MapPage({ locationData, setLocation, viewOnly }: MapProps) {

    const hasCustomImage = !!locationData?.image;

    const customIcon = hasCustomImage
        ? L.icon({
            iconUrl: URL.createObjectURL(locationData.image!),
            iconSize: [30, 30],
            iconAnchor: [20, 40],
            popupAnchor: [0, -40],
        })
        : undefined;

    return (
        <MapContainer
            center={[16.8166942, 96.2072375]}
            className={`${viewOnly ? 'h-[25vh]' : 'h-[80vh]'} ${viewOnly ? 'md:w-full' : 'md:w-1/2'} z-[1]`}
            zoom={10}
            zoomControl={false}
        >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <LocationPicker onSelect={(lat, lng) => {
                setLocation?.({ lat, lng })
            }} />
            {
                locationData &&
                <Marker
                    position={[parseFloat(locationData?.latitude), parseFloat(locationData?.longitude)]}
                    icon={customIcon}
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
    )
}

export default MapPage