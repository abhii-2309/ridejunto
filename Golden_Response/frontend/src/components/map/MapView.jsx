import { useEffect } from "react";
import { CircleMarker, MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
import L from "leaflet";

const markerIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const defaultCenter = [40.758, -73.9855];

export function MapView({ pickup, dropoff }) {
  return (
    <MapContainer
      className="h-full w-full"
      center={pickup ? [pickup.lat, pickup.lng] : defaultCenter}
      zoom={13}
      scrollWheelZoom
      zoomControl
      aria-label="RideJunto interactive map"
    >
      <TileLayer
        attribution={import.meta.env.VITE_MAP_ATTRIBUTION || "(c) OpenStreetMap contributors"}
        url={
          import.meta.env.VITE_MAP_TILE_URL ||
          "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        }
      />
      <MapFocus pickup={pickup} dropoff={dropoff} />
      {pickup ? (
        <Marker position={[pickup.lat, pickup.lng]} icon={markerIcon}>
          <Popup>
            <strong>Pickup</strong>
            <br />
            {pickup.label}
          </Popup>
        </Marker>
      ) : null}
      {dropoff ? (
        <Marker position={[dropoff.lat, dropoff.lng]} icon={markerIcon}>
          <Popup>
            <strong>Drop-off</strong>
            <br />
            {dropoff.label}
          </Popup>
        </Marker>
      ) : null}
      {pickup && dropoff ? (
        <>
          <CircleMarker center={[pickup.lat, pickup.lng]} radius={18} pathOptions={{ color: "#0f9f7a" }} />
          <CircleMarker center={[dropoff.lat, dropoff.lng]} radius={18} pathOptions={{ color: "#ef6a4d" }} />
        </>
      ) : null}
    </MapContainer>
  );
}

function MapFocus({ pickup, dropoff }) {
  const map = useMap();

  useEffect(() => {
    setTimeout(() => map.invalidateSize(), 120);
  }, [map]);

  useEffect(() => {
    if (pickup && dropoff) {
      map.fitBounds(
        [
          [pickup.lat, pickup.lng],
          [dropoff.lat, dropoff.lng]
        ],
        { padding: [70, 70], maxZoom: 14 }
      );
      return;
    }

    if (pickup) map.flyTo([pickup.lat, pickup.lng], 14, { duration: 0.8 });
    if (dropoff) map.flyTo([dropoff.lat, dropoff.lng], 14, { duration: 0.8 });
  }, [pickup, dropoff, map]);

  return null;
}
