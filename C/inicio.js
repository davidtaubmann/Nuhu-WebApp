/**
* Proyect:NUHU
* File: C/inicio.js
* Version : 0.7
* author: Quidware.com
* descr: Controlador para Contenido de inicio
*
*/

function inicio(){
	// Conectar UiSlider Doble para Tiempos
	var invMin= 2000000;
	var invMax= 3000000;
	var invRng= {'min': [1500000, 100000],'50%': [3000000, 200000],'max': 4000000 };
	var invFrmt= { decimals: 0, prefix: '$ ' , suffix: '.&deg;&deg;', thousand: ',' };

	// Si tiene vacío lo básico del perfil, pedirlo en la Bienvenida
	if(firebase.auth().currentUser){
		firebase.database().ref('users/'+firebase.auth().currentUser.uid).once('value').then(function (rslt){
			if(!rslt.val().Nombre || !rslt.val().Zona || !rslt.val().NumPxs || !rslt.val().Tel || !rslt.val().Enlace || !rslt.val().Motivo){
				bienvenida(rslt.val().isAdm==1 || rslt.val().isSAdm==1,rslt.val());
			}
		}).catch(function(error){console.warn(error.message);});
	}

	//cargaUiSliderDbl('#invUiSlider','.input-invUiSlider-0','.input-invUiSlider-1',invMin,invMax,invRng,invFrmt).then(function(){
	// Si no hay sesión iniciada, mostrar campos de registrados
	if(SPAPWALoaded==1) showDisconnected(); else addLoadEvent(showDisconnected);
	endLoad();
	//});

}

function showDisconnected(){
	if(tst_logs)console.log("INICIO - showDisconnected()");
	if(firebase.auth().currentUser){
		addCssO("oculto","#inicio-registrate");
	} else {
		remCssO("oculto","#inicio-registrate");
	}
}

