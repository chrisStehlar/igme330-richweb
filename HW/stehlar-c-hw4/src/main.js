import * as map from "./map.js";
import * as ajax from "./ajax.js";

// I. Variables & constants
// NB - it's easy to get [longitude,latitude] coordinates with this tool: http://geojson.io/
const longlatNYS = [-75.71615970715911, 43.025810763917775];
const longlatUSA = [-98.5696, 39.8282];
let geojson;
let favoriteIds = ["p20", "p79", "p180", "p43"];


// II. Functions
const setupUI = () => {
	// NYS Zoom 5.2
	document.querySelector("#btn1").onclick = () => {
		map.setZoomLevel(5.2);
		map.setPitchAndBearing(0,0);
		map.flyTo(longlatNYS);
	};
	
	// NYS isometric view
	document.querySelector("#btn2").onclick = () => {
		map.setZoomLevel(5.5);
		map.setPitchAndBearing(45,0);
		map.flyTo(longlatNYS);
	};
	
	// World zoom 0
	document.querySelector("#btn3").onclick = () => {
		map.setZoomLevel(3);
		map.setPitchAndBearing(0,0);
		map.flyTo(longlatUSA);
	};

	refreshFavorites();
}

const refreshFavorites = () => {
	const favoritesContainer = document.querySelector("#favorites-list");
	favoritesContainer.innerHTML = "";
	for(const id of favoriteIds) {
		favoritesContainer.appendChild(createFavoriteElement(id));
	}
}

const createFavoriteElement = (id) => {
	const feature = getFeatureById(id);
	const a = document.createElement("a");
	a.className = "panel-block";
	a.id = feature.id;
	a.onclick = () => {
		showFeatureDetails(a.id);
		map.setZoomLevel(6);
		map.flyTo(feature.geometry.coordinates);
	};
	a.innerHTML = `
		<span class="panel-icon">
			<i class="fas fa-map-pin"></i>
		</span>
		${feature.properties.title}
	`;
	return a;
}

const init = () => {
	map.initMap(longlatNYS);

	ajax.downloadFile("data/parks.geojson", (jsonString) => {
		geojson = JSON.parse(jsonString);
		//console.log(geojson);
		map.addMarkersToMap(geojson, showFeatureDetails);
		setupUI();
	});
};

const showFeatureDetails = (id) => {
	console.log(`showFeatureDetails(${id})`);

	const feature = getFeatureById(id);
	document.querySelector("#details-1").innerHTML = `Info for ${feature.properties.title}`;

	document.querySelector("#details-2").innerHTML = 
		`<div>
			<div><b>Address:</b> ${feature.properties.address}</div>
			<div><b>Phone:</b> ${feature.properties.phone}</div>
			<div><b>Website:</b> ${feature.properties.url}</div>
		</div>`;

	document.querySelector("#details-3").innerHTML = `${feature.properties.description}`;
};

const getFeatureById = (id) => {
	for (const feature of geojson.features) {
		if (feature.id === id) {
			return feature;
		}
	}
	return null;
}

init();