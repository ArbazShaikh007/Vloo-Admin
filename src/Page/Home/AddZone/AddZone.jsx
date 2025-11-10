import React, { useContext, useEffect, useRef, useState } from "react";
import "./AddZone.css";
import { useNavigate } from "react-router-dom";
import { FiArrowLeft, FiMapPin, FiSearch, FiLoader } from "react-icons/fi";
import axios from "../../../Common/Api/Api";
import { useFormik } from "formik";
import { toast, Toaster } from "react-hot-toast";
import { GlobalContext } from "../../../GlobalContext";
import {
  Autocomplete,
  GoogleMap,
  LoadScriptNext,
  Marker,
  DrawingManager,
} from "@react-google-maps/api";
import Loader from "../../../Common/loader";
import Backdrop from "@mui/material/Backdrop";

/** Keep these stable */
const GOOGLE_MAPS_LIBRARIES = ["places", "drawing", "geometry"];
const GOOGLE_KEY = process.env.REACT_APP_MAP_KEY;

const AddZone = () => {
  const { setreloadZoneList } = useContext(GlobalContext);
  const navigate = useNavigate();

  // Refs
  const autocompleteRef = useRef(null);
  const polygonRef = useRef(null);
  const listenersRef = useRef([]);
  const mapRef = useRef(null);
  const clearBtnRef = useRef(null);

  // keep track of existing zone polygons on map
  const existingPolygonsRef = useRef([]);

  // State
  const [loading, setloading] = useState(false);
  const [scriptReady, setScriptReady] = useState(false); // <- only true when drawing lib is ready
  const [mapReady, setMapReady] = useState(false); // map instance ready
  const [locality, setLocality] = useState("");
  const [sublocality, setSublocality] = useState("");
  const [FullAddress, setFullAddress] = useState("");
  const [placeId, setPlaceId] = useState("");
  const [centroid, setCentroid] = useState(null);
  const [pathLatLng, setPathLatLng] = useState([]);
  const [mapCenter, setMapCenter] = useState({ lat: 24.7136, lng: 46.6753 }); // Riyadh

  // existing zones list for map only
  const [existingZones, setExistingZones] = useState([]);

  const MyToken = JSON.parse(localStorage.getItem("MYtokan"));

  /** ---- helpers ---- */
  const extractCityArea = (components) => {
    let city = "",
      area = "";
    (components || []).forEach((c) => {
      if (c.types.includes("locality")) city = c.long_name;
      if (
        c.types.includes("sublocality") ||
        c.types.includes("sublocality_level_1")
      )
        area = c.long_name;
    });
    return { city, area };
  };

  const computePolygonCentroid = (points) => {
    if (!points || points.length < 3) return null;
    let area = 0,
      cx = 0,
      cy = 0;
    for (let i = 0, j = points.length - 1; i < points.length; j = i++) {
      const p1 = points[j],
        p2 = points[i];
      const f = p1.lat * p2.lng - p2.lat * p1.lng;
      area += f;
      cx += (p1.lat + p2.lat) * f;
      cy += (p1.lng + p2.lng) * f;
    }
    if (area === 0) {
      // fallback to average
      const sx = points.reduce((s, p) => s + p.lat, 0) / points.length;
      const sy = points.reduce((s, p) => s + p.lng, 0) / points.length;
      return { lat: sx, lng: sy };
    }
    area *= 0.5;
    cx /= 6 * area;
    cy /= 6 * area;
    return { lat: cx, lng: cy };
  };

  const reverseGeocodeToPlaceId = async (latLng) => {
    const g = window.google?.maps;
    if (!g) return null;
    const geocoder = new g.Geocoder();
    return new Promise((resolve) => {
      geocoder.geocode({ location: latLng }, (results, status) => {
        if (status === "OK" && results?.length) {
          const best = results[0];
          resolve({
            place_id: best.place_id,
            formatted_address: best.formatted_address,
            address_components: best.address_components || [],
          });
        } else resolve(null);
      });
    });
  };

  // convert drawn path to GeoJSON Polygon (outer ring), closing the ring
  const polygonPathToGeoJSON = (pts) => {
    if (!Array.isArray(pts) || pts.length < 3) return null;
    const ring = pts.map((p) => [p.lng, p.lat]); // GeoJSON is [lng, lat]
    const first = ring[0];
    const last = ring[ring.length - 1];
    if (first[0] !== last[0] || first[1] !== last[1]) ring.push(first);
    return {
      type: "Polygon",
      coordinates: [ring],
    };
  };

  const clearPolygon = () => {
    const g = window.google?.maps;
    if (g) {
      listenersRef.current.forEach((l) => g.event.removeListener(l));
    }
    listenersRef.current = [];
    if (polygonRef.current) {
      polygonRef.current.setMap(null);
      polygonRef.current = null;
    }
    setPathLatLng([]);
    setCentroid(null);
    setPlaceId("");
    setFullAddress("");
    setLocality("");
    setSublocality("");
  };

  /** ✅ OVERLAP CHECK: prevent drawing over existing zones */
  const isOverlappingExistingZones = (pts) => {
    const g = window.google?.maps;
    if (!g || !g.geometry || !g.geometry.poly) return false;
    if (!existingPolygonsRef.current.length) return false;
    if (!Array.isArray(pts) || pts.length < 3) return false;

    const newPath = pts.map(
      (p) => new g.LatLng(Number(p.lat), Number(p.lng))
    );
    const newPolygon = new g.Polygon({ paths: newPath });

    for (const existingPoly of existingPolygonsRef.current) {
      if (!existingPoly || !existingPoly.getPath) continue;

      const existingPath = existingPoly.getPath().getArray();

      // 1) any NEW point inside existing polygon
      for (const pt of newPath) {
        if (g.geometry.poly.containsLocation(pt, existingPoly)) {
          return true;
        }
      }

      // 2) any EXISTING polygon vertex inside new polygon
      for (const v of existingPath) {
        if (g.geometry.poly.containsLocation(v, newPolygon)) {
          return true;
        }
      }
    }

    return false;
  };

  /** ---- Search box ---- */
  const handlePlaceChanged = () => {
    const place = autocompleteRef.current?.getPlace();
    if (!place?.geometry) return;
    const lat = place.geometry.location.lat();
    const lng = place.geometry.location.lng();
    setMapCenter({ lat, lng });

    setFullAddress(place.formatted_address || "");
    setPlaceId(place.place_id || "");
    const { city, area } = extractCityArea(place.address_components || []);
    setLocality(city);
    setSublocality(area);
  };

  /** ---- When user finishes drawing a polygon ---- */
  const onPolygonComplete = async (polygon) => {
    clearPolygon();
    const g = window.google.maps;
    polygonRef.current = polygon;
    polygon.setEditable(true);

    const path = polygon.getPath();
    const pts = path.getArray().map((ll) => ({
      lat: ll.lat(),
      lng: ll.lng(),
    }));

    // ✅ OVERLAP CHECK here
    if (isOverlappingExistingZones(pts)) {
      toast.error("New zone overlaps with an existing zone.", {
        position: "top-right",
      });
      polygon.setMap(null);
      polygonRef.current = null;
      setPathLatLng([]);
      setCentroid(null);
      setPlaceId("");
      setFullAddress("");
      setLocality("");
      setSublocality("");
      return;
    }

    setPathLatLng(pts);

    const c = computePolygonCentroid(pts);
    setCentroid(c);

    if (c) {
      const rev = await reverseGeocodeToPlaceId(c);
      if (rev) {
        setPlaceId(rev.place_id);
        setFullAddress(rev.formatted_address);
        const { city, area } = extractCityArea(rev.address_components);
        setLocality(city);
        setSublocality(area);
      }
    }

    const updateFromPath = async () => {
      const updated = path.getArray().map((ll) => ({
        lat: ll.lat(),
        lng: ll.lng(),
      }));

      // ✅ re-check on edit/move as well
      if (isOverlappingExistingZones(updated)) {
        toast.error("Updated zone overlaps with an existing zone.", {
          position: "top-right",
        });
        // revert visual polygon: just clear and force user to redraw
        polygon.setMap(null);
        polygonRef.current = null;
        clearPolygon();
        return;
      }

      setPathLatLng(updated);
      const cc = computePolygonCentroid(updated);
      setCentroid(cc);
      if (cc) {
        const rev2 = await reverseGeocodeToPlaceId(cc);
        if (rev2) {
          setPlaceId(rev2.place_id);
          setFullAddress(rev2.formatted_address);
          const { city, area } = extractCityArea(
            rev2.address_components
          );
          setLocality(city);
          setSublocality(area);
        }
      }
    };

    listenersRef.current.push(
      g.event.addListener(path, "set_at", updateFromPath),
      g.event.addListener(path, "insert_at", updateFromPath),
      g.event.addListener(path, "remove_at", updateFromPath)
    );
  };

  /** ---- Real map control: Clear shape ---- */
  const addClearControl = (map) => {
    const g = window.google?.maps;
    if (!g || !map || clearBtnRef.current) return;
    const div = document.createElement("div");
    div.textContent = "Clear shape";
    Object.assign(div.style, {
      background: "#fff",
      borderRadius: "8px",
      boxShadow: "0 2px 8px rgba(0,0,0,.15)",
      padding: "8px 10px",
      margin: "10px",
      font: "500 13px/1 system-ui, -apple-system, Segoe UI, Roboto",
      cursor: "pointer",
    });
    div.addEventListener("click", clearPolygon);
    map.controls[g.ControlPosition.TOP_LEFT].push(div);
    clearBtnRef.current = div;
  };

  const removeClearControl = (map) => {
    try {
      const g = window.google?.maps;
      if (!g || !map || !clearBtnRef.current) return;
      const ctrlArr = map.controls[g.ControlPosition.TOP_LEFT];
      const asArray = Array.from(ctrlArr);
      const idx = asArray.indexOf(clearBtnRef.current);
      if (idx > -1) ctrlArr.removeAt(idx);
    } catch {}
    clearBtnRef.current = null;
  };

  /** ---- Fetch existing zones once ---- */
  const fetchExistingZones = async () => {
    try {
      const res = await axios.post(
        "/admin_view/zone_list",
        { page: 1, keyword: "" },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `${MyToken}`,
          },
        }
      );
      setExistingZones(res?.data?.zone_list || []);
    } catch (error) {
      console.log("fetchExistingZones error:", error);
      setExistingZones([]);
    }
  };

  useEffect(() => {
    fetchExistingZones();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /** ---- Draw existing zone polygons on the map (non-editable) ---- */
  useEffect(() => {
    const g = window.google?.maps;
    const map = mapRef.current;

    if (!g || !map || !scriptReady || !mapReady) return;
    if (!Array.isArray(existingZones)) return;

    // Clear previous polygons
    existingPolygonsRef.current.forEach((poly) => poly.setMap(null));
    existingPolygonsRef.current = [];

    existingZones.forEach((z) => {
      try {
        const rawPath = z.polygon_path || z.zone_polygon_path;
        if (!rawPath) return;

        let arr = rawPath;
        if (typeof rawPath === "string") {
          try {
            arr = JSON.parse(rawPath);
          } catch {
            arr = null;
          }
        }

        if (Array.isArray(arr) && arr.length) {
          const poly = new g.Polygon({
            paths: arr,
            strokeColor: "#2563eb",
            strokeOpacity: 0.9,
            strokeWeight: 2,
            fillColor: "#93c5fd",
            fillOpacity: 0.18,
            clickable: false,
            editable: false,
          });
          poly.setMap(map);
          existingPolygonsRef.current.push(poly);
        }
      } catch (err) {
        console.log("draw polygon error:", err);
      }
    });
  }, [existingZones, scriptReady, mapReady]);

  /** ---- Form ---- */
  const onSubmit = async (values, { resetForm }) => {
    try {
      if (!centroid || !placeId) {
        toast.error("Please draw a polygon first.", {
          position: "top-right",
        });
        return;
      }

      const polygonGeoJSON = polygonPathToGeoJSON(pathLatLng);
      if (!polygonGeoJSON) {
        toast.error(
          "Invalid polygon. Please draw at least 3 points.",
          { position: "top-right" }
        );
        return;
      }

      setloading(true);
      const response = await axios.post(
        "/admin_view/add_zone",
        {
          zone_name: values.Name,
          zone_city: locality,
          zone_area: sublocality,
          address: FullAddress,
          place_id: placeId,
          lat: centroid.lat,
          long: centroid.lng,
          polygon_path: pathLatLng,
          polygon_geojson: polygonGeoJSON,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `${MyToken}`,
          },
        }
      );
      toast.success(response.data.message, {
        position: "top-right",
      });
      setreloadZoneList(true);
      resetForm();
      clearPolygon();
      navigate(-1);
    } catch (error) {
      console.log("onSubmit error:", error);
      toast.error("Failed to add zone.", { position: "top-right" });
    } finally {
      setloading(false);
    }
  };

  const formik = useFormik({
    initialValues: { Name: "" },
    onSubmit,
    validate: (v) => {
      const e = {};
      if (!v.Name) e.Name = "Zone name is required";
      return e;
    },
  });

  /** ---- Wait for drawing lib: robust check + tiny retry loop ---- */
  const handleScriptLoad = () => {
    let tries = 0;
    const max = 20; // ~2s total
    const tick = () => {
      const ready =
        !!window.google?.maps?.drawing &&
        !!window.google?.maps?.places;
      if (ready) {
        setScriptReady(true);
      } else if (tries < max) {
        tries += 1;
        setTimeout(tick, 100);
      } else {
        setScriptReady(false);
        console.warn("Google drawing library not available.");
      }
    };
    tick();
  };

  return (
    <>
      <div className="add-zone-container">
        <div className="add-zone-wrapper">
          {/* Header */}
          <div className="header-section">
            <button className="back-button" onClick={() => navigate(-1)}>
              <FiArrowLeft size={20} />
              <span>Back</span>
            </button>
            <div className="header-title">
              <FiMapPin className="header-icon" size={24} />
              <h1>Add New Zone</h1>
            </div>
          </div>

          {/* Form Card */}
          <div className="form-card">
            <form className="zone-form" onSubmit={formik.handleSubmit}>
              <div className="form-group">
                <label className="form-label">
                  Zone Name <span className="required">*</span>
                </label>
                <input
                  type="text"
                  name="Name"
                  value={formik.values.Name}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={`form-input ${
                    formik.errors.Name && formik.touched.Name
                      ? "error"
                      : ""
                  }`}
                  placeholder="Enter zone name"
                />
                {formik.errors.Name && formik.touched.Name && (
                  <p className="error-message">
                    {formik.errors.Name}
                  </p>
                )}
              </div>

              {/* Map Section */}
              <div className="form-group">
                <label className="form-label">
                  Draw Zone <span className="required">*</span>
                </label>

                <LoadScriptNext
                  id="vloo-maps"
                  googleMapsApiKey={GOOGLE_KEY}
                  libraries={GOOGLE_MAPS_LIBRARIES}
                  onLoad={handleScriptLoad}
                >
                  {/* Search box */}
                  <div className="location-search-container">
                    <Autocomplete
                      onLoad={(ac) =>
                        (autocompleteRef.current = ac)
                      }
                      onPlaceChanged={handlePlaceChanged}
                    >
                      <div className="search-input-container">
                        <FiSearch
                          className="search-icon"
                          size={20}
                        />
                        <input
                          type="text"
                          placeholder="Search to move the map (city/area/address)"
                          className="search-input"
                        />
                      </div>
                    </Autocomplete>
                  </div>

                  {(FullAddress || placeId) && (
                    <div className="selected-address">
                      <FiMapPin size={16} />
                      <span
                        style={{ marginInlineStart: 8 }}
                      >
                        {FullAddress || "Center resolved"}
                      </span>
                    </div>
                  )}

                  <div
                    style={{
                      width: "100%",
                      height: "400px",
                      borderRadius: 12,
                    }}
                  >
                    <GoogleMap
                      mapContainerStyle={{
                        width: "100%",
                        height: "100%",
                        borderRadius: "12px",
                        overflow: "hidden",
                      }}
                      center={mapCenter}
                      zoom={13}
                      onLoad={(map) => {
                        mapRef.current = map;
                        addClearControl(map);
                        setMapReady(true);
                      }}
                      onUnmount={(map) => {
                        removeClearControl(map);
                        mapRef.current = null;
                        setMapReady(false);
                      }}
                      options={{
                        streetViewControl: false,
                        mapTypeControl: false,
                        fullscreenControl: true,
                        clickableIcons: false,
                      }}
                    >
                      {/* existing zones polygons already drawn via useEffect */}

                      {/* Drawing tools for new zone */}
                      {scriptReady &&
                        window.google?.maps?.drawing && (
                          <DrawingManager
                            onPolygonComplete={
                              onPolygonComplete
                            }
                            options={{
                              drawingControl: true,
                              drawingControlOptions: {
                                position:
                                  window.google.maps
                                    .ControlPosition
                                    .TOP_LEFT,
                                drawingModes: [
                                  window.google.maps
                                    .drawing
                                    .OverlayType.POLYGON,
                                ],
                              },
                              polygonOptions: {
                                fillOpacity: 0.15,
                                strokeWeight: 2,
                                editable: true,
                              },
                            }}
                          />
                        )}

                      {centroid && (
                        <Marker position={centroid} />
                      )}
                    </GoogleMap>
                  </div>
                </LoadScriptNext>
              </div>

              {/* Zone details */}
              {(locality ||
                sublocality ||
                centroid) && (
                <div className="zone-details">
                  <h3>Zone Details</h3>
                  <div className="details-grid">
                    {locality && (
                      <div className="detail-item">
                        <span className="detail-label">
                          City:
                        </span>
                        <span className="detail-value">
                          {locality}
                        </span>
                      </div>
                    )}
                    {sublocality && (
                      <div className="detail-item">
                        <span className="detail-label">
                          Area:
                        </span>
                        <span className="detail-value">
                          {sublocality}
                        </span>
                      </div>
                    )}
                    {centroid && (
                      <div className="detail-item">
                        <span className="detail-label">
                          Center (lat,lng):
                        </span>
                        <span className="detail-value">
                          {centroid.lat.toFixed(
                            6
                          )}
                          ,{" "}
                          {centroid.lng.toFixed(
                            6
                          )}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Submit */}
              <div className="form-actions">
                <button
                  type="submit"
                  className="submit-button"
                  disabled={
                    loading ||
                    !formik.values.Name ||
                    !centroid ||
                    !placeId
                  }
                >
                  {loading ? (
                    <>
                      <FiLoader
                        className="loading-icon"
                        size={20}
                      />
                      Creating Zone...
                    </>
                  ) : (
                    <>
                      <FiMapPin size={20} />
                      Create Zone
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {loading && (
        <Backdrop
          sx={{
            color: "#fff",
            zIndex: (theme) =>
              theme.zIndex.drawer + 1,
            backgroundColor: "#004e61ad",
          }}
          open
        >
          <Loader />
        </Backdrop>
      )}
      <Toaster />
    </>
  );
};

export default AddZone;
