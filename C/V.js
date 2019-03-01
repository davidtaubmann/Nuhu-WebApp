// JavaScript Document
'use strict';

/**
 * Proyect:NUHU
 * File: C/V.js
 * Version : 0.81
 * author: Quidware.com
 * descr: Controlador de Vistas (similar a un ruteador, pero falta mejorar)
 *
 * TODO's
 * ######################
 * Screens: pushstate (https://html.spec.whatwg.org/multipage/browsers.html#dom-history-pushstate)
 *
 */

// Globales de Elementos estorbosos para desarrollo (Prenderlos en ambiente de producción)
var use_VIDEO=0; // 1=si, 0=no	// Cargar VIDEO
var use_XXXXX=0; // 1=si, 0=no	// Cargar XXXXX

// Secuencia de contenidos (sobretodo para continuidad de flechas)
var sec=["vid-1","cliData-1","cliData-3","vid-2","cliData-2","nec-A","nec-B","vid-3","nec-C","nec-D","nec-E","vid-4","finanzas","vid-5","desarrollos","desarrollo","casa","compra"];
// Establecer primera seccion a mostrar, en producción debiera ser la primera de la matriz "sec"
var frstSec="inicio"; //"casa";	//
// Historial de pantallas (PASADO)
var hst=["location.reload()"];
// Definir país de donde vienen normalmente los usuarios
//resp.pais="CA";

// NO TOCAR A PARTIR DE AQUÍ
// Ya se terminó de cargar el ambiente completo?
var SPAPWALoaded=-1;	//"ini";
// Pantalla en carga/ejecución (PRESENTE, evitar dobles del mismo)
var exectn=-1;	//"ini";
// Estamos en una Tableta o Smartphone
var movil;
// Conexiones de FireBase prendidas (para apagarlas en el cambio de pantalla)
// IMPORTANTE siempre capturarlas aquí!
var prends=[];
// Mantener los onChange originales de los elementos funcionando
var orgOnChng=[];
// Objeto de Estados del país del usuario
var O_CC_Stts;
// Establecer selector del contenedor principal de contenidos
var CNT;
// Objeto de Abreviaturas de Estados del país del usuario
var O_CC_ST;
// Objeto de Respuestas del usuario
var resp = new Object;
// Current
var curr=hst[hst.length-1];


//INICIA CONTROLADOR DE CONTENIDOS
function initVs() {
	if(tst_loads)console.log("initVs");
	// SOLO Moviles (para evitas video, y elementos de barra NAV):
	if( /Android|webOS|iPhone|iPod|iPad|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
		movil=1;
	}
	// NO Movil:
	else {
		movil=0;
	}
	if(tst_loads) console.log("Movil: ",movil);	//,navigator.userAgent);

	// Ocultar MDL Drawer Menú (http://stackoverflow.com/questions/31536467/how-to-hide-drawer-upon-user-click)
	// No se está usando pues los submenús de Drawer se pierden en FireFox
/*/
	document.querySelector('.mdl-layout__drawer').addEventListener('click', function (e) {
		e = e || window.event;
    var target = e.target || e.srcElement
		if(!target.classList.contains('mdl-button__ripple-container')){
			document.querySelector('.mdl-layout__obfuscator').classList.remove('is-visible');
			this.classList.remove('is-visible');
		}
	}, false);
/**/

	// MDL play videos automatically (https://github.com/google/material-design-lite/issues/1155):
	// No se está usando pues no se usan videos en éste proyecto
/*/
	//document.querySelector('.mdl-js-layout').addEventListener('mdl-componentupgraded',
	document.querySelector('.mdl-layout').addEventListener('mdl-componentupgraded',
		function(){
			[].forEach.call(document.querySelectorAll('.mdl-layout video[autoplay]'), function(e) {
					e.play();
					if(tst_loads) console.log("Video Play: ",this.tagName);
			});
		}
	);
/**/

	// Ocultar Modales (tipo target) al presionar su sombra
	clsModalShdw("#tc");
	clsModalShdw("#ap");

	// Ocultar Modales (tipo target) al presionar Esc
	// Debería funcionar sólo cuando los Modales están activos (location.hash)
	/**/
	document.addEventListener('keyup', function (e) {
		e = e || window.event;
		//console.log("keyup: "+e.target.tagName);
		if ("key" in e) {
			if(e.key == "Escape" || e.key == "Esc")
			location.href="#";
    } else if(e.keyCode == 27)
			location.href="#";
	}, false);
	/**/

	// Cargar CSS para ambiente de Desarrollo
	if(tst_css) DTXPromLoadAsyncCSS("V/M/devFrame.css");

	// MDL
	// ComponentHandler.upgradeDom();

	// Establecer contenedor principal de contenidos
	CNT=document.querySelector('#nuhu-content');

	SPAPWALoaded=1;
	endLoad();

	// Colocar contenido inicial
	// loadCnt("inicio");
	if(!detURLroute()) loadCnt("inicio");
};
//TERMINA CONTROLADOR DE CONTENIDOS

