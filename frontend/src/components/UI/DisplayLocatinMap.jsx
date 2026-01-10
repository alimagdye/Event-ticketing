import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";

// Fix Leaflet marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

export default function DisplayLocatinMap({ lat, lon, name }) {
  if (!lat || !lon) return null; 

  return (
    <div className="h-70 w-full rounded overflow-hidden border">
      <MapContainer
        center={[lat, lon]}
        zoom={15}
        scrollWheelZoom={false}
        doubleClickZoom={false}
        dragging={false}
        zoomControl={false}
        className="h-full w-full"
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <Marker position={[lat, lon]}>
          <Popup>{name || "Selected Place"}</Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}
