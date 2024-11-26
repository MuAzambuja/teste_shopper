/*import React, { useEffect, useState } from 'react';
import axios from "../services/api";

// Certifique-se de que a interface Window está estendida no seu projeto
declare global {
  interface Window {
    initMap: () => void;
  }
}

const MapWithRoute: React.FC<{ origin: string; destination: string }> = ({ origin, destination }) => {
  const [apiKey, setApiKey] = useState<string | null>(null);

  useEffect(() => {
    const fetchApiKey = async () => {
      try {
        const response = await axios.get("/google-maps-api-key");
        setApiKey(response.data.apiKey);
      } catch (error) {
        console.error("Erro ao buscar chave da API:", error);
      }
    };

    fetchApiKey();
  }, []);

  useEffect(() => {
    if (apiKey) {
      if (!window.initMap) {
        window.initMap = function() {
          const mapElement = document.getElementById('map');
          if (mapElement) {
            const map = new window.google.maps.Map(mapElement, {
              center: { lat: -34.397, lng: 150.644 },
              zoom: 8,
            });

            // Adicione a rota no mapa usando origin e destination
            const directionsService = new window.google.maps.DirectionsService();
            const directionsRenderer = new window.google.maps.DirectionsRenderer();
            directionsRenderer.setMap(map);

            directionsService.route(
              {
                origin: origin,
                destination: destination,
                travelMode: window.google.maps.TravelMode.DRIVING,
              },
              (response, status) => {
                if (status === 'OK') {
                  directionsRenderer.setDirections(response);
                } else {
                  console.error('Erro ao calcular a rota:', status);
                }
              }
            );
          }
        };
      }

      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&callback=initMap`;
      script.async = true;
      script.defer = true;
      document.head.appendChild(script);
    }
  }, [apiKey, origin, destination]);

  return <div id="map" style={{ height: '100%', width: '100%' }} />;
};

export default MapWithRoute;
*/

import React, { useEffect, useState } from 'react';
import axios from "../services/api";

// Certifique-se de que a interface Window está estendida no seu projeto
declare global {
  interface Window {
    initMap: () => void;
  }
}

const MapWithRoute: React.FC<{ origin: string; destination: string }> = ({ origin, destination }) => {
  const [apiKey, setApiKey] = useState<string | null>(null);

  useEffect(() => {
    const fetchApiKey = async () => {
      try {
        const response = await axios.get("/google-maps-api-key");
        setApiKey(response.data.apiKey);
      } catch (error) {
        console.error("Erro ao buscar chave da API:", error);
      }
    };

    fetchApiKey();
  }, []);

  useEffect(() => {
    if (apiKey) {
      // Define a função initMap no window
      window.initMap = function() {
        const mapElement = document.getElementById('map');
        if (mapElement) {
          const map = new window.google.maps.Map(mapElement, {
            center: { lat: -34.397, lng: 150.644 },
            zoom: 8,
          });

          const directionsService = new window.google.maps.DirectionsService();
          const directionsRenderer = new window.google.maps.DirectionsRenderer();
          directionsRenderer.setMap(map);

          directionsService.route(
            {
              origin: origin,
              destination: destination,
              travelMode: window.google.maps.TravelMode.DRIVING,
            },
            (response, status) => {
              if (status === 'OK') {
                directionsRenderer.setDirections(response);
              } else {
                console.error('Erro ao calcular a rota:', status);
              }
            }
          );
        }
      };

      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&callback=initMap`;
      script.async = true;
      script.defer = true;
      document.head.appendChild(script);
    }
  }, [apiKey, origin, destination]);

  return <div id="map" style={{ height: '100%', width: '100%' }} />;
};

export default MapWithRoute;