/*/
//Armar inserción de video
function creaVideo(x){
	if(!CNT.classList.contains("video")) CNT.classList.add("video");
	if(CNT.classList.contains("desarrollo")) CNT.classList.remove("desarrollo");
	var html='';
	html+='<video width="100%" height="100%" autoplay controls>';
	html+='	<source src="'+x+'" type="video/mp4">';
	html+='	Tu explorador no soporta éste tipo de videos.';
	html+='</video>';
	return html;
}
/**/

// Retroceder un contenido conforme a la SECuencia
function secRetro(){
	var retro=sec.indexOf(hst[hst.length-1].substring(hst[hst.length-1].indexOf("(")+1,hst[hst.length-1].indexOf(",")))-1;
	if(sec[retro])loadCnt(sec[retro]); else if(tst_loads)console.log("Falló secProgr:",sec[retro]);
}

// Avanzar un contenido conforme a la SECuencia
function secProgr(){
	var prog=sec.indexOf(hst[hst.length-1].substring(hst[hst.length-1].indexOf("(")+1,hst[hst.length-1].indexOf(",")))+1;
	if(sec[prog])loadCnt(sec[prog]); else if(tst_loads)console.log("Falló secProgr:",sec[prog]);
}

// Autorizar Carga de Contenido (impide dobles cargas)
function authLoad(cnt,call){
	//Valida que no se esté cargando otro Contenido
	if(exectn==-1){
		//exectn=cnt;
		exectn=call;
		hst.push(call);
		//Activa Barra de Progreso
		progBar.style.opacity=1;	//.display="block";
		progBar.MaterialProgress.setProgress(12);
		progBar.MaterialProgress.setBuffer(25);
		// Eliminar Modales de Vista
		chiHqO("","#modalesV");
		// Eliminar Botón Inferior Derecho
		chiHqO("","#botInfDer");
		//Ocultar Drawer
		hideDrawer();
		//Autoriza ejecución
		return true;
	} else {
		console.error("DOBLE CARGA denegada, ejecutando: ",exectn);
		//Rechaza ejecución
		return false;
	}
}

// Liberar Ejecución de carga de Contenido (para impedir dobles cargas)
function endLoad(){
	if(tst_loads)console.log("Z. Contenido Cargado: "+exectn);
	exectn=-1;

	/*/
	// Upgrade MDL Components
	setTimeout('componentHandler.upgradeDom();',50);

	// Des-Activa Barra de Progreso
	setTimeout('progBar.MaterialProgress.setBuffer(100);',50);
	setTimeout('progBar.MaterialProgress.setProgress(100);',50);
	//progBar.style.opacity=0.0;
	setTimeout('progBar.style.opacity=0',300);	//display="none"

	//if(hst.length==1) detURLroute();
	/*/
	// Upgrade MDL Components
	componentHandler.upgradeDom();

	// Des-Activa Barra de Progreso
	progBar.MaterialProgress.setBuffer(100);
	progBar.MaterialProgress.setProgress(100);
	//progBar.style.opacity=0.0;
	progBar.style.opacity=0;

	//if(hst.length==1) detURLroute();

	/**/
}

//Insertar Contenidos desde Archivos
function loadCnt(cnt,vars){
//	if(tst_loads)console.log("1. loadCnt: ",cnt,vars);

	// Apagar las conexiones prendidas a Base de Datos
	while(prends.length){
		firebase.database().ref(prends.pop()).off();
	}if(tst_logs)console.log("PRENDS DELETED");

	if(authLoad(cnt,"loadCnt("+cnt+","+vars+")")){
		// Procesar la carga, HTML's se jalan de V(views) y JS de C(controllers)
		DTXPromLoadIntoHTML("V/"+cnt+".html","","nuhu-content").then(function(success){
			if(tst_loads)console.log("0. "+success);
			progBar.MaterialProgress.setProgress(25);
			progBar.MaterialProgress.setBuffer(50);
			if(cnt)DTXPromLoadAsyncJS("C/"+cnt+".js").then(function(success){
				progBar.MaterialProgress.setProgress(50);
				progBar.MaterialProgress.setBuffer(75);
				// Al final de la función JS del mismo nombre debe ejecutarse endLoad();
				if(window[cnt]) window[cnt](vars);
				else alert("window."+cnt+" no existe en éste ambiente.");
			}, function(error){console.error("JS Load Failed! ",error);endLoad()});
			else endLoad();
		}, function(error){console.error("HTML Load Failed! ",error);endLoad()});
	}
}

