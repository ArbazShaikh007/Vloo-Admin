import React, { useContext, useRef, useState, useEffect } from "react";
import "./AddZone.css";
import { useNavigate, useLocation, useParams } from "react-router-dom";
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

/** Google setup */

const GOOGLE_KEY = process.env.REACT_APP_MAP_KEY
const GOOGLE_MAPS_LIBRARIES = ["places", "drawing", "geometry"];

const AddSubZone = () => {
  const { setreloadZoneList } = useContext(GlobalContext);
  const navigate = useNavigate();
  const location = useLocation();
  const { zoneId } = useParams(); // optional, if you later re-enable param route

  // Parent zone can come via navigation state (recommended)
  const parentZone = location?.state?.parentZone || null;

  /** ----------------- Refs ----------------- */
  const mapRef = useRef(null);
  const autocompleteRef = useRef(null);
  const parentPolyRef = useRef(null); // google.maps.Polygon (parent outline)
  const polygonRef = useRef(null);    // drawn subzone
  const listenersRef = useRef([]);
  const clearBtnRef = useRef(null);

  /** ----------------- State ----------------- */
  const [loading, setLoading] = useState(false);
  const [scriptReady, setScriptReady] = useState(false);
  const [locality, setLocality] = useState("");
  const [sublocality, setSublocality] = useState("");
  const [fullAddress, setFullAddress] = useState("");
  const [placeId, setPlaceId] = useState("");
  const [centroid, setCentroid] = useState(null);
  const [pathLatLng, setPathLatLng] = useState([]);
  const [mapCenter, setMapCenter] = useState({ lat: 24.7136, lng: 46.6753 }); // Riyadh
  const [parentGeoJSON, setParentGeoJSON] = useState(() => {
    const gj =
      parentZone?.polygon_geojson &&
      (typeof parentZone.polygon_geojson === "string"
        ? safeJSON(parentZone.polygon_geojson)
        : parentZone.polygon_geojson);
    return fixPolygon(gj);
  });

  const MyToken = JSON.parse(localStorage.getItem("MYtokan"));

  /** ----------------- Helpers ----------------- */
  function safeJSON(str) {
    try {
      return JSON.parse(str);
    } catch {
      return null;
    }
  }

  // Ensure ring is closed, has at least 3 vertices
  function fixPolygon(gj) {
    try {
      if (!gj || gj.type !== "Polygon") return null;
      const ring = gj.coordinates?.[0];
      if (!Array.isArray(ring) || ring.length < 3) return null;
      const first = ring[0];
      const last = ring[ring.length - 1];
      if (first[0] !== last[0] || first[1] !== last[1]) {
        ring.push(first);
      }
      return { type: "Polygon", coordinates: [ring] };
    } catch {
      return null;
    }
  }

  function extractCityArea(components = []) {
    let city = "";
    let area = "";
    components.forEach((c) => {
      if (c.types.includes("locality")) city = c.long_name;
      if (c.types.includes("sublocality") || c.types.includes("sublocality_level_1"))
        area = c.long_name;
    });
    return { city, area };
  }

  function computeCentroid(points) {
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
      const sx = points.reduce((s, p) => s + p.lat, 0) / points.length;
      const sy = points.reduce((s, p) => s + p.lng, 0) / points.length;
      return { lat: sx, lng: sy };
    }
    area *= 0.5;
    cx /= 6 * area;
    cy /= 6 * area;
    return { lat: cx, lng: cy };
  }

  function polygonPathToGeoJSON(pts) {
    if (!Array.isArray(pts) || pts.length < 3) return null;
    const ring = pts.map((p) => [p.lng, p.lat]);
    const first = ring[0];
    const last = ring[ring.length - 1];
    if (first[0] !== last[0] || first[1] !== last[1]) ring.push(first);
    return { type: "Polygon", coordinates: [ring] };
  }

  function clearPolygon() {
    const g = window.google?.maps;
    if (g) {
      listenersRef.current.forEach((l) => g.event.removeListener(l));
      listenersRef.current = [];
    }
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
  }

  /** ----------------- Parent outline drawing ----------------- */
  function drawParentOutline(map, gj) {
    try {
      if (!map || !gj) return;
      const g = window.google.maps;

      // Convert to {lat,lng}
      const coords = gj.coordinates?.[0]?.map(([lng, lat]) => ({ lat, lng })) || [];
      if (!coords.length) return;

      // Remove old
      if (parentPolyRef.current) {
        parentPolyRef.current.setMap(null);
        parentPolyRef.current = null;
      }

      // Outline only: fillOpacity = 0
      const poly = new g.Polygon({
        paths: coords,
        strokeColor: "#0b6b63",
        strokeOpacity: 0.95,
        strokeWeight: 2,
        fillColor: "#0b6b63",
        fillOpacity: 0,
        clickable: false,
        editable: false,
        map,
      });
      parentPolyRef.current = poly;

      // Fit bounds to outline
      const bounds = new g.LatLngBounds();
      coords.forEach((c) => bounds.extend(new g.LatLng(c.lat, c.lng)));
      map.fitBounds(bounds, 24);

      console.log("[Parent] coords len:", coords.length);
    } catch (e) {
      console.warn("drawParentOutline error:", e);
    }
  }

  /** ----------------- Google script ready ----------------- */
  const handleScriptLoad = () => {
    let tries = 0;
    const max = 25;
    const tick = () => {
      const ready =
        !!window.google?.maps?.drawing &&
        !!window.google?.maps?.places &&
        !!window.google?.maps?.geometry;
      if (ready) {
        setScriptReady(true);
      } else if (tries < max) {
        tries += 1;
        setTimeout(tick, 100);
      } else {
        console.warn("Google drawing/places/geometry libraries not ready.");
        setScriptReady(false);
      }
    };
    tick();
  };

  /** ----------------- Place search ----------------- */
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

  /** ----------------- Drawing a sub-zone ----------------- */
  const onPolygonComplete = async (polygon) => {
    clearPolygon(); // only one shape at a time
    const g = window.google.maps;
    polygonRef.current = polygon;
    polygon.setEditable(true);

    const path = polygon.getPath();
    const pts = path.getArray().map((ll) => ({ lat: ll.lat(), lng: ll.lng() }));
    setPathLatLng(pts);

    // Validate: all vertices inside parent polygon
    if (parentPolyRef.current) {
      const outside = pts.filter((p) => {
        const inside = g.geometry.poly.containsLocation(
          new g.LatLng(p.lat, p.lng),
          parentPolyRef.current
        );
        return !inside;
      });
      if (outside.length) {
        toast.error("Sub-zone must be inside the parent zone.", { position: "top-right" });
        polygon.setMap(null);
        polygonRef.current = null;
        setPathLatLng([]);
        return;
      }
    }

    const c = computeCentroid(pts);
    setCentroid(c);

    if (c) {
      const geocoder = new g.Geocoder();
      geocoder.geocode({ location: c }, (results, status) => {
        if (status === "OK" && results?.length) {
          const best = results[0];
          setPlaceId(best.place_id || "");
          setFullAddress(best.formatted_address || "");
          const { city, area } = extractCityArea(best.address_components || []);
          setLocality(city);
          setSublocality(area);
        }
      });
    }

    const updateFromPath = () => {
      const updated = path.getArray().map((ll) => ({ lat: ll.lat(), lng: ll.lng() }));
      setPathLatLng(updated);
      const c2 = computeCentroid(updated);
      setCentroid(c2);
    };

    listenersRef.current.push(
      g.event.addListener(path, "set_at", updateFromPath),
      g.event.addListener(path, "insert_at", updateFromPath),
      g.event.addListener(path, "remove_at", updateFromPath)
    );
  };

  /** ----------------- Map controls ----------------- */
  function addClearControl(map) {
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
  }
  function removeClearControl(map) {
    try {
      const g = window.google?.maps;
      if (!g || !map || !clearBtnRef.current) return;
      const arr = map.controls[g.ControlPosition.TOP_LEFT];
      const idx = Array.from(arr).indexOf(clearBtnRef.current);
      if (idx > -1) arr.removeAt(idx);
    } catch {}
    clearBtnRef.current = null;
  }

  /** ----------------- Submit ----------------- */
  const onSubmit = async (values, { resetForm }) => {
    try {
      if (!centroid || !pathLatLng.length) {
        toast.error("Please draw the sub-zone first.", { position: "top-right" });
        return;
      }
      const polygonGeoJSON = polygonPathToGeoJSON(pathLatLng);
      if (!polygonGeoJSON) {
        toast.error("Invalid polygon.", { position: "top-right" });
        return;
      }

      setLoading(true);
      const parentId = parentZone?.id || zoneId; // prefer passed zone, fallback to param

      console.log("[Submit] parent_zone_id:", parentId);
      const res = await axios.post(
        "/admin_view/add_sub_zone",
        {
          subzone_name: values.Name,
          parent_zone_id: parentId,
          zone_city: locality,
          zone_area: sublocality,
          address: fullAddress,
          place_id: placeId,
          lat: centroid.lat,
          long: centroid.lng,
          polygon_path: pathLatLng,
          polygon_geojson: polygonGeoJSON,
        },
        {
          headers: { "Content-Type": "application/json", Authorization: `${MyToken}` },
        }
      );

      toast.success(res?.data?.message || "Sub-zone created.", { position: "top-right" });
      setreloadZoneList(true);
      resetForm();
      clearPolygon();
      navigate(-1);
    } catch (err) {
      console.error("add_sub_zone error:", err);
      toast.error("Failed to create sub-zone.", { position: "top-right" });
    } finally {
      setLoading(false);
    }
  };

  const formik = useFormik({
    initialValues: { Name: "" },
    onSubmit,
    validate: (v) => {
      const e = {};
      if (!v.Name) e.Name = "Sub-zone name is required";
      return e;
    },
  });

  /** ----------------- Effects ----------------- */
  // Log parent inputs once
  useEffect(() => {
    console.log("[ParentZone] raw:", parentZone);
    console.log("[Parent GeoJSON] fixed:", parentGeoJSON);
  }, []); // eslint-disable-line

  // When map + script ready and parent GeoJSON present, draw it and fit
  useEffect(() => {
    if (mapRef.current && scriptReady && parentGeoJSON) {
      drawParentOutline(mapRef.current, parentGeoJSON);
    }
  }, [scriptReady, parentGeoJSON]);

  /** ----------------- Render ----------------- */
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
              <h1>Add New SubZone</h1>
            </div>
          </div>

          {/* Form */}
          <div className="form-card">
            <form className="zone-form" onSubmit={formik.handleSubmit}>
              <div className="form-group">
                <label className="form-label">
                  SubZone Name <span className="required">*</span>
                </label>
                <input
                  type="text"
                  name="Name"
                  value={formik.values.Name}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={`form-input ${
                    formik.errors.Name && formik.touched.Name ? "error" : ""
                  }`}
                  placeholder="Enter sub-zone name"
                />
                {formik.errors.Name && formik.touched.Name && (
                  <p className="error-message">{formik.errors.Name}</p>
                )}
              </div>

              {/* Map */}
              <div className="form-group">
                <label className="form-label">
                  Draw SubZone <span className="required">*</span>
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
                      onLoad={(ac) => (autocompleteRef.current = ac)}
                      onPlaceChanged={handlePlaceChanged}
                    >
                      <div className="search-input-container">
                        <FiSearch className="search-icon" size={20} />
                        <input
                          type="text"
                          placeholder="Search to move the map (city/area/address)"
                          className="search-input"
                        />
                      </div>
                    </Autocomplete>
                  </div>

                  {(fullAddress || placeId) && (
                    <div className="selected-address">
                      <FiMapPin size={16} />
                      <span style={{ marginInlineStart: 8 }}>
                        {fullAddress || "Center resolved"}
                      </span>
                    </div>
                  )}

                  <div style={{ width: "100%", height: 420, borderRadius: 12 }}>
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
                        // If parent is ready, draw + fit immediately
                        if (parentGeoJSON && window.google?.maps) {
                          drawParentOutline(map, parentGeoJSON);
                        }
                      }}
                      onUnmount={(map) => {
                        removeClearControl(map);
                        mapRef.current = null;
                      }}
                      options={{
                        streetViewControl: false,
                        mapTypeControl: false,
                        fullscreenControl: true,
                        clickableIcons: false,
                        // visual tweak so the parent outline stands out a bit
                        draggableCursor: "crosshair",
                      }}
                    >
                      {/* Draw tool */}
                      {scriptReady && window.google?.maps?.drawing && (
                        <DrawingManager
                          onPolygonComplete={onPolygonComplete}
                          options={{
                            drawingControl: true,
                            drawingControlOptions: {
                              position: window.google.maps.ControlPosition.TOP_LEFT,
                              drawingModes: [
                                window.google.maps.drawing.OverlayType.POLYGON,
                              ],
                            },
                            polygonOptions: {
                              fillOpacity: 0.18,
                              strokeWeight: 2,
                              editable: true,
                            },
                          }}
                        />
                      )}

                      {centroid && <Marker position={centroid} />}
                    </GoogleMap>
                  </div>
                </LoadScriptNext>
              </div>

              {/* Details */}
              {(locality || sublocality || centroid || parentZone) && (
                <div className="zone-details">
                  <h3>Details</h3>
                  <div className="details-grid">
                    {parentZone && (
                      <div className="detail-item">
                        <span className="detail-label">Parent Zone:</span>
                        <span className="detail-value">{parentZone.zone_name}</span>
                      </div>
                    )}
                    {locality && (
                      <div className="detail-item">
                        <span className="detail-label">City:</span>
                        <span className="detail-value">{locality}</span>
                      </div>
                    )}
                    {sublocality && (
                      <div className="detail-item">
                        <span className="detail-label">Area:</span>
                        <span className="detail-value">{sublocality}</span>
                      </div>
                    )}
                    {centroid && (
                      <div className="detail-item">
                        <span className="detail-label">Center (lat,lng):</span>
                        <span className="detail-value">
                          {centroid.lat.toFixed(6)}, {centroid.lng.toFixed(6)}
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
                  disabled={loading || !formik.values.Name || !centroid}
                >
                  {loading ? (
                    <>
                      <FiLoader className="loading-icon" size={20} />
                      Creating SubZone...
                    </>
                  ) : (
                    <>
                      <FiMapPin size={20} />
                      Create SubZone
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
            zIndex: (theme) => theme.zIndex.drawer + 1,
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

export default AddSubZone;