// Mostrar Bienvenida a Usuarios de primera vez
function bienvenida(cls,vals){
	console.log(vals);
	if(tst_logs)console.log("PEDIR bienvenida")
	// Preguntar que quiere hacer primero
	var chcInit ="";
	chcInit += "<div id=\"bienvenida\" class=\"fade over-mas modalDialog\">";
	chcInit += '	<div> Bienvenido a NUHU!<br><br>Gracias por registrate. Ahora necesitamos que contestes unas preguntas adicionales:<br><br>';
	chcInit += '		<form id="user_info_form" action="javascript:guardaInfoExtra()">';
	if(!vals.Nombre){
		chcInit += '			<div class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">';
		chcInit += '				<input name="Nombre" id="Nombre" type="text" OLDplaceholder="Colaborador" class="mdl-textfield__input" required>';
		chcInit += '				<label class="mdl-textfield__label" for="Nombre">Nombre de familia o persona...</label>';
		chcInit += '			</div><div class="mdl-tooltip mdl-tooltip--top" data-mdl-for="Nombre">Por favor proporciona DOS APELLIDOS para evitar usuarios duplicados.</div>';
	}
	if(!vals.Zona){
		chcInit += '			<div class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">';
		chcInit += '				<input name="Zona" id="Zona" type="text" list="sucursales" OLDplaceholder="Colaborador" class="mdl-textfield__input" required>';
		chcInit += '				<label class="mdl-textfield__label" for="Zona">Zona...</label>';
		chcInit += '				<datalist id="sucursales"><option value="Norte - Juriquilla"><option value="Central - Álamos 2da Sección"><option value="Corregidora - Mansiones del Valle"></datalist>';
		chcInit += '			</div>';
	}
	if(!vals.NumPxs){
		chcInit += '			<div class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">';
		chcInit += '				<input name="NumPxs" id="NumPxs" type="number" min="1" max="20" OLDplaceholder="Colaborador" class="mdl-textfield__input" required>';
		chcInit += '				<label class="mdl-textfield__label" for="NumPxs"># Personas que se abastecerían</label>';
		chcInit += '			</div>';
	}
	if(!vals.Tel){
		chcInit += '			<div class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">';
		chcInit += '				<input name="Tel" id="Tel" type="number" OLDplaceholder="Colaborador" class="mdl-textfield__input" required>';
		chcInit += '				<label class="mdl-textfield__label" for="Tel">Teléfono...</label>';
		chcInit += '			</div>';
	}
	if(!vals.Enlace){
		chcInit += '			<div class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">';
		chcInit += '				<input name="Enlace" id="Enlace" type="text" list="enlaces" OLDplaceholder="Colaborador" class="mdl-textfield__input" required>';
		chcInit += '				<label class="mdl-textfield__label" for="Enlace">Enlace o contacto en la Cooperativa...</label>';
		chcInit += '				<datalist id="enlaces"><option value="Amílcar (Chef)"><option value="Arturo"><option value="Daniel (Bacho)"><option value="Grisel"><option value="Isabel"><option value="Laura"><option value="Pancho"><option value="No conozco ningún enlace"></datalist>';
		chcInit += '			</div>';
	}
	if(!vals.Motivo){
		chcInit += '			<div class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">';
		chcInit += '				<input name="Motivo" id="Motivo" type="text" OLDplaceholder="Colaborador" class="mdl-textfield__input" required>';
		chcInit += '				<label class="mdl-textfield__label" for="Motivo">Motivo de interés en la Cooperativa...</label>';
		chcInit += '			</div>';
	}
	if(!vals.Consideraciones){
		chcInit += '			<div class="mdl-textfield mdl-js-textfield">';
		chcInit += '				<textarea name="Consideraciones" id="Consideraciones" type="text" OLDplaceholder="Colaborador" class="mdl-textfield__input" rows="3"></textarea>';
		chcInit += '				<label class="mdl-textfield__label" for="Consideraciones">Otras consideraciones...</label>';
		chcInit += '			</div><div class="mdl-tooltip mdl-tooltip--top" data-mdl-for="Consideraciones">Cuéntanos como te enteraste de La Coope o si has llegado por invitación de algún cliente pon aquí su nombre completo y ambos recibirán un descuento en su próxima canasta.</div>';
	}
	if(!vals.Proyectos){
		chcInit += '			<div class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">';
		chcInit += '				<input name="Proyectos" id="Proyectos" type="text" OLDplaceholder="Colaborador" class="mdl-textfield__input">';
		chcInit += '				<label class="mdl-textfield__label" for="Proyectos">Proyectos Concientes?</label>';
		chcInit += '			</div><div class="mdl-tooltip mdl-tooltip--top" data-mdl-for="Proyectos">¿Pertenece alguno de ustedes a algún proyecto relacionado con la alimentación ecológica y solidaria? ¿Cuál?</div>';
	}
	chcInit += '			<div class="mdl-textfield--align-right page-content" style="margin-top:20px">';
	chcInit += '				<button class="mdl-button mdl-js-button mdl-button--raised mdl-button--accent">Guardar</button>';
	chcInit += '			</div>';
	chcInit += "		</form>";
	chcInit += "	</div>";
	chcInit += "</div>";
	document.querySelector("#modalesV").innerHTML=chcInit;
	if(cls)clsModalShdw("#bienvenida");

	location.href="#bienvenida";
	if(document.querySelectorAll('#user_info_form .mdl-js-textfield').length){
		componentHandler.upgradeDom();
		chkDrtyVld('#user_info_form .mdl-js-textfield');
	}
}

function guardaInfoExtra(){
	var data={};
	if(document.querySelector("#user_info_form #Nombre")) data.Nombre=document.querySelector("#user_info_form #Nombre").value;
	if(document.querySelector("#user_info_form #Zona")) data.Zona=document.querySelector("#user_info_form #Zona").value;
	if(document.querySelector("#user_info_form #NumPxs")) data.NumPxs=Number(document.querySelector("#user_info_form #NumPxs").value);
	if(document.querySelector("#user_info_form #Tel")) data.Tel=Number(document.querySelector("#user_info_form #Tel").value);
	if(document.querySelector("#user_info_form #Enlace")) data.Enlace=document.querySelector("#user_info_form #Enlace").value;
	if(document.querySelector("#user_info_form #Motivo")) data.Motivo=document.querySelector("#user_info_form #Motivo").value;
	if(document.querySelector("#user_info_form #Consideraciones")) data.Consideraciones=document.querySelector("#user_info_form #Consideraciones").value;
	if(document.querySelector("#user_info_form #Proyectos")) data.Proyectos=document.querySelector("#user_info_form #Proyectos").value;
	console.log("data",data);

	firebase.database().ref('users/'+firebase.auth().currentUser.uid).update(data).then(function(){
    if(tst_logs)console.log("Saved User Info: "+firebase.auth().currentUser.email);
    snackBar('Información Guardada: '+firebase.auth().currentUser.email);
    location.href="#";
    //clearForm("#edit_prod_form");
  }).catch(function(error){
    console.error(error.message);
    snackBar('NO SE GUARDO LA INFORMACIÓN');
  });
	location.href="#";
}

//inicio();
