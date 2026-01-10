import { useMapEvents } from "react-leaflet";

export default function ClickMarker({ setPosition, setDetails }) {
  useMapEvents({
    click: async (e) => {
      const { lat, lng } = e.latlng;
      setPosition([lat, lng]);

      // Reverse Geocoding
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`
      );
      const data = await res.json();
      setDetails({...data.address,address:data.display_name});
      // console.log("first222",data)
    },
  });

  return null;
}
