import {
  qdtEnigma, useHyperCube, qdtDoc, QdtMapBox, QdtTheme, useListObject, QdtSlider, QdtKpi,
} from 'qdt-components';

const config = {
  host: 'sense-demo.qlik.com',
  secure: true,
  port: 443,
  prefix: '',
  appId: '4052680c-fd97-4f49-ac83-e026cdd26d65', // Swipe Night
};

const init = async () => {
  const app = await qdtEnigma(config);

  const { layout, model } = await useHyperCube({
    app,
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
      qInitialDataFetch: [{
        qWidth: 4,
        qHeight: 2500,
      }],
    },
  });

  const centerCamera = (map) => {
    map.flyTo({
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
    centerCamera(map);
  };

  const mapBoxOptions = {
    style: 'mapbox://styles/arturomunoz/ck5sfqssr0o6m1ipmfmpop8xk',
    center: [-140, 50],
    zoom: 3,
    pitch: 90,
    height: 800,
    handleMapCallback,
    antialias: true, // create the gl context with MSAA antialiasing, so custom layers are antialiased
    theme: QdtTheme.Dark,
  };

  qdtDoc(
    document.getElementById('mapbox'),
    layout,
    model,
  )(QdtMapBox, mapBoxOptions);

  const { layout: layoutSlider, model: modelSlider } = await useListObject({
    app,
    qListObjectDef: {
      qDef: {
        qFieldDefs: ['gender'],
      },
      qInitialDataFetch: [{
        qWidth: 1,
        qHeight: 1000,
      }],
    },
  });

  qdtDoc(
    document.getElementById('slider'),
    layoutSlider,
    modelSlider,
  )(QdtSlider, { theme: QdtTheme.Dark });

  const { layout: layoutKpi, model: modelKpi } = await useHyperCube({
    app,
    qHyperCubeDef: {
      qDimensions: [],
      qMeasures: [{
        qDef: { qDef: 'Num(Count(user_journey), \'###,###\')' },
      }],
      qInitialDataFetch: [{
        qWidth: 1,
        qHeight: 1,
      }],
    },
  });

  console.log(111, layoutKpi);
  qdtDoc(
    document.getElementById('kpi'),
    layoutKpi,
    modelKpi,
  )(QdtKpi, { theme: QdtTheme.Dark, variant: 'contained', color: 'secondary' });
};

init();
