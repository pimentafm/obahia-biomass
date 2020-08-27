import React, { useState, useCallback } from 'react';

import { Popover } from 'antd';

import { FiMenu } from 'react-icons/fi';

import { useTranslation } from 'react-i18next';

import { Container, Content } from './styles';

import Barplot from './Barplot';
import StackPlot from './StackPlot';

interface CardProps {
  ishidden: number;
  year: number;
  code: number;
}

const CardPlot: React.FC<CardProps> = ({ year, code, ishidden }) => {
  const { t } = useTranslation();

  const [hidden, setHidden] = useState(ishidden);

  const handleCardPlot = useCallback(() => {
    if (hidden === 0) {
      setHidden(1);
    } else {
      setHidden(0);
    }
  }, [hidden]);

  return (
    <Container id="cardplot" ishidden={hidden}>
      <div id="handleCardplot">
        <Popover placement="leftTop" content={t('tooltip_menu_plot')}>
          <FiMenu
            type="menu"
            style={{ fontSize: '20px', color: '#000' }}
            onClick={handleCardPlot}
          />
        </Popover>
      </div>
      <Content>
        <label>{t('stackplot_title')}</label>
        <StackPlot code={code} tableName="biomass" />

        <label>{t('barplot_title')}</label>
        <Barplot year={year} code={code} tableName="biomass" />
        <div className="final-space" />
      </Content>
    </Container>
  );
};

export default CardPlot;
