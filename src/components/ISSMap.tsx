
import React, { useEffect, useRef } from 'react';

interface ISSMapProps {
  position: {
    latitude: number;
    longitude: number;
  } | null;
}

declare global {
  interface Window {
    L: any;
  }
}

const ISSMap: React.FC<ISSMapProps> = ({ position }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markerRef = useRef<any>(null);

  useEffect(() => {
    // Load Leaflet dynamically
    const loadLeaflet = async () => {
      if (typeof window !== 'undefined' && !window.L) {
        // Load Leaflet CSS
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'https://unpkg.com/leaflet/dist/leaflet.css';
        document.head.appendChild(link);

        // Load Leaflet JS
        const script = document.createElement('script');
        script.src = 'https://unpkg.com/leaflet/dist/leaflet.js';
        script.onload = initializeMap;
        document.head.appendChild(script);
      } else if (window.L) {
        initializeMap();
      }
    };

    const initializeMap = () => {
      if (mapRef.current && !mapInstanceRef.current) {
        mapInstanceRef.current = window.L.map(mapRef.current).setView([0, 0], 2);
        
        // Use a satellite view for better ISS tracking
        window.L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
          attribution: '© Esri © OpenStreetMap contributors',
          maxZoom: 18
        }).addTo(mapInstanceRef.current);

        // Create ISS icon
        const issIcon = window.L.divIcon({
          html: '<div style="font-size: 24px; text-align: center; line-height: 30px;">🛰️</div>',
          iconSize: [30, 30],
          className: 'iss-icon'
        });

        markerRef.current = window.L.marker([0, 0], { icon: issIcon }).addTo(mapInstanceRef.current);
        
        // Add a popup to the marker
        markerRef.current.bindPopup('International Space Station');
      }
    };

    loadLeaflet();

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
        markerRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (position && mapInstanceRef.current && markerRef.current) {
      const { latitude, longitude } = position;
      markerRef.current.setLatLng([latitude, longitude]);
      mapInstanceRef.current.setView([latitude, longitude], 4);
      
      // Update popup content with current coordinates
      markerRef.current.setPopupContent(`
        <div style="text-align: center; color: #333;">
          <strong>🛰️ ISS Location</strong><br/>
          Lat: ${latitude.toFixed(4)}°<br/>
          Lng: ${longitude.toFixed(4)}°
        </div>
      `);
    }
  }, [position]);

  return (
    <div className="relative">
      <div 
        ref={mapRef} 
        className="h-96 w-full rounded-lg border-2 border-white/20 shadow-2xl"
        style={{ backgroundColor: '#1a1a1a' }}
      />
      <style dangerouslySetInnerHTML={{
        __html: `
          .iss-icon {
            background: transparent !important;
            border: none !important;
          }
          .leaflet-popup-content-wrapper {
            border-radius: 8px;
          }
        `
      }} />
    </div>
  );
};

export default ISSMap;
