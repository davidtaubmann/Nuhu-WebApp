/**
	* Proyect:NUHU
	* File: C/A_nuhu.js
	* Version : 0.6
	* author: Quidware.com
	* descr: Controlador para Administrar Información de NUHU
	*
 */

function A_nuhu(){
  /**/
  // Load RTE nicEditor
  DTXPromLoadAsyncJS("scripts/nicEdit-latest.js").then(function(success){
    SyncElmntChanges("#nuhu-content input[type=text]","/nuhu/");
    SyncElmntChanges("#nuhu-content textarea","/nuhu/");

    new nicEditor({fullPanel : true}).setPanel('productos_Panel').addInstance("productos");
    //new nicEditor({fullPanel : true}).setPanel('historia_Panel').addInstance("historia");

    firebase.database().ref('/nuhu/').once('value').then(function (rslt){
      chiHqO(rslt.val().productos,"#productos");
      //chiHqO(rslt.val().historia,"#historia");
    }, function(error){console.error("productos Failed! "+error)});

    endLoad();
  }, function(error){console.error("JS Load Failed! ",error)});

  /*/
  SyncElmntChanges("#nuhu-content input[type=text]","/config/");
  SyncElmntChanges("#nuhu-content textarea","config/");
  / * /
  firebase.database().ref('config/').on('value',function (rslt){
    chiHqO(rslt.val().direccion,"#nuhu-direccion");
    chiHqO(rslt.val().mision,"#nuhu-mision");
    chiHqO(rslt.val().productos,"#nuhu-productos");
    chiHqO(rslt.val().historia,"#nuhu-historia");
    endLoad();
  }, function(error){console.error("nuhu load Failed! "+error)});
  /*/
}


//A_nuhu();
