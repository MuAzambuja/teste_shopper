/*import React, { useEffect, useState } from 'react';
import axios from "../services/api";

// Certifique-se de que a interface Window está estendida no seu projeto
declare global {
  interface Window {
    initMap: () => void;
  }
}

interface MapWithRouteProps {
  origin: string;
  destination: string;
  distance: number;
}

const MapWithRoute: React.FC<MapWithRouteProps> = ({ origin, destination, distance }) => {
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

          // Adicionar a distância no mapa
          const distanceElement = document.createElement('div');
          distanceElement.style.backgroundColor = 'white';
          distanceElement.style.padding = '10px';
          distanceElement.style.marginTop = '10px';
          distanceElement.innerText = `Distância: ${distance} km`;
          mapElement.appendChild(distanceElement);
        }
      };

      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&callback=initMap`;
      script.async = true;
      script.defer = true;
      document.head.appendChild(script);
    }
  }, [apiKey, origin, destination, distance]);

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

interface MapWithRouteProps {
  origin: string;
  destination: string;
  distance: number;
}

const MapWithRoute: React.FC<MapWithRouteProps> = ({ origin, destination, distance }) => {
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [originCoordinates, setOriginCoordinates] = useState<{ lat: number, lng: number } | null>(null);

  const fetchApiKey = async () => {
    try {
      const response = await axios.get("/google-maps-api-key");
      setApiKey(response.data.apiKey);
    } catch (error) {
      console.error("Erro ao buscar chave da API:", error);
    }
  };

  const fetchCoordinates = async (address: string) => {
    try {
      if (!apiKey) {
        console.error("API Key não disponível");
        return null;
      }
      const response = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${apiKey}`);
      if (response.data.results && response.data.results.length > 0) {
        const location = response.data.results[0].geometry.location;
        return location;
      } else {
        console.error(`Nenhum resultado encontrado para o endereço: ${address}`);
        return null;
      }
    } catch (error) {
      console.error("Erro ao buscar coordenadas:", error);
      return null;
    }
  };

  useEffect(() => {
    fetchApiKey();
  }, []);

  useEffect(() => {
    if (apiKey) {
      fetchCoordinates(origin).then((coordinates) => {
        if (coordinates) {
          setOriginCoordinates(coordinates);
        }
      });
    }
  }, [apiKey, origin]);

  useEffect(() => {
    if (apiKey && originCoordinates) {
      window.initMap = function() {
        const mapElement = document.getElementById('map');
        if (mapElement) {
          const map = new window.google.maps.Map(mapElement, {
            center: originCoordinates,
            zoom: 15,
          });

          if (destination) {
            const directionsService = new window.google.maps.DirectionsService();
            const directionsRenderer = new window.google.maps.DirectionsRenderer();
            directionsRenderer.setMap(map);

            directionsService.route(
              {
                origin: originCoordinates,
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

            // Adicionar a distância no mapa
            const distanceElement = document.createElement('div');
            distanceElement.style.backgroundColor = 'white';
            distanceElement.style.padding = '10px';
            distanceElement.style.marginTop = '10px';
            distanceElement.innerText = `Distância: ${distance} km`;
            map.controls[window.google.maps.ControlPosition.TOP_CENTER].push(distanceElement);
          }
        }
      };

      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&callback=initMap`;
      script.async = true;
      script.defer = true;
      document.head.appendChild(script);
    }
  }, [apiKey, originCoordinates, destination, distance]);

  return <div id="map" style={{ height: '100%', width: '100%' }} />;
};

export default MapWithRoute;

