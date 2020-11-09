import React, { useEffect } from 'react';

import ReactGA from 'react-ga';
import Map from '../../components/MapRegion';

const Region: React.FC = () => {
  useEffect(() => {
    ReactGA.initialize('UA-182410588-4');
    ReactGA.pageview('/');
  }, []);
  return <Map defaultYear={2018} defaultCategory="regional" />;
};

export default Region;
