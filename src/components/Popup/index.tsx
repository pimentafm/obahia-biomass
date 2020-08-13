import React, { useState, useCallback, useEffect } from 'react';
import OlMap from 'ol/Map';
import TileWMS from 'ol/source/TileWMS';

import Overlay from 'ol/Overlay';
import OverlayPositioning from 'ol/OverlayPositioning';

import { createStringXY } from 'ol/coordinate';

import { FiXCircle } from 'react-icons/fi';

import { Container } from './styles';
import HtmlParser from 'react-html-parser';

import { useTranslation } from 'react-i18next';

interface PopupProps {
  map: OlMap;
  source: Array<TileWMS>;
}

const Popup: React.FC<PopupProps> = ({ map, source }) => {
  const { t } = useTranslation();

  const [popcoords, setPopCoords] = useState<string>();
  const [agb, setAGB] = useState<string>();
  const [bgb, setBGB] = useState<string>();
  const [soc, setSOC] = useState<string>();

  const closePopUp = useCallback(() => {
    const element: HTMLElement = document.getElementById(
      'popup-class',
    ) as HTMLElement;

    element.style.display = 'none';
  }, []);

  const getData = useCallback((url, type) => {
    fetch(url)
      .then(response => {
        return response.text();
      })
      .then(value => {
        if (type === 'AGB') {
          setAGB(value);
        } else if (type === 'BGB') {
          setBGB(value);
        } else {
          setSOC(value);
        }
      });
  }, []);

  useEffect(() => {
    map.on('pointermove', function (evt) {
      if (evt.dragging) {
        return;
      }

      let hit = map.forEachLayerAtPixel(
        evt.pixel,
        (_, rgba) => {
          return true;
        },
        { layerFilter: layer => layer.getClassName() !== 'ol-layer' },
      );

      map.getTargetElement().style.cursor = hit ? 'pointer' : '';
    });

    map.on('singleclick', evt => {
      let res = map.getView().getResolution();
      let proj = map.getView().getProjection();

      const stringifyFunc = createStringXY(5);

      let urls = source.map(source =>
        source.getFeatureInfoUrl(evt.coordinate, res, proj, {
          INFO_FORMAT: 'text/html',
          VERSION: '1.3.0',
        }),
      );

      getData(urls[0], 'AGB');
      getData(urls[1], 'BGB');
      getData(urls[2], 'SOC');

      setPopCoords(stringifyFunc(evt.coordinate));

      const element: HTMLElement = document.getElementById(
        'popup-class',
      ) as HTMLElement;

      const popup = new Overlay({
        position: evt.coordinate,
        element: element,
        positioning: OverlayPositioning.BOTTOM_LEFT,
        autoPan: true,
        autoPanAnimation: {
          duration: 500,
        },
      });

      element.style.display = 'unset';

      map.addOverlay(popup);
    });
  }, [map, getData, source]);

  return (
    <Container>
      <tbody
        id="popup-class"
        className="popup-class"
        style={{
          boxShadow: `0px 2px 3px rgba(0, 0, 0, 0.13), 1px 2px 2px rgba(0, 0, 0, 0.1),
      -1px -2px 2px rgba(0, 0, 0, 0.05)`,
        }}
      >
        <tr className="table-header">
          <th
            colSpan={2}
            style={{ background: '#1f5582', borderRadius: '2px 2px 0px 0px' }}
          >
            <FiXCircle
              id="close-popup"
              type="close"
              onClick={closePopUp}
              style={{
                display: 'flex',
                color: '#fff',
                fontSize: '25px',
                padding: '2px',
                float: 'right',
                cursor: 'pointer',
              }}
            />
          </th>
        </tr>
        <tr style={{ background: '#fff' }}>
            <td style={{ padding: `2px 5px` }}>{t('label_agb')}</td>
          <td id="popup-value" style={{ padding: `2px 5px` }}>
            {agb ? HtmlParser(agb) : 'Fora da camada'}
          </td>
        </tr>
        <tr style={{ background: '#fff' }}>
          <td style={{ padding: `2px 5px` }}>{t('label_bgb')}</td>
          <td id="popup-value" style={{ padding: `2px 5px` }}>
            {bgb ? HtmlParser(bgb) : 'Fora da camada'}
          </td>
        </tr>
        <tr style={{ background: '#fff' }}>
          <td style={{ padding: `2px 5px` }}>{t('label_soc')}</td>
          <td id="popup-value" style={{ padding: `2px 5px` }}>
            {soc ? HtmlParser(soc) : 'Fora da camada'}
          </td>
        </tr>
        <tr style={{ background: '#fff' }}>
          <td style={{ padding: `2px 5px`, borderRadius: `0px 0px 0px 2px` }}>
            LON, LAT
          </td>
          <td
            id="popup-coords"
            style={{ padding: `2px 5px`, borderRadius: `0px 0px 2px 0px` }}
          >
            {popcoords ? popcoords : t('popup_clickout')}
          </td>
        </tr>
      </tbody>
    </Container>
  );
};

export default Popup;