// Ocultar MDL Drawer Menú cuando se empieza a cargar algo
function hideDrawer(){
	document.querySelector('.mdl-layout__drawer').classList.remove('is-visible');
	document.querySelector('.mdl-layout__obfuscator').classList.remove('is-visible');
}

// Regresar a pantalla/proceso anterior
function Regresar(){
	if(tst_loads)console.log("HST: "+hst.join("|"));
	// Elimina pantalla actual
	hst.pop();
	// Toma pantalla anterior eliminandola
	var fue=hst.pop();
	if(tst_loads)console.log("HST: "+hst.join("|"));
	// Ejecuta pantalla anterior
	fue?eval(fue):location.reload();
}

// Detectar Inicio mediante liga (url?srch#hash) y plasmarlo
// EN DESARROLLO!! FALTA PRIMERO QUE loadCnt() ajuste la URL en cada paso
function detURLroute(){
	if(location.hash.indexOf('-')!="-1"){
		var urlPath=location.pathname;
		var urlSrch=location.search;
		var urlHash=location.hash;
		var hshPrcs=location.hash.substring(1,location.hash.indexOf('-'));
		var hshVar=location.hash.substring(location.hash.indexOf('-'));
		if(tst_loads) console.log("?srch#hash de Arranque:",hshPrcs,"-",hshVar);
/*/
		loadCnt(hshPrcs,hshVar);
/*/
		switch(hshPrcs){
			case "FichaTecnica":
				FichaTecnica('inmbls/'+hshVar);
				return true;
				break;
			case "tc":
				return true;
				break;
			default:
				return false;
				break;
		}
/**/
	} else return false;
}

//Proceso de EJEMPLO (Búsqueda de QLFY)
function busca(clrFltrs){
	var user = firebase.auth().currentUser;
	// Si es uasuario registrado y no hay filtros - Mandar a Filtros / Preferencias
	if(!user.isAnonymous && !Object.keys(fltrs).length){
		//alert("Debe especificar sus preferencias primero");
		if(1)console.log("Debe especificar sus preferencias primero");
		Filtros();
	} else
	if(!zn){
		alert("Debe especificar una Zona de Búsqueda...");
		location.reload();
	} else {
		var x=(tam=="a")?"u":tam;
		if(authLoad("Buscar",x,1)){
			DTXPromLoadIntoHTML("busquedas.html","","content").then(function(success){
				if(tst_loads)console.log("0. "+success);
				progBar.MaterialProgress.setProgress(25);
				progBar.MaterialProgress.setBuffer(50);
				DTXPromLoadAsyncJS("assets/js/busquedas.js").then(function(success){
					progBar.MaterialProgress.setProgress(50);
					progBar.MaterialProgress.setBuffer(75);
					busquedas();
				},function(error){console.error("DTXPromLoadAsyncJS Failed! "+error)})
			}, function(error){console.error("DTXPromLoadIntoHTML Failed! "+error)});
		}
	}
}

// Inserta un mensaje Rojo y grande abajo justo arriba del Footer,
// Se debe procesar justo antes del final de la carga de la Vista
// Para mensajes de aviso momentáneso use mejor snackBar()
function insFootMSG(x){
	document.querySelector("#nuhu-prods").innerHTML+='<div style="color: red; text-align: center; width: 100%; margin: 30px; font-size: 20px;">'+x+'</div>';
	//if(tst_logs)console.log("3. b_ixc");
	//progBar.MaterialProgress.setProgress(90);
	//b_ccf();
}

// ####################  MDL Specific  #######################

// Revisa cuales campos .mdl-js-textfield tienen contenido y los ajusta
// Ej de uso: chkDrty('#edit_prod .mdl-js-textfield');
// fuente: https://github.com/google/material-design-lite/issues/903#issuecomment-223089191
function chkDrtyVld(obj){
  var divsWithInputs = document.querySelectorAll(obj);
  for (var i = 0, l = divsWithInputs.length; i < l; i++) {
		divsWithInputs[i].MaterialTextfield.checkDirty();
		divsWithInputs[i].MaterialTextfield.checkValidity();
  }
}

// Lanzar mensaje en SnackBar (inferior central)
function snackBar(text,cmd,handler){
	//var handler=(typeof(handler)==='undefined')?
	document.querySelector("#snackBar").MaterialSnackbar.showSnackbar({
		message: text,
    timeout: 2000,
    actionHandler: handler,
    actionText: cmd
	});
}

addLoadEvent(initVs);
