import React, { useState, useEffect } from 'react';
import PlotlyChart from 'react-plotlyjs-ts';

import { oba } from '../../../services';

interface StackPlotData {
  forest: Object;
  savanna: Object;
  grass: Object;
  croppast: Object;
  raincrop: Object;
  irrcrop: Object;
  past: Object;
  water: Object;
  urban: Object;
}

interface StackPlotData {
  type: string;
  sum: string;
}

interface StackPlotProps {
  watershed: string;
  tableName: string;
}

const StackPlot: React.FC<StackPlotProps> = ({ watershed, tableName }) => {
  const [agb, setAGB] = useState(null);
  const [bgb, setBGB] = useState(null);
  const [soc, setSOC] = useState(null);

  const [xaxis] = useState(
    Array.from(new Array(29), (val, index) => index + 1990),
  );

  useEffect(() => {
    oba
      .post('biomassgcc/', {
        year1: 1990,
        year2: 2018,
        gcc: watershed,
        bt: 'AGB',
        table_name: tableName,
        headers: {
          'Content-type': 'application/json',
        },
      })
      .then(response => {
        setAGB(
          response.data
            .filter((f: StackPlotData) => f.type === 'AGB')
            .map((a: StackPlotData) => a.sum),
        );
      })
      .catch(e => {
        throw new Error('Do not load StackPlot data');
      });

    oba
      .post('biomassgcc/', {
        year1: 1990,
        year2: 2018,
        gcc: watershed,
        bt: 'BGB',
        table_name: tableName,
        headers: {
          'Content-type': 'application/json',
        },
      })
      .then(response => {
        setBGB(
          response.data
            .filter((f: StackPlotData) => f.type === 'BGB')
            .map((a: StackPlotData) => a.sum),
        );
      })
      .catch(e => {
        throw new Error('Do not load StackPlot data');
      });

    oba
      .post('biomassgcc/', {
        year1: 1990,
        year2: 2018,
        gcc: watershed,
        bt: 'SOC',
        table_name: tableName,
        headers: {
          'Content-type': 'application/json',
        },
      })
      .then(response => {
        setSOC(
          response.data
            .filter((f: StackPlotData) => f.type === 'SOC')
            .map((a: StackPlotData) => a.sum),
        );
      })
      .catch(e => {
        throw new Error('Do not load StackPlot data');
      });
  }, [watershed, tableName]);

  const data = [
    {
      x: xaxis,
      y: soc,
      stackgroup: 'one',
      fillcolor: '#A58250',
      type: 'scatter',
      //text: Array(29).fill('Formações campestres'),
      hovertemplate: '%{y:.5f} tCha<sup>-1</sup><extra></extra>',
      line: { color: '#A58250' },
    },
    {
      x: xaxis,
      y: bgb,
      stackgroup: 'one',
      fillcolor: '#FD984D',
      type: 'scatter',
      //text: Array(29).fill('Formações savânicas'),
      hovertemplate: '%{y:.5f} tCha<sup>-1</sup><extra></extra>',
      line: { color: '#FD984D' },
    },
    {
      x: xaxis,
      y: agb,
      stackgroup: 'one',
      fillcolor: '#AFCE58',
      type: 'scatter',
      //text: Array(29).fill('Formações florestais'),
      hovertemplate: '%{y:.5f} tCha<sup>-1</sup><extra></extra>',
      line: { color: '#AFCE58' },
    },
  ];
  const layout = {
    title: {
      //text: '<b>Cobertura e uso do solo (1990 - 2018)</b>',
      font: {
        family: 'Arial, sans-serif',
        size: 14,
      },
    },
    height: 300,
    xaxis: {
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
      tick0: 1990,
      dtick: 5,
      ticklen: 6,
      tickwidth: 1,
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
    margin: { l: 60, r: 10, t: 10, b: 30 },
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

export default StackPlot;
