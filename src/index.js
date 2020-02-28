import jsx from 'html-react-parser';
import {
  qdtEnigma, qdtCompose, QdtTable, QdtPicasso, QdtSelect, //eslint-disable-line
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
  window.q = q;
  setTimeout(() => {
    console.log('running update');
    q.update({
      component: ({ layout }) => jsx(`<div>${layout.avgSales}</div>`),
      properties: {
        avgSales: { qValueExpression: { qExpr: 'Avg([Sales Price])' } },
      },
    });
  }, 5000);
  setTimeout(() => {
    q.destroy();
  }, 10000);
});
