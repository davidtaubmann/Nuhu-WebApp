/**
	* Proyect:NUHU
	* File: C/prods.js
	* Version : 0.81
	* author: Quidware.com
	* descr: Controlador para Vista de Productos
	*
 */

// Globales de Elementos muy útiles para la Administración de Productos
var consec=0;
var categ=-1;
var lstChngEvntTmStmp=-1;

function prods(cat){
  categ= cat;
  //var titBar='<i class="material-icons" role="presentation">store </i> '+prodsCats[cat]+'<button id="catbtn" class="mdl-button mdl-js-button mdl-js-ripple-effect mdl-button--icon" data-upgraded=",MaterialButton,MaterialRipple"> <i class="material-icons" role="presentation">arrow_drop_down</i> <span class="mdl-button__ripple-container"><span class="mdl-ripple is-animating" style="width: 92.5097px; height: 92.5097px; transform: translate(-50%, -50%) translate(16px, 19px);"></span></span></button>';
  var titBar='<i class="material-icons" role="presentation">store</i> <button id="catbtn" class="mdl-button mdl-button--icon mdl-js-button mdl-js-ripple-effect" data-upgraded=",MaterialButton,MaterialRipple"><i class="material-icons" role="presentation">arrow_drop_down</i></button> <h2 id="prods-categoria">'+prodsCats[cat]+'</h2>';
  titBar += prodsMenu("","catbtn",1);
  chiHqO(titBar,"#titBar");

  //Botones de abajo
  var prodCatKeys=Object.keys(prodsCats);
  if(prodCatKeys.indexOf(cat)==0)desaparece('#catRetro');
  else document.querySelector('#catRetro').addEventListener('click', function (e) {
    loadCnt('prods',prodCatKeys[prodCatKeys.indexOf(cat)-1]);
  });
  if(prodCatKeys.indexOf(cat)==prodCatKeys.length-1)desaparece('#catProgr');
  else document.querySelector('#catProgr').addEventListener('click', function (e) {
    loadCnt('prods',prodCatKeys[prodCatKeys.indexOf(cat)+1]);
  });

  DTXPromLoadAsyncJS("V/E/prod-card.js").then(function(success){
    obtProdsCat(cat).then(function(){
      // Lo que hay que hacer después de insertar todas las Cards

      // Sincronizar los botones de eliminar con las existencias en la canasta
      SyncElmntChanges("#nuhu-prods .NMR","cnst/"+firebase.auth().currentUser.uid+"/"+cat);

      endLoad();
    },function(err){console.error(err)});;
  }, function(error){console.error("JS Load Failed! ",error)});
}

// Obtener productos de cierta [cat]egoría  //
function obtProdsCat(cat){
	return new Promise(function(fulfill,reject){
    firebase.database().ref('prods/'+cat).orderByChild("exs").equalTo(true).once('value',function (prods){
			if(prods.exists()){
				if(1 && tst_can)console.log("CAT-"+cat+":",prods.val());
				procProd(prods.val(),"#nuhu-prods").then(fulfill);
			}
/**/
			else{
				prcErrMs("No hay productos en la Categoría de "+prodsCats[cat]);
				reject("No hay productos en la Categoría de ",cat);
			}
/**/
		});
	});
}

// Procesador de Prouctos: recibe Objeto con información (prods)
function procProd(prods,y){
	if(0 && tst_can)console.log("procesa Prouctos:",prods);
	//var clipboard=new Array();

	// Por c/producto genera la card y el marcador
	function prodImplement(prod){
		// PEND-->SEC--> Éste renglón se debe eliminar una vez que las reglas de seguridad funcionen para excluir lo que no esté público
		//if(0 || prods[prod].exs==1){
      // Conteo Global de Resultados
			consec++;
			var card= new Object();
			card.class=" mdl-cell mdl-cell--3-col mdl-cell--2-col-tablet mdl-cell--2-col-phone mdl-shadow--2dp mdl-color--white ";
			//	card.class=" FULL-crd mdl-cell mdl-cell--12-col";
			//	card.class=" TMP-crd mdl-cell mdl-cell--12-col";
			card.consec=consec;
			card.id=prod;
			card.route='prods/';

      // Insertar Card
      if(0 && tst_logs)console.log("Prod: "+card.id+", root: "+card.route);
      cardBase(card,prods[prod]).then(function(newCard){
        return document.querySelector(y).innerHTML=document.querySelector(y).innerHTML+newCard;
      },function(err){console.error(err)}).then(function(){
        // Lo que hay que hacer después de insertar cada Card

      },function(err){console.error(err)});

      return consec;
		//}	//if
	}
	return asyncPromObjIter(Object.keys(prods),prodImplement);
}

function canChng(cat,id,x,mnt){
  if(mnt>0){
    cssDisplay('inline-block','#CanRem-'+x);
    if(event.type=="change" && (lstChngEvntTmStmp != event.timeStamp)){
      snackBar(mnt+' '+id+' AGREGADO a canasta.');  //,"ELIMINAR",function(){canRemProd(cat,id);});
    }
    lstChngEvntTmStmp=event.timeStamp;
    /*/
    console.log("canChng event:",event);
    //
    console.log("canChng event:",JSON.stringify(event, function(k, v) {
      if (v instanceof Node) {return 'Node';}
      if (v instanceof Window) {return 'Window';}
      return v;
    }, ' '));
    /**/
  } else {
    desaparece('#CanRem-'+x);
    if(event.type=="click")snackBar(mnt+' '+id+' ELIMINADO de canasta.');  //,"CANCELAR",function(){CarAddProd(cat,id,mnt);});
  }
}

function canRemProd(cat,id,x){
  var elimina={};
  elimina[id]=null;
  var eliminado= document.querySelector('select[id="CanNmr-'+x+'"]').options[document.querySelector('select[id="CanNmr-'+x+'"]').selectedIndex].value;
  firebase.database().ref("cnst/"+firebase.auth().currentUser.uid+"/"+cat).update(elimina).then(function(){
    // Viene vacío porque el canChng se encarga de desaparecer el botón y dar aviso
    //snackBar(eliminado+' '+id+' ELIMINADO de canasta.',"CANCELAR",function(){CarAddProd(cat,id,eliminado);});
    //desaparece("#CanRem-"+x)
  }).catch(function(error){
    console.error(error.message);
    snackBar('NO SE ELIMINÓ '+id);
  });
}

// Aviso de Error en búsqueda al ususario, procesa el fin de la carga de la pantalla/proceso
function prcErrMs(x){
	document.querySelector("#nuhu-prods").innerHTML+='<div style="color: red; text-align: center; width: 100%; margin: 30px; font-size: 20px;">'+x+'</div>';
}

//prods();
