import { useEffect, useMemo, useState } from "react";
import {
  MapContainer,
  Marker,
  TileLayer,
  useMap,
  ZoomControl,
} from "react-leaflet";
import L from "leaflet";
import { Search, MapPin } from "lucide-react";
import "leaflet/dist/leaflet.css";
import { useLoaderData } from "react-router";

const BANGLADESH_CENTER = [23.685, 90.3563];

// Custom marker
const createMarkerIcon = (selected = false) =>
  L.divIcon({
    className: "custom-district-marker",
    html: `
      <div
        style="
          width: ${selected ? "34px" : "26px"};
          height: ${selected ? "34px" : "26px"};
          border-radius: 50% 50% 50% 0;
          background: ${selected ? "#CAEB66" : "#03373D"};
          border: 3px solid white;
          box-shadow: 0 3px 10px rgba(0,0,0,0.25);
          transform: rotate(-45deg);
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s ease;
        "
      >
        <span
          style="
            width: ${selected ? "10px" : "7px"};
            height: ${selected ? "10px" : "7px"};
            border-radius: 50%;
            background: ${selected ? "#03373D" : "#CAEB66"};
          "
        ></span>
      </div>
    `,
    iconSize: selected ? [34, 34] : [26, 26],
    iconAnchor: selected ? [17, 34] : [13, 26],
  });

// Smoothly move map when district changes
function MapController({ district }) {
  const map = useMap();

  useEffect(() => {
    if (!district) return;

    map.flyTo([district.latitude, district.longitude], 10, {
      duration: 1.5,
      easeLinearity: 0.25,
    });
  }, [district, map]);

  return null;
}

function Coverage() {
  const districts = useLoaderData();
  const [search, setSearch] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState(null);
  const [showSuggestions, setShowSuggestions] = useState(false);

  //   Search districts
  const filteredDistricts = useMemo(() => {
    const value = search.trim()?.toLowerCase();

    if (!value) {
      return [];
    }

    return districts
      ?.filter((district) => district?.district?.toLowerCase()?.includes(value))
      ?.slice(0, 6);
  }, [search, districts]);

  //  Search district
  const handleSearch = () => {
    const value = search.trim().toLowerCase();

    if (!value) return;

    const district =
      districts.find((item) => item.district?.toLowerCase() === value) ||
      districts.find((item) =>
        item.district?.toLowerCase().startsWith(value),
      ) ||
      districts.find((item) => item.district?.toLowerCase()?.includes(value));

    if (district) {
      setSelectedDistrict(district);
      setSearch(district.district);
      setShowSuggestions(false);
    }
  };

  // Select suggestion
  const handleSelectDistrict = (district) => {
    setSelectedDistrict(district);
    setSearch(district.district);
    setShowSuggestions(false);
  };

  // Enter key
  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <section className="md:max-w-6xl mx-auto bg-[#eef0f1] px-3 py-8 sm:px-5 sm:py-10 lg:px-0 lg:py-5">
      <div className="mx-auto w-full rounded-[14px] bg-white px-5 py-4 sm:px-8 sm:py-10 lg:px-[52px] lg:py-[38px]">
        <div>
          <h2 className="text-[25px] font-bold leading-[32px] tracking-[-0.7px] text-[#03373D] sm:text-[30px] sm:leading-[38px] lg:text-[28px]">
            We are available in 64 districts
          </h2>
        </div>
        <div className="relative mt-6 w-full max-w-[275px]">
          <div className="flex h-[34px] overflow-hidden rounded-full bg-[#eef1f3]">
            <div className="flex w-[32px] shrink-0 items-center justify-center">
              <Search className="h-[13px] w-[13px] text-[#03373D]" />
            </div>

            <input
              type="text"
              value={search}
              onChange={(event) => {
                setSearch(event.target.value);
                setShowSuggestions(true);
              }}
              onFocus={() => {
                if (search) {
                  setShowSuggestions(true);
                }
              }}
              onKeyDown={handleKeyDown}
              placeholder="Search here"
              className="min-w-0 flex-1 bg-transparent px-1 text-[10px] text-[#03373D] outline-none placeholder:text-[#777]"
            />

            <button
              type="button"
              onClick={handleSearch}
              className="flex h-[34px] w-[62px] shrink-0 cursor-pointer items-center justify-center rounded-full bg-[#CAEB66] text-[10px] font-semibold text-[#03373D] transition hover:brightness-95"
            >
              Search
            </button>
          </div>

          {/* Search Suggestions */}
          {showSuggestions && search && filteredDistricts?.length > 0 && (
            <div className="absolute left-0 right-0 top-[40px] z-[1000] overflow-hidden rounded-xl border border-slate-100 bg-white shadow-lg">
              {filteredDistricts?.map((district) => (
                <button
                  key={district.district}
                  type="button"
                  onClick={() => handleSelectDistrict(district)}
                  className="flex w-full cursor-pointer items-center gap-2 px-4 py-2.5 text-left text-[11px] text-[#03373D] transition hover:bg-[#f2f8dc]"
                >
                  <MapPin className="h-3.5 w-3.5 shrink-0 text-[#03373D]" />

                  <span>{district.district}</span>
                </button>
              ))}
            </div>
          )}
        </div>
        <div className="mt-6 border-t border-[#e8e8e8]" />
        <h3 className="mt-6 text-[14px] font-bold text-[#03373D] sm:text-[15px]">
          We deliver almost all over Bangladesh
        </h3>
        <div className="mt-6 h-[300px] w-full overflow-hidden sm:h-[350px] lg:h-[360px]">
          <MapContainer
            center={BANGLADESH_CENTER}
            zoom={7}
            minZoom={6}
            maxZoom={13}
            scrollWheelZoom={false}
            zoomControl={false}
            className="h-full w-full"
          >
            <TileLayer
              attribution="&copy; OpenStreetMap contributors"
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <ZoomControl position="topright" />
            <MapController district={selectedDistrict} />

            {districts?.map((district) => (
              <Marker
                key={district.district}
                position={[district.latitude, district.longitude]}
                icon={createMarkerIcon(
                  selectedDistrict?.district === district.district,
                )}
                eventHandlers={{
                  click: () => {
                    setSelectedDistrict(district);
                    setSearch(district.district);
                  },
                }}
              />
            ))}
          </MapContainer>
        </div>

        {/* Selected district information */}
        {selectedDistrict && (
          <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1 text-[10px] text-[#666]">
            <span>
              <strong className="text-[#03373D]">District:</strong>{" "}
              {selectedDistrict.district}
            </span>

            <span>
              <strong className="text-[#03373D]">Region:</strong>{" "}
              {selectedDistrict.region}
            </span>

            <span>
              <strong className="text-[#03373D]">Status:</strong>{" "}
              {selectedDistrict.status}
            </span>
          </div>
        )}
      </div>
    </section>
  );
}

export default Coverage;
