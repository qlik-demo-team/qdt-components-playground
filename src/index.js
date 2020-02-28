import jsx from 'html-react-parser';
import {
  qdtEnigma, qdtCompose, QdtTable, QdtButton, //eslint-disable-line
  // qdtEnigma, qdtCompose, QdtTable, QdtPicasso, QdtSelect, //eslint-disable-line
} from 'qdt-components';
// import React from 'react';

const config = {
  host: 'sense-demo.qlik.com',
  secure: true,
  port: 443,
  prefix: '',
  appId: '372cbc85-f7fb-4db6-a620-9a5367845dce',
};


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
  window.q = q;
  setTimeout(() => {
    console.log('running update');
    q.update({
      component: ({ layout }) => jsx(`<div>${layout.avgSales}</div>`),
      properties: {
        avgSales: { qValueExpression: { qExpr: 'Avg([Sales Price])' } },
      },
    });
  });
});
