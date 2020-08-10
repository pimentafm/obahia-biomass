import React, { useState, useEffect, useCallback } from 'react';

import OlMap from 'ol/Map';

import View from 'ol/View';

import TileLayer from 'ol/layer/Tile';
import TileWMS from 'ol/source/TileWMS';
import OSM from 'ol/source/OSM';

import { defaults } from 'ol/interaction';

import 'ol/ol.css';

import { oba, wms } from '../../services';

import { Container } from './styles';

import Menu from '../Menu';
import Footer from '../Footer';

import CardPlot from '../CardPlotWatershed';

import Popup from '../../components/Popup';

interface MapProps {
  defaultYear: number;
  defaultCategory: string;
  defaultWatershed: string;
}

interface WatershedsData {
  name: string;
  centroid: Object;
}

const Map: React.FC<MapProps> = ({
  defaultYear,
  defaultCategory,
  defaultWatershed,
}) => {
  const [agb] = useState(
    new TileLayer({ visible: true, className: 'biomass-layer' }),
  );
  const [bgb] = useState(
    new TileLayer({ visible: false, className: 'biomass-layer' }),
  );
  const [soc] = useState(
    new TileLayer({ visible: false, className: 'biomass-layer' }),
  );

  const [highways] = useState(new TileLayer({ visible: false }));
  const [hidrography] = useState(new TileLayer({ visible: false }));

  const [watershed, setWatershed] = useState(defaultWatershed);
  const [year, setYear] = useState(defaultYear);

  const [center, setCenter] = useState([-45.2471, -12.4818]);
  const [zoom, setZoom] = useState<number>(7);

  const [view] = useState(
    new View({
      projection: 'EPSG:4326',
      maxZoom: 12,
      center: center,
      extent: [-56.0, -20.0, -33.0, -6.0],
      zoom: zoom,
    }),
  );

  const osm = new TileLayer({ source: new OSM({ crossOrigin: 'anonymous' }) });

  const [map] = useState(
    new OlMap({
      controls: [],
      target: undefined,
      layers: [osm, soc, bgb, agb, highways, hidrography],
      view: view,
      interactions: defaults({
        keyboard: false,
      }),
    }),
  );

  const highways_source = new TileWMS({
    url: wms.defaults.baseURL + 'highwaysWatersheds.map',
    params: {
      LAYERS: 'Rodovias',
      ws: watershed,
      TILED: true,
    },
    serverType: 'mapserver',
    crossOrigin: 'anonymous',
  });

  const hidrography_source = new TileWMS({
    url: wms.defaults.baseURL + 'hidrographyWatersheds.map',
    params: {
      ws: watershed,
      LAYERS: 'hidrografia',
      TILED: true,
    },
    serverType: 'mapserver',
    crossOrigin: 'anonymous',
  });

  const agb_source = new TileWMS({
    url: wms.defaults.baseURL + 'agbWatersheds.map',
    params: {
      year: year,
      ws: watershed,
      LAYERS: 'agb',
      TILED: true,
    },
    serverType: 'mapserver',
    crossOrigin: 'anonymous',
  });

  const bgb_source = new TileWMS({
    url: wms.defaults.baseURL + 'bgbWatersheds.map',
    params: {
      year: year,
      ws: watershed,
      LAYERS: 'bgb',
      TILED: true,
    },
    serverType: 'mapserver',
    crossOrigin: 'anonymous',
  });

  const soc_source = new TileWMS({
    url: wms.defaults.baseURL + 'socWatersheds.map',
    params: {
      year: year,
      ws: watershed,
      LAYERS: 'soc',
      TILED: true,
    },
    serverType: 'mapserver',
    crossOrigin: 'anonymous',
  });

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

  const handleWatershed = useCallback(
    ws => {
      setWatershed(ws);

      oba
        .post('geom/', {
          table_name: 'gcc',
          headers: {
            'Content-type': 'application/json',
          },
        })
        .then(response => {
          let cxcy = response.data
            .filter((f: WatershedsData) => f.name === ws.toUpperCase())
            .map((c: WatershedsData) => c.centroid);

          cxcy = JSON.parse(cxcy);

          setCenter(cxcy);
          setZoom(7);

          map.getView().animate({ center: cxcy, duration: 1000, zoom });
        })
        .catch(e => {
          throw new Error('Do not load watersheds data');
        });
    },
    [map, zoom],
  );

  useEffect(() => {
    map.setTarget('map');
  });

  return (
    <Container id="map">
      <Menu
        ishidden={window.innerWidth <= 760 ? 1 : 0}
        defaultCategory={defaultCategory}
        defaultWatershed={watershed}
        handleWatershed={handleWatershed}
        defaultYear={year}
        handleYear={handleYear}
        map={map}
      />

      <Popup map={map} source={[agb_source, bgb_source, soc_source]} />

      <CardPlot
        year={year}
        watershed={watershed}
        ishidden={window.innerWidth <= 760 ? 1 : 0}
      />

      <Footer id="footer" map={map} />
    </Container>
  );
};

export default Map;
