/* eslint-disable react/button-has-type */
/* eslint-disable no-shadow */
/* eslint-disable radix */
/* eslint-disable no-param-reassign */
/* eslint-disable no-unused-vars */
/* eslint-disable no-restricted-properties */
/* eslint-disable no-use-before-define */
/* eslint-disable indent */
/* eslint-disable no-nested-ternary */
import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import MarkerClusterGroup from 'react-leaflet-markercluster';
import Jplante from './img/parc1.png';
import Proce from './img/parc2.png';
import Beaujoire from './img/parc3.png';
import Blotereau from './img/parc4.png';
import Mark from './img/marker.png';
import useGeoLocation from './useGeoLocation';
import './Map.css';

require('react-leaflet-markercluster/dist/styles.min.css');

const Map = ({ photoHeader }) => {
  const [countPlante, setCountPlant] = useState(0);
  const [countProce, setCountProce] = useState(0);
  const [isFound, setIsFound] = useState([]);
  const [parc, SetParc] = useState([]);
  const [parcfilter, setParcFilter] = useState([]);
  const [newParc, setNewParc] = useState([]);
  const [countTotal, setCountTotal] = useState([]);
  const [topPlant, SetTopPlant] = useState([]);
  const [showAll, setShowAll] = useState([]);

  const GetTopPlant = async () => {
    const temp = await fetch(`https://data.nantesmetropole.fr/api/records/1.0/search/?dataset=244400404_collection-vegetale-nantes&q=&rows=400&start=0&refine.genre=Magnolia
    `).then((res) => res.json());

    SetTopPlant(temp.records);
    setShowAll(
      temp.records.filter(
        (valeur) =>
          valeur.fields.photo1 !== undefined &&
          valeur.fields.cultivar !== undefined &&
          valeur.fields.espece !== undefined &&
          valeur.fields.location !== undefined &&
          valeur.fields.nom_du_site !== undefined
      )
    );
  };

  const GetParc = async () => {
    const tempo = await fetch(`https://data.nantesmetropole.fr/api/records/1.0/search/?dataset=244400404_parcs-jardins-nantes&q=&rows=100
      `).then((res) => res.json());
    SetParc(tempo.records);
    const newarray = {
      fields: {
        nom_complet: 'Cimetière Parc',
        adresse: 'Chemin de la justice',
        location: [47.269653, -1.584945],
      },
    };

    SetParc(
      tempo.records
        .concat(newarray)
        .filter(
          (valeur) =>
            valeur.fields.nom_complet === 'Parc de Procé' ||
            valeur.fields.nom_complet === 'Parc Floral de la Beaujoire' ||
            valeur.fields.nom_complet === 'Jardin des Plantes' ||
            valeur.fields.nom_complet === 'Parc du Grand Blottereau' ||
            valeur.fields.nom_complet === 'Parc de la Gaudinière' ||
            valeur.fields.nom_complet === 'Cimetière Parc'
        )
    );
  };

  useEffect(() => {
    GetParc();
  }, []);
  useEffect(() => {
    GetTopPlant();
  }, []);

  // function to get distance beetween user and all plant
  function getDistance(origin, destination) {
    // return distance in meters
    const lon1 = toRadian(origin[1]);
    const lat1 = toRadian(origin[0]);
    const lon2 = toRadian(destination[1]);
    const lat2 = toRadian(destination[0]);

    const deltaLat = lat2 - lat1;
    const deltaLon = lon2 - lon1;

    const a =
      Math.pow(Math.sin(deltaLat / 2), 2) +
      Math.cos(lat1) * Math.cos(lat2) * Math.pow(Math.sin(deltaLon / 2), 2);
    const c = 2 * Math.asin(Math.sqrt(a));
    const EARTH_RADIUS = 6371;
    return c * EARTH_RADIUS * 1000;
  }
  function toRadian(degree) {
    return (degree * Math.PI) / 180;
  }
  // marker for plant
  const markerIcon = new L.Icon({
    iconUrl: Mark,
    iconSize: [40, 40],
    iconAnchor: [17, 50], // [left/right, top/bottom]
    popupAnchor: [0, -50], // [left/right, top/bottom]
  });
  // marker for user
  const markerUser = new L.Icon({
    className: 'avatarLocation',
    iconUrl: photoHeader,
    iconSize: [40, 40],
    iconAnchor: [17, 50], // [left/right, top/bottom]
    popupAnchor: [0, -50], // [left/right, top/bottom]
  });
  // get user position
  const location = useGeoLocation();

  // map all plant and get distance with user
  const allPlants = showAll.map((plant) => {
    const distance = getDistance(plant.fields.location, [
      location.coordinates.lat,
      location.coordinates.lng,
    ]);
    plant.distance = parseInt(distance.toFixed(0));
    plant.isFound = false;
    return plant;
  });

  function add(cont, setCont) {
    const newcount = cont + 1;
    setCont(newcount);
  }

  const counter = (e) => {
    console.log(e.target.id);
    const plantFound = isFound;
    plantFound.push(e.target.id);
    console.log(plantFound);
    setIsFound(plantFound);
    allPlants.map((position) =>
      position.fields.nom_du_site === 'Jardin des Plantes'
        ? add(countPlante, setCountPlant)
        : '' ||
          (position.distance <= 1300 &&
            position.fields.nom_du_site === 'Parc de Procé')
        ? add(countProce, setCountProce)
        : ''
    );
  };
  console.log(parc);
  console.log(allPlants);
  console.log(location);
  console.log(parcfilter);
  console.log(topPlant);
  console.log(showAll);

  return (
    <div>
      <p className="avatarPosition">
        Votre position : latitude: {location.coordinates.lat}, longitude:
        {location.coordinates.lng}{' '}
      </p>
      <div className="BoxMap">
        {parc &&
          parc.map((parc) => (
            <div className="CardMap">
              <div className="CardInfo">
                <div className="CardInfoTxt">
                  <h3>{parc.fields.nom_complet}</h3>
                  <div className="CardInfoSubTxt">
                    <p>{parc.fields.adresse}</p>
                    <p>
                      {parc.fields.nom_complet === 'Jardin des Plantes'
                        ? countPlante
                        : '' || parc.fields.nom_complet === 'Parc de Procé'
                        ? countProce
                        : ''}
                      /
                      {parc.fields.nom_complet === 'Parc de Procé'
                        ? showAll.filter(
                            (total) =>
                              total.fields.nom_du_site === 'Parc de Procé'
                          ).length
                        : '' || parc.fields.nom_complet === 'Jardin des Plantes'
                        ? showAll.filter(
                            (plant) =>
                              plant.fields.nom_du_site === 'Jardin des Plantes'
                          ).length
                        : '' ||
                          parc.fields.nom_complet ===
                            'Parc Floral de la Beaujoire'
                        ? showAll.filter(
                            (total) =>
                              total.fields.nom_du_site ===
                              'Parc floral de la Beaujoire'
                          ).length
                        : '' ||
                          parc.fields.nom_complet === 'Parc de la Gaudinière'
                        ? showAll.filter(
                            (total) =>
                              total.fields.nom_du_site ===
                              'Parc de la Gaudinière'
                          ).length
                        : '' ||
                          parc.fields.nom_complet === 'Parc du Grand Blottereau'
                        ? showAll.filter(
                            (total) =>
                              total.fields.nom_du_site ===
                              'Parc exotique du Grand-Blottereau'
                          ).length
                        : '' || parc.fields.nom_complet === 'Cimetière Parc'
                        ? showAll.filter(
                            (total) =>
                              total.fields.nom_du_site ===
                              'Arboretum Cimetière Parc'
                          ).length
                        : ''}
                    </p>
                  </div>
                </div>
                <img
                  src={
                    parc.fields.nom_complet === 'Parc de Procé'
                      ? Proce
                      : '' || parc.fields.nom_complet === 'Jardin des Plantes'
                      ? Jplante
                      : '' ||
                        parc.fields.nom_complet ===
                          'Parc Floral de la Beaujoire'
                      ? Beaujoire
                      : '' ||
                        parc.fields.nom_complet === 'Parc du Grand Blottereau'
                      ? Blotereau
                      : '' ||
                        parc.fields.nom_complet === 'Parc de la Gaudinière'
                      ? Proce
                      : '' || parc.fields.nom_complet === 'Cimetière Parc'
                      ? Jplante
                      : ''
                  }
                  className="imgParc"
                  alt="imageparc"
                />
              </div>

              <MapContainer
                center={[parc.fields.location[0], parc.fields.location[1]]}
                zoom={13}
                scrollWheelZoom={false}
              >
                <TileLayer
                  attribution='<a href="http://jawg.io" title="Tiles Courtesy of Jawg Maps" target="_blank">&copy; <b>Jawg</b>Maps</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.jawg.io/jawg-sunny/{z}/{x}/{y}{r}.png?access-token=nCEJmAfEuJiX0snlBIpkDSV8G7APluwStdVjOXtOvGoOeNdXAcwynbxB5myumP0D"

                  /* attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                  url='https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png' */
                />
                <MarkerClusterGroup>
                  {allPlants.map((plant) => (
                    <Marker
                      position={[
                        plant.fields.location[0],
                        plant.fields.location[1],
                      ]}
                      icon={markerIcon}
                      key={plant.recordid}
                    >
                      <Popup keepInView closeButton={false}>
                        Espèce : {plant.fields.espece}
                        <p>
                          {plant.distance <= 1300
                            ? `Vous êtes à ${plant.distance} mètres de ce magnolia vous pouvez le cueillir `
                            : `Vous êtes à ${plant.distance} mètres de ce magnolia`}
                        </p>
                        <div>
                          <input
                            type="button"
                            onClick={(e) => counter(e)}
                            disabled={
                              !(
                                plant.distance <= 1400 &&
                                !isFound.includes(plant.recordid)
                              )
                            }
                            id={plant.recordid}
                            value={`add ${plant.fields.espece}`}
                          />

                          <button>ta photo</button>
                        </div>
                        <img
                          src={`https://data.nantesmetropole.fr/explore/dataset/244400404_collection-vegetale-nantes/files/${plant.fields.photo1.id}/300/`}
                          alt="plant"
                          className="imgPopup"
                        />
                      </Popup>
                    </Marker>
                  ))}
                </MarkerClusterGroup>
                {location.loaded && !location.error && (
                  <Marker
                    icon={markerUser}
                    position={[
                      location.coordinates.lat,
                      location.coordinates.lng,
                    ]}
                  >
                    <Popup keepInView closeButton={false}>
                      <p>Vous êtes ici !</p>
                    </Popup>
                  </Marker>
                )}
              </MapContainer>
            </div>
          ))}
      </div>
    </div>
  );
};

export default Map;
