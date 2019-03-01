/**
	* Proyect:NUHU
	* File: C/cnst.js
	* Version : 0.7
	* author: Quidware.com
	* descr: Controlador para Vista de Canasta
	*
 */

// Globales de Elementos muy útiles para la Canasta
var consec=0;

// Función BASE
function cnst(){

  firebase.database().ref("cnst/"+firebase.auth().currentUser.uid+"/").on('value',function(cnstr){
    // Captura la Conexion prendida (para eliminarla en rstEstilos)
		prends[prends.length]="cnst/"+firebase.auth().currentUser.uid+"/";

    if(cnstr.exists()){
      var chcklst="";

      for(var cat in cnstr.val()){
        for(var prod in cnstr.val()[cat]){
          consec++;
          console.log(prod);

          chcklst+="<div class=\"mdl-cell mdl-cell--1-col\"><label class=\"mdl-checkbox mdl-js-checkbox mdl-js-ripple-effect\" for=\"cnstChck-"+consec+"\"><input type=\"checkbox\" id=\"cnstChck-"+consec+"\" class=\"mdl-checkbox__input\">"+cnstr.val()[cat][prod]+"</label></div>";
          chcklst+="<div class=\"mdl-cell mdl-cell--5-col mdl-cell--5-col-tablet mdl-cell--1-col-phone\">"+prod+"</div>";
          chcklst+="<div class=\"mdl-cell mdl-cell--3-col mdl-cell--hide-tablet mdl-cell--hide-phone \"><a href=\"javascript:loadCnt('prods','"+cat+"');void(0);\">"+prodsCats[cat]+"</a></div>";
          chcklst+="<div class=\"mdl-cell mdl-cell--2-col-desktop mdl-cell--1-col\" style=\"text-align: center;\"><a href=\"javascript:void(0); if(confirm('Desea eliminar "+prod+"'))alert('Proceso en DESARROLLO');\"><i class=\"material-icons\">remove_shopping_cart</i></a> <span class=\"mdl-cell mdl-cell--1-col mdl-cell--hide-phone mdl-cell--hide-tablet\"> $ "+0+".ºº</span></div>";
          chcklst+="<div class=\"mdl-cell mdl-cell--1-col monto\">$ "+0+".ºº</div>";
        }
      }
      chiHqO(chcklst,"#nuhu-canChckLst");
      componentHandler.upgradeDom();
    }	else{
			prcErrMs("No hay productos en la Canasta");
			reject("No hay productos en la Canasta");
		}

  },function(error){console.error(error.message);});

  // Terminar la carga
  endLoad();
}
