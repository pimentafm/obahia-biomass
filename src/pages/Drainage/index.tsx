import React from 'react';

import Map from '../../components/MapDrainage';

import { useTranslation } from 'react-i18next';

const Drainage: React.FC = () => {
  const { t } = useTranslation();
  return (
    <Map
      defaultYear={2018}
      defaultCategory={t('select_drainage')}
      defaultCodeName={{ code: 46543000, name: 'RIO DE ONDAS - 46543000' }}
    />
  );
};

export default Drainage;
