import { qdtNova, QdtSelect, QdtTable, QdtSequencer, QdtSlider } from 'qdt-components';  //eslint-disable-line
import nucleus from '@nebula.js/nucleus';
import * as supernova from '@nebula.js/supernova';  //eslint-disable-line
// import combochart from '@nebula.js/sn-mekko-chart';

/* CONNECT TO APP WITH enigma.js */
const enigma = require('enigma.js');
const schema = require('enigma.js/schemas/12.20.0.json');
const SenseUtilities = require('enigma.js/sense-utilities');

const config = {
  host: 'sense-demo.qlik.com',
  secure: true,
  port: 443,
  prefix: '',
  appId: '372cbc85-f7fb-4db6-a620-9a5367845dce',
};

const url = SenseUtilities.buildUrl(config);

const session = enigma.create({ schema, url, suspendOnClose: true });

session.open().then(global => global.openDoc(config.appId)).then((app) => {
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
        load: () => Promise.resolve(qdtNova(supernova)(QdtSequencer, { })),
      },
      {
        name: 'qdt-slider',
        load: () => Promise.resolve(qdtNova(supernova)(QdtSlider, { })),
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
});
