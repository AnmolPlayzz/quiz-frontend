"use client";
import React, { useEffect, useCallback, useRef } from "react";

function Map({ country }) {
    const mapRef = useRef(null);
    const mapInstanceRef = useRef(null);
    const createMap = useCallback(() => {
        if (!mapInstanceRef.current) {
            mapInstanceRef.current = L.map(mapRef.current, {
                center: [20, 0], 
                zoom: 1.5,
                minZoom: 1,
                maxZoom: 13,
                worldCopyJump: false,
            });
            const bounds = [
                [-90, -180], 
                [90, 180],   
            ];
            mapInstanceRef.current.setMaxBounds(bounds);
            mapInstanceRef.current.on("drag", () => {
                mapInstanceRef.current.panInsideBounds(bounds, { animate: false });
            });
        }
        const map = mapInstanceRef.current;
        map.eachLayer((layer) => {
            if (!layer._url) {
                map.removeLayer(layer);
            }
        });
        const geojsonUrl =
            "https://raw.githubusercontent.com/johan/world.geo.json/master/countries.geo.json";
        fetch(geojsonUrl)
            .then((response) => response.json())
            .then((data) => {
                const geojsonLayer = L.geoJSON(data, {
                    style: (feature) => ({
                        color: "black",
                        weight: 2,
                        fillColor: feature.properties.name === country ? "blue" : "white",
                        fillOpacity: 0.7,
                    }),
                });
                geojsonLayer.addTo(map);
                const countryFeature = data.features.find(
                    (feature) => feature.properties.name === country
                );
                if (countryFeature) {
                    const countryBounds = L.geoJSON(countryFeature).getBounds();
                    map.fitBounds(countryBounds, { padding: [20, 20] });
                }
            })
            .catch((err) => console.error("Error loading GeoJSON:", err));
    }, [country]);
    useEffect(() => {
        createMap();
    }, [createMap]);
    return (
        <div
            ref={mapRef}
            className="w-1/2 h-1/2 m-auto"
            style={{ height: "500px", width: "100%" }}
        ></div>
    );
}

export default Map;
