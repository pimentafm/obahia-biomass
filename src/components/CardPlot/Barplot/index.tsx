import React, { useState, useEffect } from 'react';
import PlotlyChart from 'react-plotlyjs-ts';

import { oba } from '../../../services';

interface BarPlotData {
  data: Object;
}

interface BarPlotData {
  type: string;
  sum: string;
}

interface BarplotProps {
  year: number;
  tableName: string;
}

const Barplot: React.FC<BarplotProps> = ({ year, tableName }) => {
  const [agb, setAGB] = useState<number>();
  const [bgb, setBGB] = useState<number>();
  const [soc, setSOC] = useState<number>();

  const [colors] = useState(['#AFCE58', '#FD984D', '#A58250']);

  const [xaxis] = useState([
    'Biomassa acima do solo',
    'Biomassa abaixo do solo',
    'Estoque de carbono',
  ]);

  useEffect(() => {
    oba
      .post('biomassregion/', {
        year1: year,
        year2: year,
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
      .post('biomassregion/', {
        year1: year,
        year2: year,
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
      .post('biomassregion/', {
        year1: year,
        year2: year,
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
  }, [year, tableName]);

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
      // text: '<b>Cobertura e uso do solo ' + year + '</b>',
      font: {
        family: 'Arial, sans-serif',
        size: 14,
      },
    },
    height: 300,
    xaxis: {
      title: {
        text: 'Tipo',
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
      ticks: 'outside',
      tick0: 0,
      dtick: 2000,
      ticklen: 6,
      tickwidth: 1,
      tickcolor: '#000',
    },
    showlegend: false,
    margin: { l: 60, r: 10, t: 0, b: 50 },
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