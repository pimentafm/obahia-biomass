import React from 'react';

import Map from '../../components/MapWatershed';

import { useTranslation } from 'react-i18next';

const Watershed: React.FC = () => {
  const { t } = useTranslation();

  return (
    <Map
      defaultYear={2018}
      defaultCategory={t('select_watershed')}
      defaultWatershed="grande"
    />
  );
};

export default Watershed;
