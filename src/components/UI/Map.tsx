

import React, { useState, useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import axios from "axios";

interface Location {
  latitude: number;
  longitude: number;
}

const Map: React.FC = () => {
  const mapRef = useRef<L.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const [location, setLocation] = useState<Location | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getLocation = () => {
      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const newLocation = {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            };
            setLocation(newLocation);
            console.log("User's Location:", newLocation);
          },
          (error) => {
            setError(error.message);
            console.error("Error getting location:", error.message);
          }
        );
      } else {
        setError("Geolocation is not supported by your browser.");
      }
    };

    getLocation();
  }, []);

  useEffect(() => {
    if (!location || !mapContainerRef.current) return;

    // Initialize Leaflet map
    const map = L.map(mapContainerRef.current).setView(
      [location.latitude, location.longitude],
      14
    );

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap contributors",
    }).addTo(map);

    L.marker([location.latitude, location.longitude])
      .addTo(map)
      .bindPopup("You are here!")
      .openPopup();

    mapRef.current = map;
const fetchNearbySentiments = async () => {
  try {
    const response = await axios.get("http://localhost:3000/sentiments/near", {
      params: {
        lat: location.latitude,
        lng: location.longitude,
      },
    });
    console.log("Nearby Sentiments:", response.data);

    const bounds = L.latLngBounds([location.latitude, location.longitude]); 

    response.data.forEach((sentiment) => {
      const lat = parseFloat(sentiment.latitude);
      const lng = parseFloat(sentiment.longitude);

      if (!lat || !lng) {
        console.error("Invalid coordinates:", sentiment);
        return;
      }

      const popupContent = `
        <div style="
          font-size: 12px;
          width: 300px;
          padding: 6px;
          line-height: 1.4;
          word-wrap: break-word;
          overflow-wrap: break-word;
          white-space: normal;
        ">
          <strong>Sentiment:</strong> ${sentiment.sentiment_value} <br/>
          <strong>Confidence:</strong> ${sentiment.confidence} <br/>
          <strong>Description:</strong> ${sentiment.location_description} <br/>
          <strong>Reason:</strong> ${sentiment.reason}
        </div>
      `;

      const sentimentMarker = L.marker([lat, lng]).addTo(map);
      sentimentMarker.bindTooltip(popupContent, { permanent: false, direction: "top" });

      bounds.extend([lat, lng]); 
    });

    if (response.data.length > 0) {
      bounds.extend([location.latitude, location.longitude]);
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  } catch (error) {
    console.error("Error fetching nearby sentiments:", error);
  }
};


    fetchNearbySentiments();

    return () => map.remove();
  }, [location]);

  return (
    <div>
      {error && <p className="text-red-500">Error: {error}</p>}
      <div ref={mapContainerRef} style={{ width: "100%", height: "400px" }} />
    </div>
  );
};

export default Map;
