import React, { useState, useEffect } from 'react';
import PlotlyChart from 'react-plotlyjs-ts';

import { oba } from '../../../services';

import { useTranslation } from 'react-i18next';

interface BarPlotData {
  type: string;
  sum: string;
}

interface BarplotProps {
  year: number;
  watershed: string;
  tableName: string;
}

const Barplot: React.FC<BarplotProps> = ({ year, watershed, tableName }) => {
  const { t } = useTranslation();

  const [agb, setAGB] = useState<number>();
  const [bgb, setBGB] = useState<number>();
  const [soc, setSOC] = useState<number>();

  const [colors] = useState(['#AFCE58', '#FD984D', '#A58250']);

  const [xaxis, setXAxis] = useState([
    t('label_agb'),
    t('label_bgb'),
    t('label_soc'),
  ]);

  useEffect(() => {
    oba
      .post('biomassgcc/', {
        year1: year,
        year2: year,
        bt: 'AGB',
        gcc: watershed,
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
      .post('biomassgcc/', {
        year1: year,
        year2: year,
        bt: 'BGB',
        gcc: watershed,
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
      .post('biomassgcc/', {
        year1: year,
        year2: year,
        bt: 'SOC',
        gcc: watershed,
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
  }, [year, watershed, tableName, t]);

  const data = [
    {
      x: xaxis,
      y: [agb, bgb, soc],
      stackgroup: 'one',
      type: 'bar',
      hovertemplate: '%{y:.5f} tCha<sup>-1</sup><extra></extra>',
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
      title: {
        text: 'Classes',
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
      showticklabels: false,
      ticks: 'outside',
      tickcolor: '#000',
    },
    yaxis: {
      title: {
        text: 'tCha<sup>-1</sup>',
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
      autorange: true,
      ticks: 'outside',
      tick0: 0,
      dtick: 2000,
      ticklen: 6,
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
