/**
	* Proyect:NUHU
	* File: C/A_prods.js
	* Version : 0.81
	* author: Quidware.com
	* descr: Controlador para Administración de Productos
	*
 */

 // Globales de Elementos muy útiles para la Administración de Productos
var consec=0;
var categ=-1;
var editRoute=-1;
var editProd=-1;


function A_prods(cat){
  categ= cat;
  chiHqO(prodsCats[cat],"#A_prods-categoria");

  // Cargar Modales de Administrar Productos
	DTXPromLoadIntoHTML("V/B/modals_"+"A_prods"+".html","","modalesV").then(function(){
		// Ocultar los Modales (tipo target) al presionar su sombra
		clsModalShdw("#edit_prod");
		clsModalShdw("#add_prod");

    btnProdNuevo();
    chiHqO(prodsCats[cat],"#add_prod_tit");

    // Cargar Elemento de cards para productos
    DTXPromLoadAsyncJS("V/E/prod-card.js").then(function(success){
      // Jalar de BD los productos de ésta Categoría
      obtProdsCat(cat).then(function(){
        // Lo que hay que hacer después de insertar todas las Cards

        SyncElmntChanges("#nuhu-prods input[type=checkbox].EXS","prods/"+cat);

        // Terminar la carga
        endLoad();
      }, function(err){console.error(err)});;
    }, function(error){console.error("JS Load Failed! ",error)});
  }, function(error){console.error("Modals Load Failed! "+error)});
}

// Obtener productos de cierta [cat]egoría  //
function obtProdsCat(cat){
	return new Promise(function(fulfill,reject){
    /*/ // Perspectiva del cliente
    firebase.database().ref('prods/'+cat).orderByChild("exs").equalTo(true).once('value',function (prods){
    /*/ // Perspectiva del Administrador
    firebase.database().ref('prods/'+cat).once('value',function (prods){
    /**/
			if(prods.exists()){
				if(1 && tst_can)console.log("CAT-"+cat+":",prods.val());
				procProd(prods.val(),"#nuhu-prods").then(fulfill);
			}
/**/
			else{
				insFootMSG("No hay productos en la Categoría de "+prodsCats[cat]);
				reject("No hay productos en la Categoría de ",cat);
			}
/**/
		});
	});
}

// Procesador de Prouctos: recibe Objeto con info de todos los (prods)
function procProd(prods,y){
	if(0 && tst_can)console.log("procesa Prouctos:",prods);

	// Por c/producto genera la card y el marcador
	function prodImplement(prod){
		//if(0 || prods[prod].exs==1){
      // Conteo Global de Resultados
  		consec++;
  		var card= new Object();
  		card.class=" mdl-cell mdl-cell--3-col mdl-cell--2-col-tablet mdl-cell--2-col-phone mdl-shadow--2dp mdl-color--white ";
  		//	card.class=" FULL-crd mdl-cell mdl-cell--12-col";
  		//	card.class=" TMP-crd mdl-cell mdl-cell--12-col";
  		card.consec=consec;
  		card.id=prod;
  		card.route='prods/'+categ+'/';
      /**/ // Perspectiva del Administrador
      card.admin=1;
      /**/

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

// Abrir modal con forma para Editar cierto producto
function edit_prod(route,prod){
  clearForm("#edit_prod_form");
  //Old_UpdateElmntStates("#edit_prod input",route+prod);

  /**/
  DTXPromUpdateElmntStates("#edit_prod input",route+prod).then(function(){
    //CaptureElmntChanges("#edit_prod input",route+prod);
    editRoute=route;
    editProd=prod;
    chiHqO("Editando: "+prod,"#edit_prod_tit");
    document.querySelector("#edit_prod_img").src=document.querySelector("input#img").value;
    //document.querySelector("#edit_prod_save_btn").addEventListener('click', save_prod); // Se cambia por acción de la forma
    location.href="#edit_prod";
    chkDrtyVld('#edit_prod .mdl-js-textfield');
    //componentHandler.upgradeDom();
    if(tst_logs)console.log("Edit Prod:",route+prod);
  }).catch(function(error){console.error(error.message);});
  /*/ // Se necesitaría que SyncElmntChanges haga promesa, que las conexiones prendidas de los Modales se registren por separado de las de la vista (prendsV / PrendsM) para apagarlas al cargar nuevamente el modal igual que al cambiar de vista y además se necesita validar los datos antes de guardarlos por lo que no es práctico éste enfoque.
  SyncElmntChanges("#edit_prod input",route+prod);
  chiHqO("Editando: "+prod,"#edit_prod_tit");
  document.querySelector("#edit_prod_img").src=document.querySelector("input#img").value;
  location.href="#edit_prod";
  chkDrty('#edit_prod .mdl-js-textfield');
  if(tst_logs)console.log("#edit_prod:",route+prod);
  /**/
}

// Guardar datos de la forma de cierto producto y cerrar modal
function save_prod(){
  //document.querySelector("#edit_prod_save_btn").removeEventListener('click', save_prod); // Se cambia por acción de la forma
  firebase.database().ref(editRoute+editProd).update({
    "prc":Number(document.querySelector("#edit_prod_form #prc").value)
    ,"cst":Number(document.querySelector("#edit_prod_form #cst").value)
    ,"Clb":document.querySelector("#edit_prod_form #Clb").value
    ,"Prv":document.querySelector("#edit_prod_form #Prv").value
    ,"cls":document.querySelector("#edit_prod_form #cls").value
    ,"tsd":document.querySelector("#edit_prod_form #tsd").value
    ,"und":Number(document.querySelector("#edit_prod_form #und").value)
    ,"cxp":(document.querySelector("#edit_prod_form #cxp").checked)?true:null
    ,"dsc":document.querySelector("#edit_prod_form #dsc").value
    ,"img":document.querySelector("#edit_prod_form #img").value
  }).then(function(){
    if(tst_logs)console.log("Saved Prod:",editRoute+editProd);
    snackBar('Cambios Guardados a '+editProd);
    location.href="#";
    //clearForm("#edit_prod_form");
  }).catch(function(error){
    console.error(error.message);
    snackBar('NO SE GUARDO '+editProd);
  });
}

function btnProdNuevo(){
  chiHqO('<a href="#add_prod" OLDhref="javascript:void(0)" OLDonclick="location.href='+"'#add_prod'"+'" class="mdl-button mdl-js-button mdl-button--fab mdl-js-ripple-effect mdl-button--colored mdl-color-text--white" data-upgraded=",MaterialButton,MaterialRipple" style="line-height: 56px;"><i class="material-icons">add</i><span class="mdl-button__ripple-container"><span class="mdl-ripple is-animating" style="width: 160.392px; height: 160.392px; transform: translate(-50%, -50%) translate(29px, 40px);"></span></span></a>',"#botInfDer");
}

//A_prods();
