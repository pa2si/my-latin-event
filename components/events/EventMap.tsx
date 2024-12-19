"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, ZoomControl } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { icon } from "leaflet";

const iconUrl =
  "https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon-2x.png";
const markerIcon = icon({
  iconUrl: iconUrl,
  iconSize: [20, 30],
});

interface DynamicMapProps {
  name: string;
  country: string;
  city: string;
  street: string;
  postalCode: string | null;
}

const DynamicMap = ({
  name,
  country,
  city,
  street,
  postalCode,
}: DynamicMapProps) => {
  const [coordinates, setCoordinates] = useState<[number, number] | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getCoordinates = async () => {
      setIsLoading(true);

      try {
        // Construct address without postal code if it's null
        const addressParts = [street];
        if (postalCode) {
          addressParts.push(postalCode);
        }
        addressParts.push(city, country);

        const address = addressParts.join(", ");

        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
            address,
          )}`,
        );
        const data = await response.json();

        if (data && data[0]) {
          setCoordinates([parseFloat(data[0].lat), parseFloat(data[0].lon)]);
        } else {
          setCoordinates(null);
        }
      } catch (error) {
        console.error("Geocoding error:", error);
        setCoordinates(null);
      } finally {
        setIsLoading(false);
      }
    };

    getCoordinates();
  }, [street, city, country, postalCode]);

  return (
    <div className="mt-4">
      {!isLoading && coordinates && (
        <MapContainer
          scrollWheelZoom={false}
          zoomControl={false}
          className="relative z-0 h-[50vh] rounded-lg"
          center={coordinates}
          zoom={15}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <ZoomControl position="bottomright" />
          <Marker position={coordinates} icon={markerIcon}></Marker>
        </MapContainer>
      )}
    </div>
  );
};

export default DynamicMap;
