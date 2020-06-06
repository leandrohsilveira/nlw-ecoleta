import { useState, useEffect, useCallback, useMemo } from "react";
import { LatLngExpression } from "leaflet";

interface Coordinates {
  latitude: number;
  longitude: number;
}

interface PositionParser<T> {
  (coors: Coordinates): T;
}

export function latLngPositionParser(coords: Coordinates): LatLngExpression {
  return [coords.latitude, coords.longitude];
}

export default function useGeolocation<T>(
  parser: PositionParser<T>,
  initialPosition: Coordinates
): [T, () => void] {
  const [currentPosition, setCurrentPosition] = useState<Coordinates>(
    initialPosition
  );
  const updateCurrentPosition = useCallback(() => {
    navigator.geolocation.getCurrentPosition((position) => {
      setCurrentPosition(position.coords);
    });
  }, []);
  useEffect(() => {
    updateCurrentPosition();
  }, [updateCurrentPosition]);

  return [
    useMemo(() => parser(currentPosition), [currentPosition, parser]),
    updateCurrentPosition,
  ];
}
