ymaps.ready(init);

var map

function init() {

  map = new ymaps.Map("map", {
    center: [55.030199, 82.920430],
    zoom: 10,
    controls: ['zoomControl','geolocationControl']
  });

  updatePoints("hdpe_ldpe_pp_ps_fe-cans_alu-aluminum-cans")
}

function updatePoints(newPointsType) {

    $.getJSON("https://raw.githubusercontent.com/DmitriiSukhomlinov/waste-sorting/master/resources/data.json", function(data) {
      //Найдем в json файле раздел, соответствующий необходимому нам
      var currentData
      $.each( data, function( key, val ) {
        if (key === newPointsType) {
            currentData = val
        }
      });
      var myGeoObjects = currentData.MapData.map(item => {
        return new ymaps.GeoObject({
          geometry: {
            type: "Point",
            // Переведем строку с координатами в массив
            coordinates: item.MapPointCoordinates.split(', ')
          },
          properties: {
            clusterCaption: 'Контейнер',
            balloonContentBody: [
              '<address style="font-style: normal">',
              '<h3>Данные</h3>',
              '<b>Адрес: </b>' + item.MapPointAdress + '<br>',
              /*'<b>Категория потребителя: </b>' + item.MapPointCathegory + '<br>',
              '<b>Кол-во контейнеров: </b>' + item.MapPointQuantity + '<br>',
              '<b>Тип контейнера: </b>' + item.MapPointType + '<br>',
              '<b>Объем: </b>' + item.MapPointVolume + '<br>',*/
              '</address>'
            ].join('')
          }
        }, {
          preset: "islands#darkGreenDotIcon",
          iconColor: currentData.Color
        });
      })
      // Создадим кластеризатор после получения и добавления точек
      var clusterer = new ymaps.Clusterer({
        preset: currentData.GroupButton,
        clusterDisableClickZoom: true,
        clusterBalloonContentLayoutWidth: 800,
        clusterBalloonLeftColumnWidth: 160
      });
      clusterer.add(myGeoObjects);
      map.geoObjects.removeAll();
      map.geoObjects.add(clusterer);
      map.setBounds(clusterer.getBounds(), {
        checkZoomRange: true
      });
    })
}