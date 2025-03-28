import { GoogleMap, LoadScript } from "@react-google-maps/api";
import { useCallback } from "react";

const containerStyle = { width: "100vw", height: "100vh" };

const options = {
    fullscreenControl: false, // Disable fullscreen button
    zoomControl: true,
    mapTypeControl: true,
    streetViewControl: true,
};

export default function WTGoogleMap(props: any) {
    const { mapState, setMapState } = props;

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
                    onZoomChanged={(map: any) => handleZoomChanged(map)}
                />
            </LoadScript>
        </div>
    );
}
