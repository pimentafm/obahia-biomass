import React from 'react';

import {
  GiStack,
  GiRaining,
  GiMeshBall,
  GiEarthAmerica,
  // GiMoneyStack,
  // GiShakingHands,
} from 'react-icons/gi';

import { MdTrendingDown } from 'react-icons/md';

import { Popover } from 'antd';

import { useTranslation } from 'react-i18next';
import { Container } from './styles';

interface ToolsMenuProps {
  ishidden: number;
}

const ToolsMenu: React.FC<ToolsMenuProps> = ({ ishidden }) => {
  const { t } = useTranslation();

  return (
    <Container ishidden={ishidden}>
      <Popover placement="right" content={t('toolsmenu_mapserver')}>
        <GiEarthAmerica
          className="text-icon"
          style={{ fontSize: 25, color: '#AAD3DF', cursor: 'pointer' }}
          onClick={() =>
            window.open('http://obahia.dea.ufv.br/maps/38/view', '_self')
          }
        />
      </Popover>

      <Popover
        placement="right"
        title={t('toolsmenu_maps')}
        content={
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <a href="http://obahia.dea.ufv.br/landuse">
              {t('toolsmenu_landuse')}
            </a>
            <a href="http://obahia.dea.ufv.br/irrigation">
              {t('toolsmenu_irrigation')}
            </a>

            <span>{t('toolsmenu_biomass')}</span>
          </div>
        }
      >
        <GiStack
          className="text-icon"
          style={{ fontSize: 25, color: '#1f5582', cursor: 'pointer' }}
        />
      </Popover>

      <Popover placement="right" content={t('toolsmenu_onset')}>
        <GiRaining
          className="text-icon"
          style={{ fontSize: 25, color: '#AAD3DF', cursor: 'pointer' }}
          onClick={() => window.open('http://obahia.dea.ufv.br/onset', '_self')}
        />
      </Popover>

      <Popover placement="right" content={t('toolsmenu_hidro')}>
        <MdTrendingDown
          className="text-icon"
          style={{ fontSize: 25, color: '#AAD3DF', cursor: 'pointer' }}
          onClick={() =>
            window.open('http://obahia.dea.ufv.br/stream', '_self')
          }
        />
      </Popover>

      <Popover placement="right" content={t('toolsmenu_mfview')}>
        <GiMeshBall
          className="text-icon"
          style={{ fontSize: 25, color: '#AAD3DF', cursor: 'pointer' }}
          onClick={() =>
            window.open('http://obahia.dea.ufv.br/mfview', '_self')
          }
        />
      </Popover>
    </Container>
  );
};

export default ToolsMenu;
