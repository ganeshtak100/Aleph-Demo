import axios from 'axios';
import {baseUrl} from '../constant/cred';
import {decode} from '@mapbox/polyline';
import {process} from 'react-native';

const API_KEY = process.env.apiKey;

export const getNearbyPetrolPumps = async (latitude: any, longitude: any) => {
  const response = await axios.get(baseUrl, {
    params: {
      location: `${latitude},${longitude}`,
      radius: 5000,
      type: 'gas_station',
      key: API_KEY,
    },
  });

  const petrolPumps = response.data.results;
  return petrolPumps;
};

export const getNearbyPetronasStations = async (
  latitude: any,
  longitude: any,
) => {
  const response = await axios.get(
    'https://maps.googleapis.com/maps/api/place/textsearch/json',
    {
      params: {
        query: 'Petronas',
        location: `${latitude},${longitude}`,
        radius: 5000, // Search within a 5km radius
        key: API_KEY,
      },
    },
  );
  const petronasStations = response.data.results;
  return petronasStations;
};

export const getDirections = async (startLoc: any, destinationLoc: any) => {
  try {
    let resp = await fetch(
      `https://maps.googleapis.com/maps/api/directions/json?origin=${startLoc}&destination=${destinationLoc}&key=${API_KEY}`,
    );
    let respJson = await resp.json();
    console.log('resp---', respJson);
    let points = decode(respJson?.routes[0]?.overview_polyline?.points);
    let coords = points.map((point: any, index: number) => {
      return {
        latitude: point[0],
        longitude: point[1],
      };
    });
    return coords;
  } catch (error: any) {
    console.log('error in catch getcoodibtes');
    return error;
  }
};
