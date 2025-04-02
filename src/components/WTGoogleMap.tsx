import { GoogleMap, LoadScript, Marker, InfoWindow } from "@react-google-maps/api";
import { useCallback, useMemo, useState } from "react";

const containerStyle = { width: "100vw", height: "100vh" };

const options = {
    fullscreenControl: false, // Disable fullscreen button
    zoomControl: true,
    mapTypeControl: true,
    streetViewControl: true,
};

export default function WTGoogleMap(props: any) {
    const { mapState, setMapState, events } = props;
    const [hoveredMarker, setHoveredMarker] = useState<number | null>(null);

    const markers = useMemo(() => {
        return events.map((e, i) => ({
            ...e,
            id: i,
            position: {
                lat: e.location?.latitude,
                lng: e.location?.longitude,
            },
        }));
    }, [events]);

    const handleCenterChanged = useCallback((map: any) => {
        if (!map) return;
        const newCenter = map.getCenter();
        setMapState({ ...mapState, view: { ...mapState.view, center: { lat: newCenter.lat(), lng: newCenter.lng() } } });
    }, []);

    const handleZoomChanged = useCallback((map: any) => {
        if (!map) return;
        setMapState({ ...mapState, view: { ...mapState.view, zoom: map.getZoom() } });
    }, []);

    return (
        <div className="absolute inset-0 p-0 overscroll-none">
            <LoadScript googleMapsApiKey="AIzaSyBK7bgczeSwp4EJRg3CWRr1WJyvK_fTjws">
                <GoogleMap
                    options={options}
                    mapContainerStyle={containerStyle}
                    center={mapState.view.center}
                    zoom={mapState.view.zoom}
                    onCenterChanged={(map: any) => handleCenterChanged(map)}
                    onZoomChanged={(map: any) => handleZoomChanged(map)}>
                    {markers.map((marker: any) => (
                        <Marker
                            key={marker.id}
                            position={marker.position}
                            onMouseOver={() => setHoveredMarker(marker.id)}
                            onMouseOut={() => setHoveredMarker(null)}>
                            {hoveredMarker === marker.id && (
                                <InfoWindow position={marker.position} onCloseClick={() => setHoveredMarker(null)}>
                                    <div className="flex flex-col">
                                        <div>
                                            {marker.description || marker.name}
                                        </div>
                                        <div className="flex gap-1">
                                            <div className="p-1 rounded-full bg-gray-300">{marker.year}</div>
                                            {marker.tags.map(tag => (
                                                <div className="p-1 rounded-full bg-gray-300">{tag}</div>
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
