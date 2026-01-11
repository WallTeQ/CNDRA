import React, { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

export default function LiberiaMapHero() {
  const mapContainer = useRef(null);
  const mapInstance = useRef(null);
  const tileLayerInstance = useRef(null);
  const [mapStyle, setMapStyle] = useState("streets");

  const mapStyles = {
    streets: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    satellite:
      "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    terrain: "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png",
    dark: "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
  };

  const cities = [
    {
      name: "Monrovia",
      coords: [6.3156, -10.8008],
      desc: "Capital and largest city",
    },
    { name: "Gbarnga", coords: [6.9979, -9.4726], desc: "Second largest city" },
    { name: "Buchanan", coords: [5.8808, -10.0467], desc: "Major port city" },
    {
      name: "Harper",
      coords: [4.375, -7.7167],
      desc: "Southeastern coastal city",
    },
  ];

  useEffect(() => {
    // Prevent multiple initializations
    if (mapInstance.current) return;

    // Fix default marker icon
    delete L.Icon.Default.prototype._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl:
        "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
      iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
      shadowUrl:
        "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
    });

    // Create custom red icon
    const redIcon = L.icon({
      iconUrl:
        "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCAzMCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNMTUgMEMxMC44NTc5IDAgNy41IDMuMzU3ODYgNy41IDcuNUM3LjUgMTMuMTI1IDE1IDI1IDE1IDI1QzE1IDI1IDIyLjUgMTMuMTI1IDIyLjUgNy41QzIyLjUgMy4zNTc4NiAxOS4xNDIxIDAgMTUgMFoiIGZpbGw9IiNFRjQ0NDQiLz48Y2lyY2xlIGN4PSIxNSIgY3k9IjcuNSIgcj0iMyIgZmlsbD0id2hpdGUiLz48L3N2Zz4=",
      iconSize: [30, 40],
      iconAnchor: [15, 40],
      popupAnchor: [0, -40],
    });

    // Initialize map
    mapInstance.current = L.map(mapContainer.current, {
      center: [6.4281, -9.4295],
      zoom: 7,
      zoomControl: false,
    });

    // Add zoom control to top right
    L.control.zoom({ position: "topleft" }).addTo(mapInstance.current);

    // Add tile layer
    tileLayerInstance.current = L.tileLayer(mapStyles[mapStyle], {
      attribution: "© OpenStreetMap contributors",
      maxZoom: 10,
    }).addTo(mapInstance.current);

    // Add markers for cities
    cities.forEach((city) => {
      L.marker(city.coords, { icon: redIcon })
        .bindPopup(
          `<div><strong style="font-size: 16px; color: #1f2937;">${city.name}</strong><br/><span style="color: #6b7280;">${city.desc}</span></div>`
        )
        .addTo(mapInstance.current);
    });

    // Cleanup on unmount
    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
        tileLayerInstance.current = null;
      }
    };
  }, []);

  // Handle map style changes
  useEffect(() => {
    if (!mapInstance.current || !tileLayerInstance.current) return;

    // Remove old tile layer
    mapInstance.current.removeLayer(tileLayerInstance.current);

    // Add new tile layer
    tileLayerInstance.current = L.tileLayer(mapStyles[mapStyle], {
    //   attribution: "© OpenStreetMap contributors",
      maxZoom: 10,
    }).addTo(mapInstance.current);
  }, [mapStyle]);

  const changeMapStyle = (style) => {
    setMapStyle(style);
  };

  return (
    <div className="hidden lg:block relative w-full  h-96  bg-gray-900">
      {/* Map Container */}
      <div ref={mapContainer} className="absolute inset-0 z-0" />

      {/* Map Style Selector */}
      {/* <div className="absolute top-6 left-6 bg-black/80 backdrop-blur-md p-4 rounded-xl border border-white/20 shadow-xl z-10">
        <p className="text-white text-sm mb-3 font-bold">Map Style</p>
        <div className="flex flex-col gap-2">
          <button
            onClick={() => changeMapStyle("streets")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              mapStyle === "streets"
                ? "bg-blue-600 text-white"
                : "bg-white/10 text-white hover:bg-white/20"
            }`}
          >
            Streets
          </button>
          <button
            onClick={() => changeMapStyle("satellite")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              mapStyle === "satellite"
                ? "bg-blue-600 text-white"
                : "bg-white/10 text-white hover:bg-white/20"
            }`}
          >
            Satellite
          </button>
          <button
            onClick={() => changeMapStyle("terrain")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              mapStyle === "terrain"
                ? "bg-blue-600 text-white"
                : "bg-white/10 text-white hover:bg-white/20"
            }`}
          >
            Terrain
          </button>
          <button
            onClick={() => changeMapStyle("dark")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              mapStyle === "dark"
                ? "bg-blue-600 text-white"
                : "bg-white/10 text-white hover:bg-white/20"
            }`}
          >
            Dark
          </button>
        </div>
      </div> */}
    </div>
  );
}
