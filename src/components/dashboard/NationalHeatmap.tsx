"use client";

import "maplibre-gl/dist/maplibre-gl.css";

import { useMemo, useState } from "react";
import Map, { Layer, Popup, Source } from "react-map-gl/maplibre";
import type { LayerProps, MapLayerMouseEvent } from "react-map-gl/maplibre";
import type { Feature, FeatureCollection, Point } from "geojson";

const mapStyle = "https://basemaps.cartocdn.com/gl/positron-gl-style/style.json";

type FraudPointProperties = {
  id: string;
  intensity: number;
  fraud_cases: number;
};

type FraudFeatureCollection = FeatureCollection<Point, FraudPointProperties>;

const heatmapLayer: LayerProps = {
  id: "heatmap",
  type: "heatmap",
  source: "fraud-points",
  maxzoom: 12,
  paint: {
    "heatmap-weight": ["get", "intensity"],
    "heatmap-intensity": ["interpolate", ["linear"], ["zoom"], 4, 0.8, 8, 1.2, 12, 1.8],
    "heatmap-radius": ["interpolate", ["linear"], ["zoom"], 4, 12, 7, 24, 10, 40],
    "heatmap-opacity": ["interpolate", ["linear"], ["zoom"], 4, 1, 8, 0.6, 11, 0.2],
    "heatmap-color": [
      "interpolate",
      ["linear"],
      ["heatmap-density"],
      0,
      "rgba(0,0,0,0)",
      0.2,
      "#22c55e",
      0.5,
      "#facc15",
      0.8,
      "#f97316",
      1,
      "#E31837",
    ],
  },
};

const pointLayer: LayerProps = {
  id: "heatmap-points",
  type: "circle",
  source: "fraud-points",
  minzoom: 6.5,
  paint: {
    "circle-radius": ["interpolate", ["linear"], ["zoom"], 7, 4, 10, 7, 12, 9],
    "circle-color": "#ffffff",
    "circle-stroke-color": "#E31837",
    "circle-stroke-width": 2,
    "circle-opacity": ["interpolate", ["linear"], ["zoom"], 6, 0, 7, 0.6, 8, 1],
  },
};

// Empty GeoJSON shown while loading
const EMPTY_GEOJSON: FraudFeatureCollection = {
  type: "FeatureCollection",
  features: [],
};

type NationalHeatmapProps = {
  data?: FraudFeatureCollection | null;
  isLoading?: boolean;
};

export default function NationalHeatmap({ data, isLoading = false }: NationalHeatmapProps) {
  const geoJsonData = useMemo<FraudFeatureCollection>(() => {
    if (!data) return EMPTY_GEOJSON;
    return data;
  }, [data]);

  const [popupInfo, setPopupInfo] = useState<{
    longitude: number;
    latitude: number;
    id: string;
    fraudCases: number;
  } | null>(null);

  const handlePointClick = (event: MapLayerMouseEvent) => {
    const feature = event.features?.[0];
    if (!feature || feature.geometry.type !== "Point") return;

    const [longitude, latitude] = feature.geometry.coordinates as [number, number];
    const properties = feature.properties as FraudPointProperties | null;

    if (!properties) return;

    setPopupInfo({
      longitude,
      latitude,
      id: properties.id,
      fraudCases: properties.fraud_cases,
    });
  };

  return (
    <div className="relative h-130 w-full overflow-hidden rounded-2xl border border-slate-200/60 shadow-sm">
      {/* Loading Overlay */}
      {isLoading && (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-white/70 backdrop-blur-sm rounded-2xl">
          <div className="flex flex-col items-center gap-3">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-[var(--primary)]" />
            <p className="text-xs font-semibold text-slate-500">Memuat data peta...</p>
          </div>
        </div>
      )}

      <Map
        initialViewState={{
          longitude: 113.9213,
          latitude: -2.5,
          zoom: 4.5,
        }}
        mapStyle={mapStyle}
        interactiveLayerIds={["heatmap-points"]}
        onClick={handlePointClick}
        style={{ width: "100%", height: "100%" }}
      >
        <Source id="fraud-points" type="geojson" data={geoJsonData}>
          <Layer {...heatmapLayer} />
          <Layer {...pointLayer} />
        </Source>

        {popupInfo ? (
          <Popup
            longitude={popupInfo.longitude}
            latitude={popupInfo.latitude}
            onClose={() => setPopupInfo(null)}
            closeButton={false}
            closeOnClick={false}
            anchor="bottom"
            offset={12}
            className="text-xs"
          >
            <div className="rounded-lg bg-white px-3 py-2 text-xs text-slate-700 shadow-lg">
              <p className="font-semibold text-slate-900">{popupInfo.id}</p>
              <p className="mt-1 text-slate-500">
                Indikasi Fraud:{" "}
                <span className="font-semibold text-red-600">{popupInfo.fraudCases}</span> Kasus
              </p>
            </div>
          </Popup>
        ) : null}
      </Map>

      {/* Legend */}
      <div className="absolute left-4 top-4 z-10 rounded-xl border border-slate-200 bg-white/90 p-4 shadow-lg backdrop-blur">
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-700">
          Kerapatan Anomali SPBU
        </p>
        <div className="mt-3 h-2 w-40 rounded-full bg-linear-to-r from-lime-400 via-amber-400 to-[#E31837]" />
        <div className="mt-2 flex items-center justify-between text-[10px] text-slate-500">
          <span>Aman</span>
          <span>Padat (Kritis)</span>
        </div>
      </div>

      {/* Station counter badge */}
      {!isLoading && data && (
        <div className="absolute right-4 top-4 z-10 rounded-xl border border-slate-200 bg-white/90 px-3 py-2 shadow-lg backdrop-blur">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
            Total SPBU
          </p>
          <p className="mt-0.5 text-center text-lg font-bold text-slate-900">
            {data.features.length}
          </p>
        </div>
      )}
    </div>
  );
}
