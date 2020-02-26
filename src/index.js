import {
  qdtEnigma, qdtCompose, QdtTable, //eslint-disable-line
} from 'qdt-components';

const config = {
  host: 'sense-demo.qlik.com',
  secure: true,
  port: 443,
  prefix: '',
  appId: '372cbc85-f7fb-4db6-a620-9a5367845dce',
};

qdtEnigma(config).then((app) => {  //eslint-disable-line
  const q = qdtCompose({
    element: document.querySelector('.object'),
    component: QdtTable,
    options: {},
    app,
    properties: {
      qHyperCubeDef: {
        qDimensions: [{
          qDef: { qFieldDefs: ['[Product Group Desc]'] },
        }],
        qMeasures: [{
          qDef: { qDef: 'Sum([Sales Price])' },
        }],
      },
    },
  });
  setTimeout(() => {
    console.log('running update');
    q.update({
      element: document.querySelector('.object'),
      properties: {
        qHyperCubeDef: {
          qDimensions: [{
            qDef: { qFieldDefs: ['[Sales Rep Name]'] },
          }],
        },
      },
    });
  }, 5000);
  setTimeout(() => {
    q.destroy();
  }, 10000);
});
