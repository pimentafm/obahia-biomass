import React, { useState, useEffect } from 'react';
import PlotlyChart from 'react-plotlyjs-ts';

import { useTranslation } from 'react-i18next';
import { oba } from '../../../services';

interface BarPlotData {
  type: string;
  sum: string;
}

interface BarplotProps {
  year: number;
  code: number;
  tableName: string;
}

const Barplot: React.FC<BarplotProps> = ({ year, code, tableName }) => {
  const { t } = useTranslation();

  const [agb, setAGB] = useState<number>();
  const [bgb, setBGB] = useState<number>();
  const [soc, setSOC] = useState<number>();

  const [colors] = useState(['#AFCE58', '#FD984D', '#A58250']);

  const [xaxis, setXAxis] = useState([
    t('label_agb_barplot'),
    t('label_bgb_barplot'),
    t('label_soc_barplot'),
  ]);

  useEffect(() => {
    oba
      .post('biomassdrain/', {
        year1: year,
        year2: year,
        code,
        bt: 'AGB',
        table_name: tableName,
        headers: {
          'Content-type': 'application/json',
        },
      })
      .then(response => {
        const data = response.data
          .filter((f: BarPlotData) => f.type)
          .map((a: BarPlotData) => a.sum);

        setAGB(data[0]);
      })
      .catch(e => {
        throw new Error('Do not load Barplot data');
      });

    oba
      .post('biomassdrain/', {
        year1: year,
        year2: year,
        code,
        bt: 'BGB',
        table_name: tableName,
        headers: {
          'Content-type': 'application/json',
        },
      })
      .then(response => {
        const data = response.data
          .filter((f: BarPlotData) => f.type)
          .map((a: BarPlotData) => a.sum);

        setBGB(data[0]);
      })
      .catch(e => {
        throw new Error('Do not load Barplot data');
      });

    oba
      .post('biomassdrain/', {
        year1: year,
        year2: year,
        code,
        bt: 'SOC',
        table_name: tableName,
        headers: {
          'Content-type': 'application/json',
        },
      })
      .then(response => {
        const data = response.data
          .filter((f: BarPlotData) => f.type)
          .map((a: BarPlotData) => a.sum);

        setSOC(data[0]);
      })
      .catch(e => {
        throw new Error('Do not load Barplot data');
      });

    setXAxis([t('label_agb'), t('label_bgb'), t('label_soc')]);
  }, [year, code, tableName, t]);

  const data = [
    {
      x: xaxis,
      y: [agb, bgb, soc],
      stackgroup: 'one',
      type: 'bar',
      hovertemplate: '%{y:.5f} x 10<sup>3</sup> Gg-C<extra></extra>',
      marker: { color: colors },
    },
  ];

  const layout = {
    title: {
      font: {
        family: 'Arial, sans-serif',
        size: 14,
      },
    },
    height: 300,
    xaxis: {
      tickfont: {
        family: 'Arial, sans-serif',
        size: 12,
        color: 'black',
      },
      autotick: false,
      showticklabels: true,
      ticks: 'outside',
      tickcolor: '#000',
    },
    yaxis: {
      title: {
        text: '10<sup>3</sup> Gg-C',
      },
      titlefont: {
        family: 'Arial, sans-serif',
        size: 12,
        color: '#000',
      },
      tickfont: {
        family: 'Arial, sans-serif',
        size: 12,
        color: 'black',
      },

      autotick: false,
      ticks: 'outside',
      tick0: 0,
      dtick: 0.1,
      ticklen: 2,
      tickwidth: 1,
      tickcolor: '#000',
    },
    showlegend: false,
    margin: { l: 60, r: 10, t: 10, b: 50 },
    transition: {
      duration: 1000,
      easing: 'quad-in-out',
      ordering: 'traces first',
    },
  };

  const config = {
    responsive: true,
    displaylogo: false,
    modeBarButtonsToRemove: ['zoom2d', 'select2d', 'lasso2d'],
  };

  return <PlotlyChart data={data} layout={layout} config={config} />;
};

export default Barplot;
