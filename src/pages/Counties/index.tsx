import React from 'react';

import Map from '../../components/MapCounty';

import { useTranslation } from 'react-i18next';

const Counties: React.FC = () => {
  const { t } = useTranslation();
  return (
    <Map
      defaultYear={2018}
      defaultCategory={t('select_municipal')}
      defaultCodeName={{ code: 2903201, name: 'BARREIRAS - 2903201' }}
    />
  );
};

export default Counties;
