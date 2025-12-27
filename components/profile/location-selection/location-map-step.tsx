"use client";

import { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import type { LocationSelectionFormData } from "@/services/schema/location.validation.schema";
import type L from "leaflet";

// Extend Window interface to include Leaflet
declare global {
  interface Window {
    L?: typeof L;
  }
}

// Type for Leaflet Icon Default prototype with private property
interface LeafletIconDefaultPrototype {
  _getIconUrl?: () => string;
}

interface LocationMapStepProps {
  form: ReturnType<typeof useForm<LocationSelectionFormData>>;
}

export function LocationMapStep({ form }: LocationMapStepProps) {
  const {
    register,
    setValue,
    formState: { errors },
  } = form;
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<{
    lat: number;
    lng: number;
    address?: string;
  } | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const mapRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);

  // Initialize map
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!mapContainerRef.current || mapLoaded) return;

    let isMounted = true;

    const initMap = async () => {
      try {
        // Ensure container has dimensions
        if (!mapContainerRef.current || !isMounted) return;
        
        // Wait a bit for container to be fully rendered
        await new Promise((resolve) => setTimeout(resolve, 200));
        
        if (!mapContainerRef.current || !isMounted) return;
        
        // Dynamically import Leaflet
        // Note: Leaflet CSS is already imported globally in app/globals.css
        const leafletModule = await import("leaflet");
        const L = leafletModule.default || leafletModule;
        
        // Fix default marker icon issue
        // TypeScript doesn't know about _getIconUrl, so we use type assertion
        const defaultIcon = L.Icon.Default.prototype as unknown as LeafletIconDefaultPrototype;
        if (defaultIcon._getIconUrl) {
          delete defaultIcon._getIconUrl;
        }
        L.Icon.Default.mergeOptions({
          iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
          iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
          shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
        });

        // Default center (can be user's current location or a default)
        const defaultCenter: [number, number] = [51.505, -0.09]; // London

        if (!mapContainerRef.current || !isMounted) return;

        // Create map with dark gaming theme
        const map = L.map(mapContainerRef.current, {
          center: defaultCenter,
          zoom: 13,
          zoomControl: false,
          attributionControl: false,
        });

        // Add dark tile layer (using CartoDB dark theme)
        L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
          attribution: "",
          maxZoom: 19,
        }).addTo(map);

        // Custom gaming-style controls
        const zoomControl = L.control.zoom({
          position: "bottomright",
        });
        zoomControl.addTo(map);

        // Store L globally for use in search handler
        window.L = L;

        // Add click handler
        map.on("click", async (e: L.LeafletMouseEvent) => {
          const { lat, lng } = e.latlng;
          
          // Remove existing marker
          if (markerRef.current) {
            map.removeLayer(markerRef.current);
          }

          // Add new marker with gaming style
          const marker = L.marker([lat, lng], {
            icon: L.divIcon({
              className: "custom-marker",
              html: `<div style="
                width: 24px;
                height: 24px;
                background: #ff0080;
                border: 2px solid #fff;
                border-radius: 50%;
                box-shadow: 0 0 15px rgba(255, 0, 128, 0.8), 0 0 30px rgba(255, 0, 128, 0.4);
                animation: pulse 2s infinite;
              "></div>`,
              iconSize: [24, 24],
              iconAnchor: [12, 12],
            }),
          }).addTo(map);

          markerRef.current = marker;
          setSelectedLocation({ lat, lng });

          // Reverse geocoding to get address
          try {
            const response = await fetch(
              `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}&localityLanguage=en`
            );
            const data = await response.json();
            
            setValue("latitude", lat);
            setValue("longitude", lng);
            setValue("country", data.countryName || "");
            setValue("city", data.city || data.locality || "");
            setValue("address", data.localityInfo?.administrative?.[0]?.name || "");
            setValue(
              "timezone",
              Intl.DateTimeFormat().resolvedOptions().timeZone
            );
            
            setSelectedLocation({
              lat,
              lng,
              address: data.localityInfo?.administrative?.[0]?.name || data.city || "",
            });
          } catch (error) {
            console.error("Geocoding error:", error);
            setValue("latitude", lat);
            setValue("longitude", lng);
            setValue(
              "timezone",
              Intl.DateTimeFormat().resolvedOptions().timeZone
            );
          }
        });

        if (!isMounted) {
          map.remove();
          return;
        }

        mapRef.current = map;
        
        // Invalidate size to ensure map renders correctly
        setTimeout(() => {
          if (mapRef.current && isMounted) {
            mapRef.current.invalidateSize();
          }
        }, 200);

        if (isMounted) {
          setMapLoaded(true);
        }

        // Try to get user's current location
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              const { latitude, longitude } = position.coords;
              map.setView([latitude, longitude], 13);
            },
            () => {
              // Use default if geolocation fails
              map.setView(defaultCenter, 13);
            }
          );
        }
      } catch (error) {
        console.error("Map initialization error:", error);
        if (isMounted) {
          setMapLoaded(false);
        }
      }
    };

    initMap();

    return () => {
      isMounted = false;
      if (mapRef.current) {
        try {
          mapRef.current.remove();
        } catch {
          // Ignore cleanup errors
        }
        mapRef.current = null;
      }
      if (markerRef.current) {
        markerRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run once on mount - mapLoaded and setValue are intentionally excluded

  // Handle location search
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim() || !mapRef.current || isSearching) return;

    setIsSearching(true);
    try {
      // Use Nominatim (OpenStreetMap) geocoding API
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&limit=1`
      );
      const data = await response.json();

      if (data && data.length > 0) {
        const result = data[0];
        const lat = parseFloat(result.lat);
        const lng = parseFloat(result.lon);

        // Zoom to the location (closer zoom level - 15)
        mapRef.current.setView([lat, lng], 15);

        // Remove existing marker
        if (markerRef.current) {
          mapRef.current.removeLayer(markerRef.current);
        }

        // Get Leaflet from window (stored during map initialization)
        const L = window.L;
        if (!L) {
          console.error("Leaflet not available");
          setIsSearching(false);
          return;
        }
        
        // Add marker at searched location
        const marker = L.marker([lat, lng], {
          icon: L.divIcon({
            className: "custom-marker",
            html: `<div style="
              width: 24px;
              height: 24px;
              background: #ff0080;
              border: 2px solid #fff;
              border-radius: 50%;
              box-shadow: 0 0 15px rgba(255, 0, 128, 0.8), 0 0 30px rgba(255, 0, 128, 0.4);
              animation: pulse 2s infinite;
            "></div>`,
            iconSize: [24, 24],
            iconAnchor: [12, 12],
          }),
        }).addTo(mapRef.current);

        markerRef.current = marker;
        setSelectedLocation({ lat, lng, address: result.display_name });

        // Update form values
        setValue("latitude", lat, { shouldDirty: true, shouldValidate: true });
        setValue("longitude", lng, { shouldDirty: true, shouldValidate: true });
        setValue("country", result.address?.country || "", { shouldDirty: true, shouldValidate: true });
        setValue("city", result.address?.city || result.address?.town || result.address?.village || "", { shouldDirty: true, shouldValidate: true });
        setValue("address", result.display_name || "", { shouldDirty: true, shouldValidate: true });
        setValue(
          "timezone",
          Intl.DateTimeFormat().resolvedOptions().timeZone,
          { shouldDirty: true, shouldValidate: true }
        );
      }
    } catch (error) {
      console.error("Search error:", error);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      {/* Gaming-style Header */}
      <div className="border-b border-primary/30 pb-4">
        <h3 className="text-primary font-mono text-sm uppercase tracking-wider mb-2">
          DEPLOYMENT ZONE SELECTION
        </h3>
        <p className="text-white/60 font-mono text-xs uppercase tracking-wider">
          Search for a location or click on the map to set your position
        </p>
      </div>

      {/* Search Input */}
      <form onSubmit={handleSearch} className="space-y-2">
        <label className="block text-primary text-xs font-mono font-bold uppercase tracking-wider">
          SEARCH LOCATION
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="e.g., Cairo Nasr City"
            className="flex-1 bg-[#1a1a1a] border border-gray-800 focus:border-primary focus:ring-primary text-white font-mono text-sm rounded-sm py-3 px-4 focus:ring-1 focus:outline-none transition-all placeholder:text-gray-700"
          />
          <button
            type="submit"
            disabled={isSearching || !searchQuery.trim()}
            className="px-6 py-3 border border-primary/50 text-primary font-mono text-xs uppercase tracking-wider hover:border-primary hover:bg-primary/10 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSearching ? "SEARCHING..." : "SEARCH"}
          </button>
        </div>
      </form>

      {/* Map Container with Gaming Overlay */}
      <div className="relative">
        <div
          ref={mapContainerRef}
          className="w-full h-[400px] lg:h-[500px] rounded-sm border-2 border-primary/50 overflow-hidden relative"
          style={{
            boxShadow: "0 0 30px rgba(255, 0, 128, 0.2)",
            minHeight: "400px",
          }}
        >
          {/* Loading overlay */}
          {!mapLoaded && (
            <div className="absolute inset-0 bg-[#1a1a1a] flex items-center justify-center z-10">
              <div className="text-center">
                <div className="text-primary font-mono text-sm uppercase tracking-wider animate-pulse">
                  LOADING MAP...
                </div>
              </div>
            </div>
          )}

          {/* Gaming-style corner decorations */}
          <div className="absolute top-0 left-0 w-4 h-4 border-l-2 border-t-2 border-primary z-20"></div>
          <div className="absolute top-0 right-0 w-4 h-4 border-r-2 border-t-2 border-primary z-20"></div>
          <div className="absolute bottom-0 left-0 w-4 h-4 border-l-2 border-b-2 border-primary z-20"></div>
          <div className="absolute bottom-0 right-0 w-4 h-4 border-r-2 border-b-2 border-primary z-20"></div>
        </div>

        {/* Selected Location Info */}
        {selectedLocation && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 p-4 bg-[#1a1a1a] border border-primary/30 rounded-sm"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-primary text-xs font-mono uppercase tracking-wider mb-2">
                  Coordinates
                </label>
                <code className="text-white/80 font-mono text-xs">
                  {selectedLocation.lat.toFixed(6)}, {selectedLocation.lng.toFixed(6)}
                </code>
              </div>
              {selectedLocation.address && (
                <div>
                  <label className="block text-primary text-xs font-mono uppercase tracking-wider mb-2">
                    Sector
                  </label>
                  <code className="text-white/80 font-mono text-xs">
                    {selectedLocation.address}
                  </code>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </div>

      {/* Hidden inputs for form validation */}
      <input type="hidden" {...register("latitude")} />
      <input type="hidden" {...register("longitude")} />
      <input type="hidden" {...register("country")} />
      <input type="hidden" {...register("city")} />
      <input type="hidden" {...register("address")} />
      <input type="hidden" {...register("timezone")} />

      {/* Error Messages */}
      <div className="space-y-2">
        {(errors.latitude || errors.longitude || errors.country || errors.city) && (
          <div className="min-h-[20px]">
            <p
              className="text-red-400 text-xs font-mono uppercase tracking-wider animate-pulse"
              style={{
                textShadow:
                  "0 0 8px rgba(248, 113, 113, 0.8), 0 0 16px rgba(248, 113, 113, 0.4)",
              }}
            >
              ⚠ {errors.latitude?.message || errors.longitude?.message || errors.country?.message || errors.city?.message}
            </p>
          </div>
        )}
      </div>
    </motion.div>
  );
}

