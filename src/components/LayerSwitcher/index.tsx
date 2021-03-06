import React, { useCallback } from 'react';
import Switch from 'react-switch';

import { IconContext } from 'react-icons';
import { FaArrowAltCircleDown, FaDatabase } from 'react-icons/fa';

import { Divider, Popover, Slider } from 'antd';
import 'antd/dist/antd.css';

import { useTranslation } from 'react-i18next';
import Legend from './Legend';

import { Container } from './styles';

interface LayerSwitcherProps {
  name: string;
  label: string;
  downloadURL?: string;
  layerIsVisible: boolean;
  legendIsVisible: boolean;
  layerInfoIsVisible: boolean;
  switchColor: string;
  handleLayerOpacity(opacity: number, lyr_name: string): void;
  handleLayerVisibility(e: boolean, obj: Record<string, unknown>): void;
}

const LayerSwitcher: React.FC<LayerSwitcherProps> = ({
  name,
  label,
  downloadURL,
  layerIsVisible,
  legendIsVisible,
  layerInfoIsVisible,
  switchColor,
  handleLayerOpacity,
  handleLayerVisibility,
}) => {
  const { t } = useTranslation();

  const handleVisibility = useCallback(
    (_e, _obj, id) => {
      handleLayerVisibility(!layerIsVisible, id);
    },
    [layerIsVisible, handleLayerVisibility],
  );

  const handleOpacity = useCallback(
    opacity => {
      handleLayerOpacity(opacity, name);
    },
    [name, handleLayerOpacity],
  );

  let legend;

  if (legendIsVisible) {
    legend = <Legend name={name} isvisible={layerIsVisible} />;
  }

  let layerInfo;

  if (layerInfoIsVisible) {
    layerInfo = (
      <>
        <Divider style={{ margin: `5px 0px 5px 0px` }} />

        <IconContext.Provider value={{ color: '#1f5582' }}>
          <div className="layer-info">
            {/* <Popover placement="right" title="Informações sobre a camada">
              <FaInfoCircle
                id="close-popup"
                onClick={() => alert('Metadados')}
                style={{
                  fontSize: '20px',
                  cursor: 'pointer',
                }}
              />
            </Popover> */}

            <Popover placement="right" content={t('tooltip_download')}>
              <FaArrowAltCircleDown
                id="close-popup"
                onClick={() => window.open(downloadURL, '_self')}
                style={{
                  fontSize: '20px',
                  cursor: 'pointer',
                }}
              />
            </Popover>

            <Popover placement="right" content={t('tooltip_ftp')}>
              <FaDatabase
                id="close-popup"
                onClick={() =>
                  window.open(
                    downloadURL?.substring(0, downloadURL.lastIndexOf('/')),
                    '_blank',
                  )
                }
                style={{
                  fontSize: '20px',
                  cursor: 'pointer',
                }}
              />
            </Popover>
          </div>
        </IconContext.Provider>
      </>
    );
  }

  return (
    <Container id="layerswitcher">
      <div className="layer-div">
        <label>{label}</label>

        <div className="slider-switcher">
          <Slider
            defaultValue={1}
            min={0}
            max={1}
            step={0.1}
            tooltipVisible={false}
            style={{ width: 40, margin: 5, marginRight: 15 }}
            onChange={handleOpacity}
          />
          <Switch
            id={name}
            checked={layerIsVisible}
            handleDiameter={16}
            onChange={handleVisibility}
            onColor={switchColor}
            checkedIcon={false}
            uncheckedIcon={false}
            disabled={layerIsVisible}
            height={22}
            width={44}
          />
        </div>
      </div>

      {legend}

      {layerInfo}
    </Container>
  );
};

export default LayerSwitcher;
