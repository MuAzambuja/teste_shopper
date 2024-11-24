import React, { useEffect, useRef, useState } from "react";
import { GoogleMap, useLoadScript, DirectionsRenderer } from "@react-google-maps/api";
import axios from "axios";

const MapWithRoute: React.FC<{ origin: string; destination: string }> = ({ origin, destination }) => {
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [directions, setDirections] = useState<google.maps.DirectionsResult | null>(null);
  const directionsServiceRef = useRef<google.maps.DirectionsService | null>(null);

  // Carrega a API Key do backend
  useEffect(() => {
    const fetchApiKey = async () => {
      try {
        const response = await axios.get("http://localhost:8080/google-maps-api-key"); // Ajuste a URL se necessário
        setApiKey(response.data.apiKey);
      } catch (error) {
        console.error("Erro ao buscar a API Key:", error);
      }
    };

    fetchApiKey();
  }, []);

  // Traça a rota
  useEffect(() => {
    if (!directionsServiceRef.current) {
      directionsServiceRef.current = new google.maps.DirectionsService();
    }

    const fetchRoute = async () => {
      if (directionsServiceRef.current && origin && destination) {
        directionsServiceRef.current.route(
          {
            origin,
            destination,
            travelMode: google.maps.TravelMode.DRIVING,
          },
          (result, status) => {
            if (status === google.maps.DirectionsStatus.OK) {
              setDirections(result);
            } else {
              console.error("Erro ao traçar a rota:", status);
            }
          }
        );
      }
    };

    fetchRoute();
  }, [origin, destination]);

  // Verifica se a API Key foi carregada
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: apiKey || "", // Passa a API Key dinamicamente
  });

  if (!apiKey) return <p>Carregando chave da API...</p>;
  if (!isLoaded) return <p>Carregando mapa...</p>;

  return (
    <GoogleMap
      center={{ lat: -23.55052, lng: -46.633308 }} // Ajuste para a localização inicial (se necessário)
      zoom={12}
      mapContainerStyle={{ width: "100%", height: "400px" }}
    >
      {directions && <DirectionsRenderer directions={directions} />}
    </GoogleMap>
  );
};

export default MapWithRoute;
