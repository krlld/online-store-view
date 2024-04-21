import React, { useEffect, useRef } from 'react';
import H from '@here/maps-api-for-javascript';
import axios from 'axios';

const MapAddress = ({ changeDeliveryAddress }) => {
	const apikey = process.env.REACT_APP_HERE_API_KEY;
	const mapRef = useRef(null);
	const map = useRef(null);
	const platform = useRef(null);

	/**
	 * An event listener is added to listen to tap events on the map.
	 * Clicking on the map displays an alert box containing the latitude and longitude
	 * of the location pressed.
	 * @param  {H.Map} map      A HERE Map instance within the application
	 */
	function setUpClickListener(map) {
		// Attach an event listener to map display
		// obtain the coordinates and display in an alert box.
		map.addEventListener('tap', async function (evt) {
			var coord = map.screenToGeo(evt.currentPointer.viewportX, evt.currentPointer.viewportY);
			console.log(coord);
			try {
				// Выполняем GET-запрос к серверу для получения списка категорий
				const response = await axios.get(
					`https://api.opencagedata.com/geocode/v1/json?q=${coord.lat}%2C${coord.lng}&key=${process.env.REACT_APP_OPENCAGE_API_KEY}`
				);
				console.log(response.data.results[0].formatted);
				changeDeliveryAddress(response.data.results[0].formatted);
			} catch (error) {
				console.error('Ошибка при загрузке:', error);
			}
		});
	}

	useEffect(() => {
		// Check if the map object has already been created
		if (!map.current) {
			// Create a platform object with the API key and useCIT option
			platform.current = new H.service.Platform({
				apikey,
			});
			// Obtain the default map types from the platform object:
			const defaultLayers = platform.current.createDefaultLayers({
				pois: true,
			});
			// Create a new map instance with the Tile layer, center and zoom level
			// Instantiate (and display) a map:
			const newMap = new H.Map(mapRef.current, defaultLayers.vector.normal.map, {
				zoom: 10,
				center: {
					lat: 53.89,
					lng: 27.57,
				},
			});
			const ui = H.ui.UI.createDefault(newMap, defaultLayers);
			// Add panning and zooming behavior to the map
			const behavior = new H.mapevents.Behavior(new H.mapevents.MapEvents(newMap));

			// Set the map object to the reference

			map.current = newMap;
			setUpClickListener(newMap);
		}
	}, [apikey]);

	// Return a div element to hold the map
	return <div style={{ width: '100%', height: '600px' }} ref={mapRef} />;
};
export default MapAddress;
