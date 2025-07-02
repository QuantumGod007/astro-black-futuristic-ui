
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
        mapInstanceRef.current = window.L.map(mapRef.current, {
          // Reduce sensitivity settings
          zoomControl: true,
          doubleClickZoom: false,
          scrollWheelZoom: false,
          touchZoom: true,
          dragging: true,
          zoomSnap: 0.5,
          zoomDelta: 0.5
        }).setView([0, 0], 2);
        
        // Use a satellite view for better ISS tracking
        window.L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
          attribution: '© Esri © OpenStreetMap contributors',
          maxZoom: 10,
          minZoom: 1
        }).addTo(mapInstanceRef.current);

        // Create ISS icon
        const issIcon = window.L.divIcon({
          html: '<div style="font-size: 28px; text-align: center; line-height: 32px; text-shadow: 2px 2px 4px rgba(0,0,0,0.8);">🛰️</div>',
          iconSize: [32, 32],
          className: 'iss-icon'
        });

        markerRef.current = window.L.marker([0, 0], { icon: issIcon }).addTo(mapInstanceRef.current);
        
        // Add a popup to the marker
        markerRef.current.bindPopup('International Space Station');

        // Add zoom control with custom position
        mapInstanceRef.current.addControl(window.L.control.zoom({
          position: 'topright'
        }));
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
      
      // Less aggressive view changes
      mapInstanceRef.current.setView([latitude, longitude], 3, {
        animate: true,
        duration: 1
      });
      
      // Update popup content with current coordinates
      markerRef.current.setPopupContent(`
        <div style="text-align: center; color: #333; padding: 8px;">
          <strong style="color: #1f2937;">🛰️ ISS Location</strong><br/>
          <div style="margin-top: 8px;">
            <strong>Lat:</strong> ${latitude.toFixed(4)}°<br/>
            <strong>Lng:</strong> ${longitude.toFixed(4)}°
          </div>
          <div style="margin-top: 8px; font-size: 12px; color: #6b7280;">
            Updated: ${new Date().toLocaleTimeString()}
          </div>
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
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
          }
          .leaflet-popup-content {
            margin: 8px 12px;
            line-height: 1.4;
          }
          .leaflet-container {
            cursor: grab;
          }
          .leaflet-container:active {
            cursor: grabbing;
          }
        `
      }} />
    </div>
  );
};

export default ISSMap;
