import { GoogleMap, LoadScript, Marker, InfoWindow, Polygon } from "@react-google-maps/api";
import { useCallback, useMemo, useRef, useState } from "react";
import { MapState } from "../types";

const containerStyle = { width: "100vw", height: "100vh" };

const options = {
    fullscreenControl: false,
    zoomControl: true,
    mapTypeControl: true,
    streetViewControl: true,
};

export default function WTGoogleMap(props: any) {
    const mapRef = useRef<google.maps.Map>();
    const { mapState, setMapState, events, tags } = props;
    const [hoveredMarker, setHoveredMarker] = useState<number | null>(null);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    const markers = useMemo(() => {
        return events
            .filter((ev: any) => ev.tags?.some((et: any) => tags.find((t: any) => t.name == et)?.selected))
            .map((e: any, i: any) => ({
                ...e,
                id: i,
                position: {
                    lat: e.location?.latitude,
                    lng: e.location?.longitude,
                },
            }));
    }, [events, tags]);

    function handleLoad(map: google.maps.Map) {
        mapRef.current = map;
    }

    const onMapIdle = useCallback(() => {
        if (!mapRef.current) return;
        const newPos = mapRef.current.getCenter()?.toJSON();
        const newZoom = mapRef.current.getZoom();
        if (hoveredMarker || !newPos || !newZoom ||
            (
                mapState.view.center.lat.toFixed(2) === newPos.lat.toFixed(2) &&
                mapState.view.center.lng.toFixed(2) === newPos.lng.toFixed(2) &&
                mapState.view.zoom === newZoom
            )) {
            return;
        }
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
        timeoutRef.current = setTimeout(() => {
            setMapState((prevState: MapState) => ({
                ...prevState,
                view: {
                    ...prevState.view,
                    center: newPos,
                    zoom: newZoom,
                },
            }));
        }, 500);
    }, [mapState, hoveredMarker]);

    const onMapChanged = useCallback(() => {
        if (!mapRef.current) return;
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
        timeoutRef.current = setTimeout(() => {
            setHoveredMarker(null);
        }, 500);
    }, []);

    return (
        <div className="absolute inset-0 p-0 overscroll-none">
            <LoadScript googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_API_KEY ?? ''}>
                <GoogleMap
                    key={123}
                    mapTypeId="terrain"
                    options={options}
                    onLoad={handleLoad}
                    mapContainerStyle={containerStyle}
                    center={mapState.view.center}
                    zoom={mapState.view.zoom}
                    onIdle={onMapIdle}
                    onDragStart={onMapChanged}
                    onZoomChanged={onMapChanged}
                >
                    {markers.map((marker: any) => (
                        <Marker
                            key={marker.id}
                            icon={{
                                url: '/icons/icon.png',
                                scaledSize: new window.google.maps.Size(marker.hovered ? 40 : 30, marker.hovered ? 40 : 30),
                                anchor: new window.google.maps.Point(20, 40),
                            }}
                            position={marker.position}
                            onMouseOver={() => setHoveredMarker(marker.id)}>
                            {hoveredMarker === marker.id && (
                                <InfoWindow
                                    options={{ maxWidth: 350 }}
                                    position={marker.position}
                                    onCloseClick={() => setHoveredMarker(null)}>
                                    <div className="flex flex-col gap-1 py-2">
                                        <div>
                                            {marker.description}
                                        </div>
                                        <div className="flex gap-1">
                                            <div className="py-1 px-2 rounded-full bg-gray-300">{marker.year}</div>
                                            {marker.tags.map((tag: string) => (
                                                <div key={tag} className="py-1 px-2 rounded-full bg-gray-300">{tag}</div>
                                            ))}
                                        </div>
                                    </div>
                                </InfoWindow>
                            )}
                        </Marker>
                    ))}
                </GoogleMap>
            </LoadScript>
        </div>
    );
}
