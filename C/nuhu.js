/**
	* Proyect:NUHU
	* File: C/nuhu.js
	* Version : 0.8
	* author: Quidware.com
	* descr: Controlador para Administrar Información de NUHU
	*
 */

function nuhu(){
	//firebase.database().ref('/nuhu/').once('value').then(function (rslt){
	firebase.database().ref('/nuhu/').once('value',function (rslt){
    chiHqO(rslt.val().direccion,"#nuhu-direccion");
    chiHqO(rslt.val().mision,"#nuhu-mision");
    chiHqO(rslt.val().productos,"#nuhu-productos");
    chiHqO(rslt.val().historia,"#nuhu-historia");
    endLoad();
  }, function(error){alert("nuhu load Failed! "+error)});
}

//nuhu();
