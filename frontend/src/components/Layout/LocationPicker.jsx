import { useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import ClickMarker from "./../../utils/ClickMarker";
import L from "leaflet";
import { useMap } from "react-leaflet";

function FlyToPosition({ position }) {
  const map = useMap();

  if (position) {
    map.flyTo(position, 16, {
      duration: 1.5
    });
  }

  return null;
}

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

export default function LocationPicker({ event, setEvent, position, setPosition, details, setDetails }) {
  const [searchText, setSearchText] = useState(event?.location?.displayName || "");
  const [markerPosition, setMarkerPosition] = useState(null);
  
   const handleLocationSearch = async () => {
    if (!searchText.trim()) return;

    const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${searchText}`);
    const data = await res.json();
    if (!data.length) return alert("this place is not exist");

    const { lat, lon, display_name } = data[0];
    setMarkerPosition([parseFloat(lat), parseFloat(lon)]);
    setPosition([parseFloat(lat), parseFloat(lon)]);

    const detailsRes = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`);
    const detailsData = await detailsRes.json();
    setDetails( detailsData.address);
    setDetails( {...details , address:data.display_name});

   
    setEvent((prev) => ({
      ...prev,
      location: {
        lat: parseFloat(lat),
        lon: parseFloat(lon),
        city: detailsData.address.city || detailsData.address.town || detailsData.address.village || "",
        state: detailsData.address.state || "",
        country: detailsData.address.country || "",
        address: display_name, 
      },
    }));
    // console.log("first:", details ,"position:", position);
    // console.log("second:", detailsData.address);
    // console.log("Third:",event)
    // console.log("forth:",markerPosition)
  };

  return (
    <div>
      <div className="flex gap-2 items-center mb-4">
        <input
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          placeholder="Search location..."
          className="flex-1 border rounded p-3 border-gray-300 focus:ring-2 focus:ring-primary focus:outline-none"
        />
        <button
          onClick={handleLocationSearch}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Search
        </button>
      </div>

      <div className="h-80 w-full mb-6">
        <MapContainer center={markerPosition||[30.0444, 31.2357]} zoom={12} className="h-full w-full rounded">
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
           <FlyToPosition position={markerPosition} />
          <ClickMarker setPosition={setPosition} setDetails={setDetails} />
          {position && (
            <Marker position={position}>
              <Popup>
                {details
                  ? `${details.city || details.town || details.village}, ${details.state}, ${details.country}`
                  : "Loading..."}
              </Popup>
            </Marker>
          )}
        </MapContainer>
      </div>
    </div>
  );
}
