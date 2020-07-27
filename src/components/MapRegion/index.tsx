import React, { useState, useEffect, useCallback } from 'react';

import OlMap from 'ol/Map';

import View from 'ol/View';

import TileLayer from 'ol/layer/Tile';
import TileWMS from 'ol/source/TileWMS';
import OSM from 'ol/source/OSM';

import { defaults } from 'ol/interaction';

import 'ol/ol.css';

import { wms } from '../../services';

import { Container } from './styles';

import Menu from '../Menu';
import Footer from '../Footer';

// import CardPlot from '../CardPlot';

import Popup from '../../components/Popup';

interface MapProps {
  defaultYear: number;
  defaultCategory: string;
}

const Map: React.FC<MapProps> = ({ defaultYear, defaultCategory }) => {
  const [agb] = useState(new TileLayer({ visible: true }));
  const [bgb] = useState(new TileLayer({ visible: false }));
  const [soc] = useState(new TileLayer({ visible: false }));

  const [highways] = useState(new TileLayer({ visible: false }));
  const [hidrography] = useState(new TileLayer({ visible: false }));
  const [watersheds] = useState(new TileLayer({ visible: true }));
  const [counties] = useState(new TileLayer({ visible: false }));

  const [year, setYear] = useState(defaultYear);

  const [center] = useState([-45.2471, -12.4818]);
  const [zoom] = useState<number>(7);

  const [view] = useState(
    new View({
      projection: 'EPSG:4326',
      center: center,
      extent: [-56.0, -20.0, -33.0, -6.0],
      zoom: zoom,
    }),
  );

  const osm = new TileLayer({ source: new OSM() });

  const [map] = useState(
    new OlMap({
      controls: [],
      target: undefined,
      layers: [osm, soc, bgb, agb, watersheds, counties, highways, hidrography],
      view: view,
      interactions: defaults({
        keyboard: false,
      }),
    }),
  );

  const watersheds_source = new TileWMS({
    url: wms.defaults.baseURL + 'watersheds.map',
    params: {
      LAYERS: 'watersheds',
      TILED: true,
    },
    serverType: 'mapserver',
  });

  const counties_source = new TileWMS({
    url: wms.defaults.baseURL + 'counties.map',
    params: {
      LAYERS: 'counties',
      TILED: true,
    },
    serverType: 'mapserver',
  });

  const highways_source = new TileWMS({
    url: wms.defaults.baseURL + 'highwaysRegion.map',
    params: {
      LAYERS: 'Rodovias',
      TILED: true,
    },
    serverType: 'mapserver',
  });

  const hidrography_source = new TileWMS({
    url: wms.defaults.baseURL + 'hidrographyRegion.map',
    params: {
      LAYERS: 'hidrografia',
      TILED: true,
    },
    serverType: 'mapserver',
  });

  const agb_source = new TileWMS({
    url: wms.defaults.baseURL + 'agbRegion.map',
    params: {
      year: year,
      LAYERS: 'agb',
      TILED: true,
    },
    serverType: 'mapserver',
  });

  const bgb_source = new TileWMS({
    url: wms.defaults.baseURL + 'bgbRegion.map',
    params: {
      year: year,
      LAYERS: 'bgb',
      TILED: true,
    },
    serverType: 'mapserver',
  });

  const soc_source = new TileWMS({
    url: wms.defaults.baseURL + 'socRegion.map',
    params: {
      year: year,
      LAYERS: 'soc',
      TILED: true,
    },
    serverType: 'mapserver',
  });

  watersheds.set('name', 'watersheds');
  watersheds.setSource(watersheds_source);
  watersheds.getSource().refresh();

  counties.set('name', 'counties');
  counties.setSource(counties_source);
  counties.getSource().refresh();

  highways.set('name', 'highways');
  highways.setSource(highways_source);
  highways.getSource().refresh();

  hidrography.set('name', 'hidrography');
  hidrography.setSource(hidrography_source);
  hidrography.getSource().refresh();

  agb.set('name', 'agb');
  agb.setSource(agb_source);
  agb.getSource().refresh();

  bgb.set('name', 'bgb');
  bgb.setSource(bgb_source);
  bgb.getSource().refresh();

  soc.set('name', 'soc');
  soc.setSource(soc_source);
  soc.getSource().refresh();

  const handleYear = useCallback(
    y => {
      setYear(y);
    },
    [setYear],
  );

  useEffect(() => {
    map.setTarget('map');
  });

  return (
    <Container id="map">
      <Menu
        ishidden={false ? 1 : 0}
        defaultCategory={defaultCategory}
        defaultYear={year}
        handleYear={handleYear}
        map={map}
      />

      <Popup map={map} source={[agb_source, bgb_source, soc_source]} />

      {/* <CardPlot year={year} /> */}

      <Footer id="footer" map={map} />
    </Container>
  );
};

export default Map;
