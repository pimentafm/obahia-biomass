import React from 'react';

import Map from '../../components/MapRegion';

import { useTranslation } from 'react-i18next';

const Region: React.FC = () => {
  const { t } = useTranslation();

  return <Map defaultYear={2018} defaultCategory={t('select_region')} />;
};

export default Region;
