import {
  qdtEnigma, qdtCompose, QdtTable, QdtButton, //eslint-disable-line
} from 'qdt-components';
// import React from 'react';

const config = {
  host: 'sense-demo.qlik.com',
  secure: true,
  port: 443,
  prefix: '',
  appId: '372cbc85-f7fb-4db6-a620-9a5367845dce',
};

// const myButton = ({ label, type }) => ( //eslint-disable-line
//   <QdtButton //eslint-disable-line
//     label={label}
//     type={type}
//   />
// );

// https://sense-demo-staging.qlik.com/windows/sense/app/372cbc85-f7fb-4db6-a620-9a5367845dce/overview

qdtEnigma(config).then((app) => {  //eslint-disable-line
  // qdtCompose({
  //   element: document.querySelector('.object'),
  //   component: QdtTable,
  //   options: {},
  //   app,
  //   properties: {
  //     qHyperCubeDef: {
  //       qDimensions: [{
  //         qDef: { qFieldDefs: ['[Product Group Desc]'] },
  //       }],
  //       qMeasures: [{
  //         qDef: { qDef: 'Sum([Sales Price])' },
  //       }],
  //     },
  //   },
  // });

  qdtCompose({
    element: document.querySelector('.cm-object-1'),
    component: QdtTable,
    options: {},
    app,
    properties: {
      qHyperCubeDef: {
        qDimensions: [{
          qDef: { qFieldDefs: ['[Month]'] },
        }],
        qMeasures: [{
          qDef: { qDef: 'Sum([YTD Sales Amount])' },
        }],
      },
    },
  });

  qdtCompose({
    element: document.querySelector('.cm-object-2'),
    component: QdtButton,
    options: { label: 'Clear All', type: 'clear' },
    app,
    properties: {},
  });

  app.createSessionObject({ qInfo: { qType: 'fields' }, qFieldListDef: {}, qStuff: {} }).then((res) => {
    res.getLayout().then((layout) => {
      console.log(layout);
      const fields = layout.qFieldList.qItems.reduce((acc, obj) => {
        acc[obj.qName] = obj;
        return acc;
      }, {});
      console.log(fields);
    });
  });
});
