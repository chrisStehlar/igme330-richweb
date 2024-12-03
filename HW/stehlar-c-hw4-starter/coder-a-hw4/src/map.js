// I. Variables & constants
const accessToken = "pk.eyJ1IjoiY2hyaXNzdGVobGFyIiwiYSI6ImNtNDdoMjVycjA1ajkyaXB6YTVpNnk4Zm0ifQ.3CdN6voqerGgj6hhSaYocg";
let map;

// An example of how our GeoJSON is formatted
// This will be replaced by the GeoJSON loaded from parks.geojson
let geojson = {
	type: "FeatureCollection",
	features: [{
		"type": "Feature",
		"id" : "p79",
		"properties": {
			"title": "Letchworth State Park",
			"description": "Letchworth State Park, renowned as the \"Grand Canyon of the East,\".",
			"url": "https://parks.ny.gov/parks/letchworth",
			"address": "1 Letchworth State Park, Castile, NY 14427",
			"phone": "(585) 493-3600"
		},
		"geometry": {
			"coordinates": [
				-78.051170,
				42.570148
			],
			"type": "Point"
		}
	}]
};

// II. "private" - will not be exported
const initMap = (center) => {
	mapboxgl.accessToken = accessToken;

	map = new mapboxgl.Map({
		container: "map",
		style: "mapbox://styles/mapbox/light-v11",
		center: center,
		zoom: 5.2
	});
	map.addControl(new mapboxgl.NavigationControl({showCompass:false}));

};

const addMarker = (feature, className, clickHandler) => {
	// create a map marker using feature data
	const element = document.createElement("div");
	element.className = className;
	element.id = feature.id;

	// html for the pop up
	const html = `
		<div style="text-align: left;">
			<div style="text-align: center;"> <b>${feature.properties.title}</b></div>
			<div>${feature.properties.address}</div>
			<div><b>Phone:</b> ${feature.properties.phone}</div>
		</div>
	`;

	// make the marker, add a popup, and add to map
	const marker = new mapboxgl.Marker(element)
		.setLngLat(feature.geometry.coordinates)
		.setPopup(new mapboxgl.Popup({offset: 10})
		.setHTML(html))
		.addTo(map);

	// call this when marker is clicked
	element.addEventListener("click", () => {
		clickHandler(marker._element.id);
	});
}


// III. "public" - will be exported
const addMarkersToMap = (json, clickHandler) => {
	geojson = json;

	// go through the features array and add a marker for each one
	for (const feature of geojson.features) {
		addMarker(feature, "poi", clickHandler);
	}
};

const flyTo = (center = [0,0]) => {
	//https://docs.mapbox.com/mapbox-gl-js/api/#map#flyto
	map.flyTo({ center: center });
};

const setZoomLevel = (value=0) => {
	// https://docs.mapbox.com/help/glossary/zoom-level/
	map.setZoom(value);
};

const setPitchAndBearing = (pitch=0,bearing=0) => {
	// https://docs.mapbox.com/mapbox-gl-js/example/live-update-feature/
	// https://docs.mapbox.com/mapbox-gl-js/example/set-perspective/
	map.setPitch(pitch);
	map.setBearing(bearing);
};

export { initMap, flyTo, setZoomLevel, setPitchAndBearing, addMarkersToMap };