// JavaScript Document
'use strict';

/**
	* Proyect:NUHU
	* File: C/C.js
	* Version : 0.81
	* author: Quidware.com
	* descr: Controlador Global
	*
	* TODO's
  * ######################
  * SyncElmntChanges(): Convertirlo en promesahaga promesa, que las conexiones prendidas de los Modales se registren por separado de las de la vista (prendsV / PrendsM), para apagarlas independientemente al cargar nuevamente el modal igual que al cambiar de vista
	*
*/

// Globales para Desarrollo, Mostrar Apoyos (Apagarlos en ambiente de producción)
var tst_loads=1; // 1=si, 0=no // Registrar en Consola la carga de contenidos
var tst_logs=1; // 1=si, 0=no // Registrar en Consola las funciones de sesión
var tst_can=1; // 1=si, 0=no // Registrar en Consola los movmimientos de canasta
var tst_css=1; // 1=si, 0=no	// Cargar CSS's de apoyo visual
var tst_cache=1; // 1=si, 0=no	// Cargar Asincrona de Archivos evitando cache por fuerza (con variable get)

// Formato de millares para Números
// c=Decimals, d=Decimal Separator, t=Thousand Separator
// initSource: http://stackoverflow.com/a/149099/1920145
Number.prototype.formatMoney = function(c, d, t){
	var n = this,
	//c = isNaN(c = Math.abs(c)) ? 2 : c,
	c = isNaN(c) ? 2 : c,
	d = d == undefined ? "." : d,
	t = t == undefined ? "," : t,
	s = n < 0 ? "-" : "",
	i = c > 0 ? String(parseInt(n = Math.abs(Number(n) || 0).toFixed(c))):String(parseInt(n = Math.abs(Number(n) || 0).toFixed(0))),
	j = (j = i.length) > 3 ? j % 3 : 0;
	return s + (j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (!c? "" : c < 0 ? ".ºº" : d + Math.abs(n - i).toFixed(c).slice(2));
};

// Asignar varios onLoad
function addLoadEvent(func) {
	if(0)console.log("addLoadEvent");
	var oldonload = window.onload;
	if (typeof window.onload != 'function') {
		window.onload = func;
	} else {
		window.onload = function() {
			if (oldonload) {
				oldonload();
			}
			func();
		}
	}
}

addLoadEvent(function(){if(tst_logs)console.log('DOM Loaded')});

// ShowHide v1.1
// Acepta infinidad de objetos a Ocultar / Mostrar con CSS display
function desaparece(objetos) {
	var i=0;
	while (i<arguments.length){
		document.querySelector(arguments[i]).style.display='none';
		i++;
	}
}

// Asignar el estilo DISPLAY con valor "x" a la serie de "objetos" indicados
function cssDisplay(x,objetos) {
	var i=1;
	while (i<arguments.length){
		document.querySelector(arguments[i]).style.display=x;
		i++;
	}
}

// Cambiar por un mismo contenido "c" el innerHTML de la serie de objetos indicados
function chiHqO(c,objetos){
	var i=1;
	while (i<arguments.length){
		document.querySelector(arguments[i]).innerHTML=c;
		i++;
	}
}

// Agregar Clase (1er argumento) de estilo CSS de una serie de Objetos argumentados
function addCssO(c,objetos){
	var i=1;
	while (i<arguments.length){
		document.querySelector(arguments[i]).classList.add(c);
		i++;
	}
}

// Quitar Clase (1er argumento) de estilo CSS de una serie de Objetos argumentados
function remCssO(c,objetos){
	var i=1;
	while (i<arguments.length){
		document.querySelector(arguments[i]).classList.remove(c);
		i++;
	}
}

// Intercambiarle una clase al elemento del evento
function triggererClassToggle(x){
	var	e = e || window.event;
	var source = e.target || e.srcElement;
	if(tst_css)console.log("ClassToggle: "+source);
	source.classList.toggle(x);
//	if(source.classList.contains(x)){
//		source.classList.remove(x);
//	} else source.classList.add(x);
}

// Limpiar Forma
function clearForm(Forma){
	var Form=document.querySelector(Forma);
	for (var i in Form.elements) {
		if (Form.elements[i].type == "text" || Form.elements[i].type == "textarea") {
			Form.elements[i].value = "";
		} else if(Form.elements[i].type == "select"){
			Form.elements[i].selectedIndex='0';
		} else if(Form.elements[i].type == ("checkbox"||"radio")){
			Form.elements[i].checked=false;
		}
	}
}

// Limpiar elementos tipo forma que no están en una forma
function limpiaSelectInput(idobjeto) {
	i=0;
	while (i<arguments.length){
		if(arguments[i].length){
			//alert(document.getElementById(arguments[i]).tagName)
			if(document.getElementById(arguments[i]).tagName="SELECT")document.getElementById(arguments[i]).selectedIndex='0';
			if(document.getElementById(arguments[i]).tagName="INPUT")document.getElementById(arguments[i]).value='';
		}
		i++;
	}
}

// Cerrar Modales (tipo target) presionando en la sombra exterior
// Los contenedores de los modales deben tener un div
function clsModalShdw(x){
	// Escucha clicks a la sombra
	document.querySelector(x).addEventListener('click', function (e) {
		e = e || window.event;
    var target = e.target || e.srcElement
		if(!document.querySelector(x+' div').contains(target))
			location.href="#";
	}, false);
}

// Standard Promisifyed XHR
//http://www.html5rocks.com/en/tutorials/es6/promises/#toc-promisifying-xmlhttprequest
function H5RPromLoad(url) {
  // Return a new promise.
  return new Promise(function(resolve, reject) {
    // Do the usual XHR stuff
    var req = new XMLHttpRequest();

		// Para desarrollo
		if(tst_cache){	//0 &&
			var avoidCache = new Date();
			avoidCache = avoidCache.toISOString();
			//url = url+'?'+avoidCache;
			url = (url.indexOf('?')>0)?url+'&'+avoidCache:url+'?'+avoidCache;
			if(tst_logs)console.log("H5R "+url);
		}

    req.open('GET', url);

    req.onload = function() {
      // This is called even on 404 etc
      // so check the status
      if (req.status == 200) {
        // Resolve the promise with the response text
        resolve(req.response);
      }
      else {
        // Otherwise reject with the status text
        // which will hopefully be a meaningful error
        reject(Error(req.statusText));
      }
    };

    // Handle network errors
    req.onerror = function() {
      reject(Error("Network Error"));
    };

    // Make the request
    req.send();
  });
}

// Inserta un archivo (url) dentro de un elemento (into):
//http://www.w3schools.com/ajax/default.asp
function DTXoldLoadIntoHTML(url,post,into,goodend,badend,agrega,cuenta,test){
	if(!agrega && test)document.getElementById(into).innerHTML='...';
	var xmlhttp;
	var ret=-1;
	if (window.XMLHttpRequest){// code for IE7+, Firefox, Chrome, Opera, Safari
		xmlhttp=new XMLHttpRequest();
	}
	else{// code for IE6, IE5
		xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
	}
	xmlhttp.onreadystatechange=function(){
		if (xmlhttp.readyState==0 && (cuenta || test)){ document.getElementById(into).innerHTML+="4,";	}
		if (xmlhttp.readyState==1 && (cuenta || test)){ document.getElementById(into).innerHTML+="3,";	}
		if (xmlhttp.readyState==2 && (cuenta || test)){ document.getElementById(into).innerHTML+="2,";	}
		if (xmlhttp.readyState==3 && (cuenta || test)){ document.getElementById(into).innerHTML+="1,";	}
		if (xmlhttp.readyState==4){
			if(cuenta || test)document.getElementById(into).innerHTML+="0...<br>";
			if(test)document.getElementById(into).innerHTML+= "URL:"+url+"<br />POST:"+post+"<br />Status:"+xmlhttp.status+"-"+xmlhttp.statusText+"<br />";
			// SUCCESS
			if(xmlhttp.status==200){
				if(agrega)document.getElementById(into).innerHTML+=xmlhttp.responseText;
				else {	// Borra lo habido
					document.getElementById(into).innerHTML='';
					document.getElementById(into).innerHTML+=xmlhttp.responseText;
				}
				if(tst_logs)console.log("Se cargó "+url+" en "+into);
				if(!(goodend === undefined)){
					goodend();
					if(tst_logs)console.log("Ejecutó: "+goodend);
				} //else if(tst_logs)console.log("No se ejecutó: "+goodend);
				ret=true;
				//document.write(xmlhttp.responseText);
				//if(xmlhttp.responseText.substr(0,1)==1){
				//	if(goodend) goodend();
				//	return true;
				//}
				//if(!(xmlhttp.responseText.substr(0,1)==1)){
				//	if(badend) badend();
				//	return false;
				//}
			} else if (xmlhttp.status==404){
				if(test)document.getElementById(into).innerHTML+="404, El archivo no existe!";
				else alert("El archivo "+url+" no existe!");
				//document.write(xmlhttp.responseText);
				if(badend) badend();
				ret=false;
			} else if (xmlhttp.status==0){
				if(test)document.getElementById(into).innerHTML+="0, Al parecer NO esta conectado!";
				else alert("Al parecer NO esta conectado!");
				//document.write(xmlhttp.responseText);
				if(badend) badend();
				ret=false;
			}
		}
	}
	xmlhttp.open("POST",url,true);
	xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
	xmlhttp.send(post);

	return ret;
}

// Mix DTXLoadIntoHTML con Promesas
function DTXPromLoadIntoHTML(url,post,into,agrega) {
  // Return a new promise.
  return new Promise(function(resolve, reject) {
    // Do the usual XHR stuff
    var req = new XMLHttpRequest();

		// Para desarrollo
		if(tst_cache){	//0 &&
			var avoidCache = new Date();
			avoidCache = avoidCache.toISOString();
			url = url+'?'+avoidCache;
			if(tst_logs)console.log("DTX-HTML "+url+" into "+into);
		}

    //req.open('GET', url);
		req.open("POST",url,true);
		req.setRequestHeader("Content-type","application/x-www-form-urlencoded");

    req.onload = function() {
      // This is called even on 404 etc
      // so check the status
      if (req.status == 200) {
				// Insert the result to the ID=into object
				if(document.getElementById(into)){
					if(agrega){
					// Agregar el resultado
						document.getElementById(into).innerHTML+=req.responseText;
					}
					else {
					// o Borra lo existente primero
						document.getElementById(into).innerHTML='';
						document.getElementById(into).innerHTML+=req.responseText;
					}
				} else console.error(url+" INTO "+into,": not exist");
				resolve(url+" INTO "+into);
			}
      else {
				document.getElementById(into).innerHTML=req.status+" - "+req.statusText+": "+url;
				// Otherwise reject with the status text
				// which will hopefully be a meaningful error
        reject(Error(url+" INTO "+into+": "+req.status+" - "+req.statusText));
      }
    };

    // Handle network errors
    req.onerror = function() {
      reject(Error("Network Error"));
    };

    // Make the request
		req.send(post);
  });
}

// Cargar un elemento JS de forma asíncrona
// Alternativa de https://www.turnkeylinux.org/blog/async-javascript
function DTXoldLoadAsyncJS(url){
	var s = document.createElement('script');
	s.type = 'text/javascript';
	s.async = true;
	// Para desarrollo
	if(tst_cache){
		var avoidCache = new Date();
		avoidCache = avoidCache.toISOString();
		if(tst_logs)console.log("DTX-JS: "+url);
		s.src = url+'?'+avoidCache;
	}
	// Para producción
	else 	{s.src = url;}
	var x = document.getElementsByTagName('script')[0];
	x.parentNode.insertBefore(s, x);
	//ComponentHandler.upgradeDom();
}

// Cargar un elemento JS de forma asíncrona con Promesas
// http://txopi.com/mylab/js/AsyncLoadJSprom.html
function DTXPromLoadAsyncJS(url,id){
	id=id?id:url;
  // Return a new promise.
  return new Promise(function(resolve, reject) {
		var s = document.createElement('script');
		s.type = 'text/javascript';
		s.async = true;
		s.id = id;

		H5RPromLoad(url).then(function(good){
			s.text=good;
			var head=document.getElementsByTagName("head")[0]
			// Avoid double scripts by replaceChild
			if(document.getElementById(id)){
				head.replaceChild(s,document.getElementById(id))
			}
			else head.appendChild(s);
			resolve(url+" LOADED in head as "+id);
		},function(bad){reject(url+": "+bad)});
	});
}

// Cargar una hoja de estilos CSS de forma asíncrona
// Alternativa de https://github.com/filamentgroup/loadCSS/blob/master/src/loadCSS.js
function DTXoldLoadAsyncCSS(url){
	var l = document.createElement('link');
	l.rel = 'stylesheet';
	l.type = 'text/css';
	// Para desarrollo
	if(tst_cache){
		var avoidCache = new Date();
		avoidCache = avoidCache.toISOString();
		if(tst_logs)console.log("DTX-CSS: "+url);
		l.href = url+'?'+avoidCache;
	}
	// Para producción
	else 	{l.href = url;}
	var x = document.getElementsByTagName('link')[0];
	x.parentNode.insertBefore(l, x);
}

// Cargar una hoja de estilos CSS de forma asíncrona con Promesas
// REALMENTE NO SE DEBERÍA OCUPAR, complica ubicar los renglones en DevConsole
// Es mejor inlcuirlo directo en HTML (<link rel="stylesheet" href="..">)
// http://txopi.com/mylab/js/AsyncLoadCSSprom.html
function DTXPromLoadAsyncCSS(url,id){
	id=id?id:url;
  // Return a new promise.
  return new Promise(function(resolve, reject) {
		var c = document.createElement('style');
		c.id = id;

		H5RPromLoad(url).then(function(good){
			c.innerHTML=good;
			var head=document.getElementsByTagName("head")[0]
			// Avoid double styles by replaceChild
			if(document.getElementById(id)){
				head.replaceChild(c,document.getElementById(id))
			}
			else head.appendChild(c);
			resolve(url+" LOADED in head as "+id);
		},function(bad){reject(url+": "+bad)});
	});
}

// Mostrar en consola cuando cierto tipo de elemento para formas tiene un cambio
// Excepto los elementos que traen la clase "not-sync" o no tienen atributo name
function LogInputChanges(type){
	// Mostrar las variables para pruebas
	var inputs=document.querySelectorAll("#content input[type="+type+"]:not(.not-sync)");
	if(inputs.length)for(var i = 0; i < inputs.length; i++)if(inputs[i].name){
		inputs[i].onchange=function(){
			if(type=="checkbox")console.log(this.name+"="+this.checked);
			else console.log(this.name+"="+this.value);
		}
	};
	if(tst_logs)console.log("LogInputChanges "+type+":"+inputs.length);
}

// Actualiza una vez el Estado de ciertos elementos seleccionados por query
// Excepto los elementos que traen la clase "not-sync" o no tienen atributo name
// Todos los elementos a obtener requieren name y un valor en la BD
function Old_UpdateElmntStates(CSSquery,FBroute,prfx){
	if (typeof(prfx)==='undefined') prfx = "";
	// Obtener Vars Usuario
	firebase.database().ref(FBroute).once('value').then(function (rslt){
		// Seleccionar todos los inputs del tipo especificado
		//var inputs=document.querySelectorAll("#content input[type="+type+"]:not(.not-sync)");
		var els=document.querySelectorAll(CSSquery+":not(.not-sync)");
		// A cada uno
		for(var i = 0; i < els.length; i++)if(els[i].name){
			// Si el tipo de elemento es checkbox y el valor existe
			if(els[i].type=="checkbox"){ if(rslt.val()[prfx+els[i].name]){
				// Activarlo si corresponde.
				els[i].checked=rslt.val()[prfx+els[i].name];
				if(tst_logs)console.log("UES CHCKBX "+els[i].name+"="+rslt.val()[prfx+els[i].name]);
			// Si el tipo de elemento es radio y el valor es igual al actual
			}}
			else if(els[i].type=="radio"){ if(els[i].value == rslt.val()[prfx+els[i].name]){
				// Activarlo.
				els[i].checked=true;
				if(tst_logs)console.log("UES RADIO "+els[i].value+" = true");
			// En cambio, si existe valor almacenado para éste elemento
			}} else if(rslt.val()[prfx+els[i].name]){
				// Actualizar su valor.
				els[i].value = rslt.val()[prfx+els[i].name];
				if(tst_logs)console.log("UES "+els[i].type+" "+prfx+els[i].name+" = "+rslt.val()[prfx+els[i].name]);
			}
		}
	}).catch(function(error){console.error(error.message);});
}

// IGUAL QUE LA ANTERIOR PERO CON PROMESA
// Actualiza una vez el Estado de ciertos elementos seleccionados por query
// Excepto los elementos que traen la clase "not-sync" o no tienen atributo name
// Todos los elementos a obtener requieren name y un valor en la BD
function DTXPromUpdateElmntStates(CSSquery,FBroute,prfx){
	if (typeof(prfx)==='undefined') prfx = "";
	// Obtener Vars Usuario
	return new Promise(function(resolve, reject) {
		firebase.database().ref(FBroute).once('value').then(function (rslt){
			// Seleccionar todos los inputs del tipo especificado
			//var inputs=document.querySelectorAll("#content input[type="+type+"]:not(.not-sync)");
			var els=document.querySelectorAll(CSSquery+":not(.not-sync)");
			// A cada uno
			for(var i = 0; i < els.length; i++)if(els[i].name){
				// Si el tipo de elemento es checkbox y el valor existe
				if(els[i].type=="checkbox"){ if(rslt.val()[prfx+els[i].name]){
					// Activarlo si corresponde.
					els[i].checked=rslt.val()[prfx+els[i].name];
					if(tst_logs)console.log("UES CHCKBX "+els[i].name+"="+rslt.val()[prfx+els[i].name]);
				// Si el tipo de elemento es radio y el valor es igual al actual
				}}
				else if(els[i].type=="radio"){ if(els[i].value == rslt.val()[prfx+els[i].name]){
					// Activarlo.
					els[i].checked=true;
					if(tst_logs)console.log("UES RADIO "+els[i].value+" = true");
				// En cambio, si existe valor almacenado para éste elemento
				}} else if(rslt.val()[prfx+els[i].name]){
					// Actualizar su valor.
					els[i].value = rslt.val()[prfx+els[i].name];
					if(tst_logs)console.log("UES "+els[i].type+" "+prfx+els[i].name+" = "+rslt.val()[prfx+els[i].name]);
				}
				//prends[prends.length]=FBroute+"/"+prfx+els[i].name;
			}
			resolve(FBroute+" UPDATED in "+CSSquery);
		},function(bad){reject("DTXPromUpdateElmntStates FAILED: "+bad)});
	});
}

// Capturar a la BD los cambios de ciertos elementos cada vez que cambian
// Excepto los elementos que traen la clase "not-sync" o no tienen atributo name
// Todos los elementos a guardar ocupan name y value, Checkbox no requiere value
function CaptureElmntChanges(CSSquery,FBroute,prfx){
	if (typeof(prfx)==='undefined') prfx = "";
	// Seleccionar todos los inputs del tipo especificado
	//var inputs=document.querySelectorAll("#content input[type="+type+"]:not(.not-sync)");
	var els=document.querySelectorAll(CSSquery+":not(.not-sync)");
	if(0 && tst_logs)console.log("CEC: ",els);
	// A cada uno
	for(var i = 0; i < els.length; i++)if(els[i].name){
		if(tst_logs)console.log("CEC ("+(i+1)+" of "+els.length+"): "+els[i].name);
		// Sube el Dato al cambio
		els[i].onchange=function(){
			var newVal=(this.type=="checkbox")?(this.checked)?true:null:(this.value)?this.value:null;
			firebase.database().ref(FBroute+"/"+prfx+this.name).transaction(function(current){
				if(tst_logs)console.log("CEC "+this.name+" -> "+newVal);
				return newVal;
			}).catch(function(error){console.error(error.message);});
		}
	}
}

// Sincroniza cambios de elementos con la BD (Substituye los dos de arriba [UpdateElmntStates y CaptureElmntChanges] en una sola mejorada)
// Excepto los elementos que traen la clase "not-sync" o no tienen atributo name
// Todos los elementos ocupan name y value excepto Checkbox que no requiere value
// Los range pueden mostrar el valor almacenado en un label dedicado(for) a su propio name
// Los file de múltiples archivos muestran elementos (cntnr[0-3]) insertados en un label dedicado(for) a su propio name y las piezas del container rodean 3 datos (URL, ruta, # de subida)
// Los file NO múltiples muestran un elemento (cntnr[0-3]) insertados en un label dedicado(for) a su propio name y las piezas del container rodean 3 datos (URL, ruta, nombre del input)
// Los select deben traer el valor indicado claramente en cada option (con value)
// PENDIENTE: Convertirlo en promesa y poder asignar que la matriz a la que se asignarán los elementos prendidos sea de la Vista o de un Modal (prendsV o prendsM), para que sean apagados en un tiempo distinto que el cambio de vista (aunque ahí también deberían incluirse)
function SyncElmntChanges(CSSquery,FBroute,prfx,cntnr,FileRoute){
	if (typeof(prfx)==='undefined') prfx = "";
	// Seleccionar todos los inputs del tipo especificado
	var els=document.querySelectorAll(CSSquery+":not(.not-sync)");
	if(1 && tst_logs)console.log("SEC els.length: "+els.length);
	// A cada uno
	for(var i = 0; i < els.length; i++)if(els[i].name){
		if(0 && tst_logs)console.log("SEC SET FOR:"+els[i].name,els[i].type,els[i].value);
		// Almacena y Elimina el onChange original
		if (els[i].onchange){
			orgOnChng[els[i].type+els[i].name]=els[i].onchange;
			els[i].onchange="";
		}
		// al cambio del Dato...
		//els[i].onchange=function(){ // VERSION VIEJA
		els[i].addEventListener('change', function(e){
			// Save myName for internal usage
			var myName=this.name;
			// Programar la ejecución del onChange original en una matriz aparte
			if(orgOnChng[this.type+this.name]){
				orgOnChng[this.type+this.name].call(this);
				if(0 && tst_logs)console.log("SEC "+orgOnChng.length+"-"+this.type+"-"+this.name);
			}
			if(this.type=="file"){
				if(this.multiple)upldMltplFiles(e,FBroute,prfx+myName,FileRoute);
				else upldOnlyFile(e,FBroute,prfx+myName,FileRoute);
			}
			else {
				if(0 && tst_logs)console.log("SEC Changed:"+this.name,this.type,this.value);
				// Establecer el dato correcto a capturar según el tipo de campo
				var newVal=(this.type=="checkbox")?(this.checked)?true:null:(this.type=="select-one")?this.options[this.selectedIndex].value:(this.type=="number")?(Number(this.value)?Number(this.value):null):(this.value)?this.value:null;
				// Subir el dato
				firebase.database().ref(FBroute+"/"+prfx+this.name).transaction(function(current){
					if(1 && tst_logs)console.log("SEC "+current," --=> "+newVal+"// Prends:"+prends.length);
					return newVal;
				}).catch(function(error){console.error(error.message);});
			}
		},false);
		// Captura las Conexiones que serán prendidas (para eliminarlas en rstEstilos)
		prends[prends.length]=FBroute+"/"+prfx+els[i].name;
		// Sincroniza los cambios del Dato, incluyendo el arranque
		firebase.database().ref(FBroute+"/"+prfx+els[i].name).on('value',function(data){
			switch (this.type){
				case "checkbox": if(this.value!=data.val())this.checked=(data.val())?true:false; break;
				case "radio": this.checked=(data.val()==this.value)?true:false;	break;
				case "range":
					if(this.value!=data.val()) this.value=data.val();
					var myLabel=document.querySelector("label[for="+this.name+"]");
					if(myLabel)myLabel.textContent=data.val();
					break;
				case "select-one":
					if(data.exists()){	//.val()){
						if(document.querySelector('select[name="'+this.name+'"] option[value="'+data.val()+'"]').selected!=true)document.querySelector('select[name="'+this.name+'"] option[value="'+data.val()+'"]').selected=true;
					}	else {
						//Cuando no hay valor guardado, Si hay opción vacío seleccionarlo,
						if(document.querySelector('select[name="'+this.name+'"] option[value=""]')!==null) {
							document.querySelector('select[name="'+this.name+'"] option[value=""]').selected=true;
						}
						// .. si no hay opción vacío, crear uno al inicio y seleccionarlo
						else {
							var selector=document.querySelector('select[name="'+this.name+'"]');
							var emptyOption=document.createElement("OPTION");
							emptyOption.disabled=true;
							emptyOption.selected=true;
							emptyOption.value="";
							selector.insertBefore(emptyOption,selector.childNodes[0]);
						}
					}
					break;
				case "file":
					if(this.multiple){
						if (typeof(cntnr)==='undefined')cntnr = ['<a target="_blank" href="','" title="Route: ','">','</a>,<br>'];
						var myLabel=document.querySelector("label[for="+this.name+"]");
						if(myLabel){
							myLabel.innerHTML='';
							for(var y in data.val()){
								myLabel.innerHTML+=cntnr[0]+data.val()[y]+cntnr[1]+FBroute+'/'+this.name+'/'+y+cntnr[2]+y+cntnr[3];
								if(0 && tst_logs)console.log("SEC file "+y+"="+FBroute+'/'+this.name+'/'+y);
							};
						}
					}
					else {	// No múltiples
						if (typeof(cntnr)==='undefined')cntnr = ['<a target="_blank" href="','" title="Route: ','">','</a>'];
						var myLabel=document.querySelector("label[for="+this.name+"]");
						if(myLabel && data.exists()){	//.val()){
							myLabel.innerHTML=cntnr[0]+data.val()+cntnr[1]+FBroute+'/'+this.name+cntnr[2]+this.name+cntnr[3];
						}
					}
					break;
				default: if(this.value!=data.val()) this.value=(data.val())?data.val():""; break;
			}
			if(0 && tst_logs)console.log("SEC "+this.name+"-"+this.value+" <=-- "+data.val());
			// Ejecutar el onChange original una vez al Arranque
			if(orgOnChng[this.type+this.name])orgOnChng[this.type+this.name].call(this);
		},function(error){console.error(error.message);},els[i]);
	}
	if(1 && tst_logs)console.log("SEC "+CSSquery+", PRENDS ="+prends.length);
}

// Sube un archivo y Guarda su referencia en la ruta
function upldOnlyFile(evt,Route,Ext,FB2ndRoute){
	evt.stopPropagation();
	evt.preventDefault();

	var file = evt.target.files[0];

	// Prepara Metadata
	var metadata = {'contentType': file.type};
	// Subir archivo con nombre nuevo
	var uploadTask = firebase.storage().ref().child(Route+"/"+Ext).put(file, metadata);
	// Atender cambios de estado, errores, y fin de carga exitosa (almacenar URL).
	uploadTask.on('state_changed', function(estado) {
		// Obtener % de carga, mediante monto de bytes cargados / totales
		var carga = (estado.bytesTransferred / estado.totalBytes) * 100;
		if(tst_logs)console.log('Cargando '+carga+'%...');
		progBar.MaterialProgress.setBuffer(carga);
		switch (estado.state) {
			case firebase.storage.TaskState.PAUSED: // or 'paused'
				if(tst_logs)console.log('Carga Pausada!');
				break;
			case firebase.storage.TaskState.RUNNING: // or 'running'
				if(tst_logs)console.log('Carga Corriendo...');
				break;
		}
	}, function(error) {
		// Si hay error
		console.error('Carga fallida:', error);
		reject(error);
	}, function() {
		if(tst_logs)console.log('Cargados ',uploadTask.snapshot.totalBytes,'bytes.');
		progBar.MaterialProgress.setProgress(30);
		progBar.MaterialProgress.setBuffer(100);
		if(tst_logs)console.log(uploadTask.snapshot.metadata);
		var url = uploadTask.snapshot.metadata.downloadURLs[0];
		var name = uploadTask.snapshot.metadata.name;
		if(tst_logs)console.log(name+'- Archivo disponible aqui: ', url);
		progBar.MaterialProgress.setProgress(50);

		// Almacenar 2da Referencia de archivos
		if(FB2ndRoute)firebase.database().ref(FB2ndRoute+"/"+Ext).transaction(function(current){
			progBar.MaterialProgress.setProgress(90);
			return url;
		}).catch(function(error){console.error(error.message);});

		// Almacenar Referencia de archivos
		firebase.database().ref(Route+"/"+Ext).transaction(function(current){
			if(tst_logs)console.log(name+"- Referencias Guardadas:", url);
			progBar.MaterialProgress.setProgress(100);
			setTimeout('progBar.style.opacity=0',300);
			return url;
		}).catch(function(error){console.error(error.message);});

	});	// uploadTask
}

// Sube los archivos y Guarda sus referencias incluso para MULTIPLES
function upldMltplFiles(evt,Route,Ext,FB2ndRoute) {
	evt.stopPropagation();
	evt.preventDefault();
	if(tst_logs)console.log("Length= "+evt.target.files.length);

	// Get name for new files.
	var LstFl=0;
	firebase.database().ref(Route+"/"+Ext).limitToLast(1).once('child_added',function(Child){
		LstFl=Child.key;
		if(tst_logs)console.log("LstFl= "+LstFl);
	},function(error){console.error(error.message)});

	var Proms={};
	var files = evt.target.files;
	for(var file=0;file < files.length;file++){
		LstFl++;
		var IamFl=LstFl;
		if(tst_logs)console.log("IamFl="+IamFl);

		// Arma las promesas individuales.
		Proms[IamFl]= new Promise(function(resolve, reject) {
			// Prepara Metadata
			var metadata = {'contentType': files[file].type};
			// Subir archivo con nombre nuevo
			var uploadTask = firebase.storage().ref().child(Route+"/"+Ext+"/"+IamFl).put(files[file], metadata);
			// Atender cambios de estado, errores, y fin de carga exitosa (almacenar URL).
			uploadTask.on('state_changed', function(estado) {
				// Obtener % de carga, mediante monto de bytes cargados / totales
				var carga = (estado.bytesTransferred / estado.totalBytes) * 100;
				if(tst_logs)console.log('Cargando '+carga+'%...');
				progBar.MaterialProgress.setBuffer(carga);
				switch (estado.state) {
					case firebase.storage.TaskState.PAUSED: // or 'paused'
						if(tst_logs)console.log('Carga Pausada!');
						break;
					case firebase.storage.TaskState.RUNNING: // or 'running'
						if(tst_logs)console.log('Carga Corriendo...');
						break;
				}
			}, function(error) {
				// Si hay error
				console.error('Carga fallida:', error);
				reject(error);
			}, function() {
				if(tst_logs)console.log('Cargados ',uploadTask.snapshot.totalBytes,'bytes.');
				progBar.MaterialProgress.setProgress(30);
				progBar.MaterialProgress.setBuffer(100);
				if(tst_logs)console.log(uploadTask.snapshot.metadata);
				var url = uploadTask.snapshot.metadata.downloadURLs[0];
				var name = uploadTask.snapshot.metadata.name;
				if(tst_logs)console.log(name+'- Archivo disponible aqui: ', url);
				progBar.MaterialProgress.setProgress(50);

				// Almacenar 2da Referencia de archivos
				if(FB2ndRoute)firebase.database().ref(FB2ndRoute+"/"+Ext+"/"+name).transaction(function(current){
					progBar.MaterialProgress.setProgress(90);
					return url;
				}).catch(function(error){console.error(error.message);});

				// Almacenar Referencia de archivos
				firebase.database().ref(Route+"/"+Ext+"/"+name).transaction(function(current){
					if(tst_logs)console.log(name+"- Referencias Guardadas:", url);
					progBar.MaterialProgress.setProgress(100);
					setTimeout('progBar.style.opacity=0',300);
					return url;
				}).catch(function(error){console.error(error.message);});

			});	// uploadTask
		});	// Promesa individual
	}	// For
}

// Montador de opciones en listas de selección
function monta(id,obj,clr,inv,copy,selec){
	var fld=document.getElementById(id);
	if(clr){
		desmonta(id);
	}
//	if(Object.keys(obj).length!=1){
//		var opt = document.createElement("option");
//		fld.options.add(opt);
//	}
	for(var val in obj){
		var opt = document.createElement("option");
		opt.text = (inv)? val : obj[val];
//		opt.title = (inv)? val : obj[val];
		if(inv) opt.title = val;
		opt.value = (inv || copy)? obj[val] : val;
		if(selec && val==selec)opt.selected=true;
		fld.options.add(opt)
	}
}

// Montador de hijos de Firebase en listas de selección
function montaFB(id,obj,clr,inv){
	var fld=document.getElementById(id);
	if(clr){
		desmonta(id);
	}
	obj.forEach(function(child){
		var opt = document.createElement("option");
		opt.text = (inv)? child.key : child.val();
//		opt.title = (inv)? val : child.val();
		if(inv) opt.title = child.key;
		opt.value = (inv)? child.val() : child.key;
		fld.options.add(opt)
	});
}

// DesMontador de opciones en listas de selección,
// Acepta cualquier número de IDs
function desmonta(IDs){
	var i=0;
	while (i<arguments.length){
		if(arguments[i]){
			var fld=document.getElementById(arguments[i]);
			while (fld.options.length) {
				fld.remove(0);
			}
		}
		i++;
	}
	var opt = document.createElement("option");
	fld.options.add(opt);
}

// Async Promise Recursive Iterator (probar si se puede reemplazar por un forEach)
function asyncPromObjIter(objects_array, iterator, extraValue, callback) {
    var start_promise = objects_array.reduce(function (prom, object) {
        return prom.then(function () {
            return iterator(object,extraValue);
        });
    }, Promise.resolve()); // initial
    if(callback){
        start_promise.then(callback);
    }else{
        return start_promise;
    }
}

//Carga Estructura de Rango Doble mediante UiSlider
function cargaUiSliderDbl(slider,inptMin,inptMax,strt,fnsh,rng,wNumbFrmt){
	return new Promise(function(LUSresolve, LUSreject){
		DTXPromLoadAsyncJS("js/noUiSlider/nouislider.min.js").then(function(){
			if(!noUiSlider)console.log("NO noUiSlider");else
			DTXPromLoadAsyncJS("js/wNumb/wNumb.js").then(function(){

				var keypressSlider = document.querySelector(slider);
				var input0 = document.querySelector(inptMin);
				var input1 = document.querySelector(inptMax);

				var inputs = [input0, input1];

				noUiSlider.create(keypressSlider, {
					start: [strt, fnsh],
					connect: true,
					tooltips: [wNumb(wNumbFrmt), wNumb(wNumbFrmt)],
					range: rng,
					pips: {
						mode: 'range'
						,density: 4
						,format: wNumb(wNumbFrmt)
					}
					,format: wNumb({decimals: 0})
				});

				keypressSlider.noUiSlider.on('update', function( values, handle ) {
					inputs[handle].value = values[handle];
					if(tst_logs)console.log("slider updated: "+inputs[handle].name);
				});

				keypressSlider.noUiSlider.on('change', function( values, handle ) {
					if(tst_logs)console.log("slider changed: "+inputs[handle].name);
					if ("createEvent" in document) {
						var evt = document.createEvent("HTMLEvents");
						evt.initEvent("change", false, true);
						inputs[handle].dispatchEvent(evt);
					}	else inputs[handle].fireEvent("onchange");
				});

				function setSliderHandle(i, value) {
					var r = [null,null];
					r[i] = value;
					keypressSlider.noUiSlider.set(r);
				}

				// Listen to keydown events on the input field.
				inputs.forEach(function(input, handle) {

					input.addEventListener('change', function(){
						setSliderHandle(handle, this.value);
						if(tst_logs)console.log("input changed: "+handle);
					});

					input.addEventListener('keydown', function( e ) {
						var values = keypressSlider.noUiSlider.get();
						var value = Number(values[handle]);

						// [[handle0_down, handle0_up], [handle1_down, handle1_up]]
						var steps = keypressSlider.noUiSlider.steps();

						// [down, up]
						var step = steps[handle];
						var position;

						switch ( e.which ) {
							case 13:	// 13 is enter,
								setSliderHandle(handle, this.value);
								break;
							case 38:	// 38 is key up,
								// Get step to go increase slider value (up)
								position = step[1];
								// false = no step is set
								if ( position === false ) { position = 1; }
								// null = edge of slider
								if ( position !== null ) { setSliderHandle(handle, value + position); }
								break;
							case 40:	// 40 is key down.
								position = step[0];
								if ( position === false ) {	position = 1; }
								if ( position !== null ) { setSliderHandle(handle, value - position); }
								break;
						}
					});
				});
				LUSresolve();
			});
		});
	});
}
