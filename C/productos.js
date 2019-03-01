function productos(){
 // Conectar UiSlider Doble para Tiempos
 var invMin= 2000000;
 var invMax= 3000000;
 var invRng= {'min': [1500000, 100000],'50%': [3000000, 200000],'max': 4000000 };
 var invFrmt= { decimals: 0, prefix: '$ ' , suffix: '.&deg;&deg;', thousand: ',' };

 //cargaUiSliderDbl('#invUiSlider','.input-invUiSlider-0','.input-invUiSlider-1',invMin,invMax,invRng,invFrmt).then(function(){
   endLoad();
 //});
}

//productos();
