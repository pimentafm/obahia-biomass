import React, { useState, useCallback } from 'react';

import { Popover } from 'antd';

import { FiMenu } from 'react-icons/fi';

import { Container, Content } from './styles';

import Barplot from './Barplot';
import StackPlot from './StackPlot';

import { useTranslation } from 'react-i18next';

interface CardProps {
  ishidden: number;
  year: number;
  watershed: string;
}

const CardPlot: React.FC<CardProps> = ({ year, watershed, ishidden }) => {
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
        <Popover placement="leftTop" content="Esconde/Mostra gráficos">
          <FiMenu
            type="menu"
            style={{ fontSize: '20px', color: '#000' }}
            onClick={handleCardPlot}
          />
        </Popover>
      </div>

      <Content>
        <label>{t('stackplot_title')}</label>
        <StackPlot watershed={watershed} tableName="biomass" />

        <label>{t('barplot_title')}</label>
        <Barplot year={year} watershed={watershed} tableName="biomass" />
        <div className="final-space"></div>
      </Content>
    </Container>
  );
};

export default CardPlot;
