import React, { useEffect, useRef } from "react";

function Map() {
  const mapRef = useRef(null);
  const location = {
    lat: 48.858844, // Example: Latitude for the Eiffel Tower
    lng: 2.294351, // Example: Longitude for the Eiffel Tower
  };

  useEffect(() => {
    const initMap = () => {
      const map = new window.google.maps.Map(mapRef.current, {
        center: location,
        zoom: 15,
      });
      new window.google.maps.Marker({
        position: location,
        map,
        title: "Eiffel Tower", // Example location
      });
    };

    if (!window.google) {
      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?AIzaSyBTh1T9VDutesqd6hoMXDV9D-dzwxMFeTI`;
      script.async = true;
      script.defer = true;
      script.onload = initMap;
      document.body.appendChild(script);
    } else {
      initMap();
    }
  }, []);

  return (
    <div className="flex flex-col items-center">
      <h1 className="text-2xl font-bold text-center my-4">
        Explore the Eiffel Tower
      </h1>
      <div
        ref={mapRef}
        className="w-full max-w-4xl h-80 rounded-lg shadow-lg"
      ></div>
    </div>
  );
}

export default Map;