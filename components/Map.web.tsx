import React, { useState } from 'react';
import { View, Text } from 'react-native';

const isWeb = typeof window !== 'undefined';

let GoogleMap: any, LoadScript: any, MarkerF: any, CircleF: any, InfoWindowF: any;

if (isWeb) {
  try {
    const rgm = require('@react-google-maps/api');
    GoogleMap = rgm.GoogleMap;
    LoadScript = rgm.LoadScript;
    MarkerF = rgm.MarkerF;
    CircleF = rgm.CircleF;
    InfoWindowF = rgm.InfoWindowF;
  } catch (e) {
    console.warn('Failed to load @react-google-maps/api', e);
  }
}

const mapContainerStyle = {
  width: '100%',
  height: '100%'
};

// Will fall back to a development warning if empty, but still renders
const GOOGLE_MAPS_API_KEY = process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY || '';

const MapView = ({ children, style, initialRegion, ...props }: any) => {
  if (!isWeb || !LoadScript) {
    return <View style={style} />;
  }

  // Fallback map center (Center of India)
  const center = initialRegion
    ? { lat: initialRegion.latitude, lng: initialRegion.longitude }
    : { lat: 20.5937, lng: 78.9629 };

  const zoomFactor = initialRegion && initialRegion.latitudeDelta
    ? Math.round(Math.log(360 / initialRegion.latitudeDelta) / Math.LN2)
    : 5;

  return (
    <View style={style}>
      <LoadScript googleMapsApiKey={GOOGLE_MAPS_API_KEY}>
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          center={center}
          zoom={zoomFactor || 5}
          options={{
            disableDefaultUI: true,
            zoomControl: true
          }}
        >
          {children}
        </GoogleMap>
      </LoadScript>
    </View>
  );
};

export const Marker = ({ coordinate, title, description, onPress, children }: any) => {
  if (!isWeb || !MarkerF) return null;

  const [isOpen, setIsOpen] = useState(false);

  return (
    <MarkerF
      position={{ lat: coordinate.latitude, lng: coordinate.longitude }}
      onClick={() => {
        setIsOpen(true);
        if (onPress) onPress();
      }}
    >
      {isOpen && InfoWindowF && (
        <InfoWindowF onCloseClick={() => setIsOpen(false)}>
          <div style={{ fontFamily: 'sans-serif', minWidth: 100, color: '#333' }}>
            <strong>{title}</strong>
            <br />
            {description}
          </div>
        </InfoWindowF>
      )}
    </MarkerF>
  );
};

export const Circle = ({ center, radius, fillColor, strokeColor, strokeWidth }: any) => {
  if (!isWeb || !CircleF) return null;

  // Convert rgba(...) to hex + opacity for google maps or just pass it through
  // Google Maps accepts hex colors, and handles opacity separately, 
  // but it can sometimes parse rgba values properly if passed correctly.

  return (
    <CircleF
      center={{ lat: center.latitude, lng: center.longitude }}
      radius={radius}
      options={{
        fillColor: fillColor || '#FF0000',
        fillOpacity: 0.3, // Provide strict fallback since rgba might not parse opacity
        strokeColor: strokeColor || '#FF0000',
        strokeOpacity: 1,
        strokeWeight: strokeWidth || 2,
      }}
    />
  );
};

export default MapView;
