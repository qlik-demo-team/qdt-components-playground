import { qdtNova, QdtTheme, QdtSelect, QdtTable, QdtSequencer, QdtSlider, QdtMapBox, useHyperCube } from 'qdt-components';  //eslint-disable-line
import nucleus from '@nebula.js/nucleus';
import * as supernova from '@nebula.js/supernova';  //eslint-disable-line
// import combochart from '@nebula.js/sn-mekko-chart';

/* CONNECT TO APP WITH enigma.js */
const enigma = require('enigma.js');
const schema = require('enigma.js/schemas/12.170.2.json');
const SenseUtilities = require('enigma.js/sense-utilities');

const config = {
  host: 'sense-demo.qlik.com',
  secure: true,
  port: 443,
  prefix: '',
  appId: '372cbc85-f7fb-4db6-a620-9a5367845dce',
};

const config2 = {
  host: 'sense-demo.qlik.com',
  secure: true,
  port: 443,
  prefix: '',
  appId: '4052680c-fd97-4f49-ac83-e026cdd26d65', // Swipe Night
};
const url = SenseUtilities.buildUrl(config);
const url2 = SenseUtilities.buildUrl(config2);

const init = async () => {
  const session = enigma.create({ schema, url, suspendOnClose: true });
  const session2 = enigma.create({ schema, url2 });
  session2.rpc.url = url2;
  const global = await session.open();
  const global2 = await session2.open();
  const app = await global.openDoc(config.appId);
  const app2 = await global2.openDoc(config2.appId);
  // create a nuked and register components.
  // notice how qdtNova needs to be passed the whole supernova library.
  // theres some bug when loading the supernova library and
  // using the hooks directy in qdtNova
  // here we load the qdt-table and qdt-select
  const nuked = nucleus(app, {
    types: [
      {
        name: 'qdt-table',
        load: () => Promise.resolve(qdtNova(supernova)(QdtTable, {})),
      },
      {
        name: 'qdt-select',
        load: () => Promise.resolve(qdtNova(supernova)(QdtSelect, { multiple: true })),
      },
      {
        name: 'qdt-sequencer',
        load: () => Promise.resolve(qdtNova(supernova)(QdtSequencer, { theme: QdtTheme.Dark })),
      },
      {
        name: 'qdt-slider',
        load: () => Promise.resolve(qdtNova(supernova)(QdtSlider, { theme: QdtTheme.Dark })),
      },
    ],
  });

  // this adds selection bar. nice.
  nuked.selections().then(s => s.mount(document.querySelector('.toolbar')));

  // create a viz
  nuked.create({
    type: 'qdt-table',
  }, {
    element: document.querySelector('.object'),
    properties: {
      qHyperCubeDef: {
        qDimensions: [{
          qDef: { qFieldDefs: ['[Product Group Desc]'] },
        }],
        qMeasures: [{
          qDef: { qDef: 'Sum([Sales Price])' },
        }],
        qInitialDataFetch: [{
          qWidth: 2,
          qHeight: 50,
        }],
      },
    },
  });

  // create a viz
  nuked.create({
    type: 'qdt-select',
  }, {
    element: document.querySelector('.select'),
    properties: {
      qListObjectDef: {
        qDef: {
          qFieldDefs: ['[Product Group Desc]'],
        },
        qInitialDataFetch: [{
          qWidth: 1,
          qHeight: 1000,
        }],
      },
    },
  });

  // QdtSequencer
  nuked.create({
    type: 'qdt-sequencer',
  }, {
    element: document.getElementById('sequencer'),
    properties: {
      qListObjectDef: {
        qDef: {
          qFieldDefs: ['Month'],
        },
        qInitialDataFetch: [{
          qWidth: 1,
          qHeight: 1000,
        }],
      },
    },
  });

  // QdtSlider
  nuked.create({
    type: 'qdt-slider',
  }, {
    element: document.getElementById('slider'),
    properties: {
      qListObjectDef: {
        qDef: {
          qFieldDefs: ['Month'],
        },
        qInitialDataFetch: [{
          qWidth: 1,
          qHeight: 1000,
        }],
      },
    },
  });

  const centerCamera = (map) => {
    map.flyTo({
      // center: [-97.531708, 39.305878],
      center: [-94.39962116967581, 40.61298086159351],
      zoom: 4.15,
      bearing: -8,
      speed: 0.6, // make the flying slow
      curve: 1, // change the speed at which it zooms out
      pitch: 58,
      easing(t) {
        return t;
      },
      essential: true,
    });
  };

  const handleMapCallback = (map) => {
    console.log('handleMapCallback');
    console.log(map);
    centerCamera(map);
  };

  const mapBoxOptions = {
    // accessToken: 'pk.eyJ1IjoiYXJ0dXJvbXVub3oiLCJhIjoiY2swODR2NmlhNDYwaDNicDBlcnB6YmR0OSJ9.AgG7MN8DX1aFuG1DfbFr_Q',
    style: 'mapbox://styles/arturomunoz/ck5sfqssr0o6m1ipmfmpop8xk',
    center: [-140, 50],
    zoom: 3,
    pitch: 90,
    height: 800,
    handleMapCallback,
    antialias: true, // create the gl context with MSAA antialiasing, so custom layers are antialiased
    theme: QdtTheme.Dark,
  };

  const nuked2 = nucleus(app2, {
    types: [
      {
        name: 'qdt-mapbox',
        load: () => Promise.resolve(qdtNova(supernova)(QdtMapBox, mapBoxOptions)),
      },
    ],
  });

  //
  nuked2.create({
    type: 'qdt-mapbox',
  }, {
    element: document.getElementById('mapbox'),
    properties: {
      qHyperCubeDef: {
        qDimensions: [
          {
            qDef: {
              qFieldDefs: ['ID'],
            },
          },
          {
            qNullSuppression: true,
            qDef: { qFieldDefs: ['lat'] },
          },
          {
            qNullSuppression: true,
            qDef: { qFieldDefs: ['lon'] },
          },
          { qDef: { qFieldDefs: ['gender'] } },
        ],
        // qMeasures: [],
        qInitialDataFetch: [{
          qWidth: 4,
          qHeight: 2500,
        }],
      },
    },
  });


  const test = await useHyperCube({
    app: app2,
    options: {
      qHyperCubeDef: {
        qDimensions: [
          {
            qDef: {
              qFieldDefs: ['ID'],
            },
          },
          {
            qNullSuppression: true,
            qDef: { qFieldDefs: ['lat'] },
          },
          {
            qNullSuppression: true,
            qDef: { qFieldDefs: ['lon'] },
          },
          { qDef: { qFieldDefs: ['gender'] } },
        ],
        // qMeasures: [],
        qInitialDataFetch: [{
          qWidth: 4,
          qHeight: 2500,
        }],
      },
    },
  });
  console.log(222, test);
};


// cols: ['ID', 'lat', 'lon', 'gender'],
// height: 400,
// qPage: {
//   qTop: 0,
//   qLeft: 0,
//   qWidth: 4,
//   qHeight: 2500,
// },

init();
