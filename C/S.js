// JavaScript Document
'use strict';

/**
* Proyect:NUHU
* File: C/S.js
* Version : 0.81
* author: Quidware.com
* descr: Controlador de Sesión de Usuario
*
*/

// Globales de Elementos muy útiles para sesiones abiertas

// Imagen default para Usuarios Nuevos sin Redes Sociales
var dfltUserImg="http://nuhu.org.mx/webapp/images/favicon.192.png";
// Categorías de Productos (tal vez se deberían cargar de Base de Datos)
var prodsCats={
	"hortaliza":"HORTALIZAS",
	"infusion":"TÉS, SUPLEMENTOS, CAFÉ",
	"bebida":"BEBIDAS y NIEVES",
	"lacteo":"LÁCTEOS, HUEVO, PROCESADOS",
	"harina":"PASTAS, HARINAS, TORTILLAS",
	"transforma":"TRANSFORMACION",
	"abarrote":"ABARROTE",
	"legumbre":"SEMILLAS y LEGUMINOSAS",
	"fruta":"FRUTAS",
	"higiene":"HIGIENE, BELLEZA Y LIMPIEZA",
	"huerto":"PLÁNTULAS Y HUERTO",
}


// Cierre de sesión
function logOut() {
	if(tst_logs)console.log("logOut");
	if (firebase.auth().currentUser){
		// [START signout]
		//firebase.auth().signOut().then(location.reload());
		firebase.auth().signOut();
		// [END signout]
	} else console.error("No existe sesión abierta que cerrar.");
	// [START_EXCLUDE]
	// [END_EXCLUDE]
}

// Ingreso con Facebook
function LoginFaceBook() {
	// [START createprovider]
	var provider = new firebase.auth.FacebookAuthProvider();
	// [END createprovider]
	// [START addscopes]
	provider.addScope('public_profile');
	provider.addScope('email');
	//	provider.addScope('user_likes');
	//		provider.addScope('user_birthday');
	// [END addscopes]
	// [START signin]
	//firebase.auth().signInWithRedirect(provider);
	firebase.auth().signInWithPopup(provider);
	// [END signin]
}

// Ingreso con Google
function LoginGoogle() {
	// [START createprovider]
	var provider = new firebase.auth.GoogleAuthProvider();
	// [END createprovider]
	// [START addscopes]
	provider.addScope('https://www.googleapis.com/auth/plus.login');
	// [END addscopes]
	// [START signin]
	firebase.auth().signInWithPopup(provider).then(function(result) {
		// This gives you a Google Access Token. You can use it to access the Google API.
		var token = result.credential.accessToken;
		// The signed-in user info.
		var user = result.user;
		// [START_EXCLUDE]
		//document.getElementById('quickstart-oauthtoken').textContent = token;
		// [END_EXCLUDE]
	}).catch(function(error) {
		// Handle Errors here.
		var errorCode = error.code;
		var errorMessage = error.message;
		// The email of the user's account used.
		var email = error.email;
		// The firebase.auth.AuthCredential type that was used.
		var credential = error.credential;
		// [START_EXCLUDE]
		if (errorCode === 'auth/account-exists-with-different-credential') {
			alert('You have already signed up with a different auth provider for that email.');
			// If you are using multiple auth providers on your app you should handle linking
			// the user's accounts here.
		} else {
			console.error(error);
		}
		// [END_EXCLUDE]
	});
	// [END signin]
}

// Ingreso por Correo y contraseña
function loginEmail(){
	var email = document.getElementById('email').value;
	var password = document.getElementById('password').value;
	if (email.length < 4) {
		alert('Por favor ingrese un correo.');
		return;
	}
	if (password.length < 4) {
		alert('Por favor ingrese una contraseña.');
		return;
	}
	// Sign in with email and pass.
	// [START authwithemail]
	firebase.auth().signInWithEmailAndPassword(email, password).catch(function(error) {
		// Handle Errors here.
		var errorCode = error.code;
		var errorMessage = error.message;
		// [START_EXCLUDE]
		if (errorCode === 'auth/wrong-password') {
			alert('Contraseña Errónea.');
		} else if (errorCode === 'auth/user-not-found') {
			alert('Usuario No reconocido.');
		} else {
			alert(error);
			console.error(error);
		}
		// [END_EXCLUDE]
	});
	// [END authwithemail]
}

// Registro mediante Correo y contraseña
function RegistroEmail() {
	var email = document.getElementById('RgEmail').value;
	var password = document.getElementById('RgPass').value;
	if (email.length < 4) {
		alert('Por favor ingrese un correo.');
		return;
	}
	if (password.length < 4) {
		alert('Por favor ingrese una contraseña.');
		return;
	}
	// Register with email and pass.
	// [START createwithemail]
	firebase.auth().createUserWithEmailAndPassword(email, password).then(function(user){
		firebase.database().ref('users/' + user.uid).update({
			displayName: document.getElementById('RgName').value+" "+document.getElementById('RgLname').value
			,uName: document.getElementById('RgName').value
			,uLname: document.getElementById('RgLname').value
			,email: user.email
			,emailVerified: user.emailVerified
			,photoURL: dfltUserImg
			,isAnonymous: user.isAnonymous
			,refreshToken: user.refreshToken
			,providerData: user.providerData
			,uPC: document.getElementById('RgPostal').value
			,uMov: document.getElementById('RgMov').value
		});
	}).catch(function(error) {
		// Handle Errors here.
		var errorCode = error.code;
		var errorMessage = error.message;
		// [START_EXCLUDE]
		if (errorCode == 'auth/weak-password') {
			alert('La contraseña es muy débil. \nUse más de 6 letras y números.');
		} else {
			alert(errorMessage);
			console.error(error);
		}
		// [END_EXCLUDE]
	});
	// [END createwithemail]
}

// Arranca la Sesión, audita los estados de sesión y sincroniza con base de datos
function initSes() {
	if(tst_loads)console.log("initSes");
	// Result from Redirect auth flow.
	firebase.auth().getRedirectResult().then(function(result) {
		if (result.credential) {
			// Regresa un Access Token. Se puede usar para acceder al Facebook API.
			var token = result.credential.accessToken;
			// document.getElementById('quickstart-oauthtoken').textContent = token;
		} else {
			// document.getElementById('quickstart-oauthtoken').textContent = 'null';
		}
		// The signed-in user info.
		var user = result.user;
	}).catch(function(error) {
		var errorCode = error.code;
		var errorMessage = error.message;
		// El correo de la cuenta usada.
		var email = error.email;
		// Tipo de firebase.auth.AuthCredential usada
		var credential = error.credential;
		if (errorCode === 'auth/account-exists-with-different-credential') {
			// Aquí debemos manejar la vinculación de cuentas.
			alert('Usted ya tiene una cuenta para ese correo, mediante otro proveedor.');
		} else {
			console.error(error);
		}
	});

	// Escucha de los Cambios de Estado de Autenticación.
	firebase.auth().onAuthStateChanged(function(user) {
		// Si se tiene activo un usuario
		if (user) {
			if(tst_logs)console.log("USER LOGGED: "+firebase.auth().currentUser.uid);
			// Ajustar ambiente para usuarios:
			addCssO("oculto","#hdrbtn");
			remCssO("drawer-oculto",".nuhu-drawer");
			addCssO("mdl-layout--fixed-drawer",".nuhu-layout");
			setTimeout('remCssO("oculto",".mdl-layout__drawer-button")',100);
			document.getElementById('user-email').innerHTML = firebase.auth().currentUser.email;
			document.getElementById('user-avatar').src = firebase.auth().currentUser.photoURL;

			// Eliminar Modales de ambiente Desconectado
			chiHqO("","#modalesS");

			// Es anónimo
			if(user.isAnonymous){
				if(tst_logs)console.log("USER: Anonymous");
				// Activar ambiente de usuarios Anonimos
				//ambAnon();
				// Está Registrado
			}	else {

				// Actualizar Datos (No está jalando bien en viejos iOS y MacOS)
				firebase.database().ref('users/'+user.uid).once('value').then(function (rslt){
					// Almacenar Datos más recientes (siempre o sólo la primera vez)
					writeUserData(user.uid, user.displayName, user.name, user.last_name, user.email, user.emailVerified, user.photoURL, user.isAnonymous, user.refreshToken, user.providerData, user.age_range, user.birthday);

					// Activar ambiente de usuarios Especiales (si es que lo es)
					if(rslt.val().isClb==1 || rslt.val().isPrv==1 || rslt.val().isAdm==1 || rslt.val().isSAdm==1){
						DTXPromLoadAsyncJS("C/A.js").then(function(success){
							A(rslt);
						}, function(error){console.error("JS C/A.js Load Failed! ",error)});
					} else {
						// En su defecto mostrar sólo botón de Cierre de Sesión
						document.querySelector("#user-menu").innerHTML='<li class="mdl-menu__item" onclick="logOut()"><i class="material-icons">clear</i>Cerrar Sesión</li>';
					}

					/*/
					// Si tiene vacío lo básico del perfil, pedirlo en la Bienvenida
					if((!rslt.val().amA || !rslt.val().amU) && (!rslt.val().uName || !rslt.val().uLname) || !rslt.val().displayName){
						bienvenida(rslt.val().isAdm==1 || rslt.val().isSAdm==1);
					}
					/**/

				}).catch(function(error){console.warn(error.message);});

				// EN CUALQUIER CASO (Anon o Regs)
				fillClientMenu();
				//if(typeof window[showDisconnected()] !== "undefined")showDisconnected();

			}

		} else {
			// No hay usuario activo,
			if(tst_logs)console.log("USER: NOT LOGGED");

			// Ajustar ambiente para desconectados
			remCssO("oculto","#hdrbtn");
			addCssO("drawer-oculto",".nuhu-drawer");
			remCssO("mdl-layout--fixed-drawer",".nuhu-layout");
			setTimeout('addCssO("oculto",".mdl-layout__drawer-button")',100);
			// Ocultar el Drawer y su capa gris (por si es que estaba activa)
			setTimeout('remCssO("is-visible",".mdl-layout__obfuscator")',100);
			setTimeout('remCssO("is-visible",".mdl-layout__drawer")',100);

			/*/
			// ACTIVAR USUARIO ANONIMO (volverá a provocar éste onAuthStateChanged).
			firebase.auth().signInAnonymously().catch(function(error) {
				// Handle Errors here.
				console.error(error.code,error.message);
				// ...
			});
			/*/
			// Cargar Modales de ambiente Desconectado
			loadDiscModals();
			/**/
		}

	});
}

// Al Abrir modal de Restablecimiento de contraseña
function askPwdRestModal(){
	// Jalar correo ingresado en campo email
	document.getElementById('RstEmail').value=document.getElementById('email').value;
}

// Solicitar Reestablecimiento de contraseña
function askPwdRest(){
	firebase.auth().sendPasswordResetEmail(document.getElementById('RstEmail').value).then(function(user){
		location.href="#sentPwdRestModal";
		document.getElementById('shwRstEmail').textContent=document.getElementById('RstEmail').value;
	}).catch(function(error) {
		// Handle Errors here.
		var errorCode = error.code;
		var errorMessage = error.message;
		// [START_EXCLUDE]
		if (errorCode == 'auth/invalid-email') {
			alert('El correo es inválido.');
		} else if (errorCode == 'auth/user-not-found') {
			alert('Ningún usuario corresponde al correo proporcionado.');
		} else {
			alert(errorMessage);
			console.error(error);
		}
		// [END_EXCLUDE]
	});
}

// Actualizar Datos del usuario en base a los de la red social
function writeUserData(userId, disp, name, lname, email,eV,phURL,isAn,rshTkn,prvD,ageR,bDay,CP,telN) {
	var data={};
	if(disp) data.displayName=disp;
	if(name) data.name=name;
	if(lname) data.lastName=lname;
	if(email) data.email=email;
	if(eV) data.emailVerified=eV;
	if(phURL) data.photoURL=phURL;
	if(isAn) data.isAnonymous=isAn;
	if(rshTkn) data.refreshToken=rshTkn;
	if(prvD) data.providerData=prvD;
	if(ageR) data.ageRange=ageR;
	if(bDay) data.birthday=bDay;
	if(CP) data.pCode=CP;
	if(telN) data.tel=telN;

	// Private Data
	firebase.database().ref('users/' + userId).update(data);
	// Public Data
	//firebase.database().ref('user-pub/' + userId).update({photoURL:phURL});

	if(0 && tst_logs)console.log("writeUserData",data);
}

function loadDiscModals(){
	// Cargar Modales de tipo de Sesión Desconectado
	DTXPromLoadIntoHTML("V/B/modals_"+"d"+".html","","modalesS").then(
		function(){
			//Activar Botones de Modales de ambiente Desconectado
			document.getElementById('btn-gg-log').addEventListener('click', LoginGoogle, false);
			document.getElementById('btn-gg-log2').addEventListener('click', LoginGoogle, false);
			document.getElementById('btn-fb-log').addEventListener('click', LoginFaceBook, false);
			document.getElementById('btn-fb-log2').addEventListener('click', LoginFaceBook, false);
/*/	// Apagar temporalmente Registro por Mail
			document.getElementById('btn-Registro').addEventListener('click', RegistroEmail, false);
			document.getElementById('btn-LogEmail').addEventListener('click', loginEmail, false);
/**/
			// Ocultar los Modales (tipo target) al presionar su sombra
			clsModalShdw("#registryModal");
			clsModalShdw("#signinModal");
			clsModalShdw("#askPwdRestModal");
			clsModalShdw("#sentPwdRestModal");
		},
		function(error){console.error("DTXPromLoadIntoHTML Failed! "+error)}
	).then(function(){
		if(tst_logs)console.log("AJUSTE FINALIZADO - Modales Desconectado");
		// endLoad();
	});
}

/* ########### NUHU SPECIFIC FUNCTIONS ############ */
/* ################################################ */

function fillClientMenu(){
	var clntMenu="";
	clntMenu += "<a class=\"mdl-navigation__link\" OLDhref=\".\/\" href=\"javascript:loadCnt('inicio')\"><i class=\"material-icons\" role=\"presentation\">home<\/i>Inicio<\/a>";
	clntMenu += "<div>";
	clntMenu += "	<button id=\"prodbtn\" class=\"mdl-button mdl-js-button mdl-js-ripple-effect\" OLDclass=\"mdl-navigation__link mdl-js-button\" onclick=\"javascript:void(0)\" OLDonclick=\"javascript:loadCnt('productos')\"><i class=\"material-icons\" role=\"presentation\">store<\/i>Productos<\/button>";
	clntMenu += prodsMenu("","prodbtn");
	clntMenu += "<\/div>";
	//clntMenu += "<a class=\"mdl-navigation__link\" href=\"javascript:void(0)\"><i class=\"material-icons\" role=\"presentation\">flag<\/i>Ofertas<\/a>";
	clntMenu += "<a class=\"mdl-navigation__link\" href=\"javascript:loadCnt('cnst')\"><i class=\"material-icons\" role=\"presentation\">shopping_basket<\/i>Mi Canasta<\/a>";
	//clntMenu += "<a class=\"mdl-navigation__link\" href=\"javascript:void(0)\"><i class=\"material-icons\" role=\"presentation\">history<\/i>Mi Historial<\/a>";
	//clntMenu += "<a class=\"mdl-navigation__link\" href=\"javascript:void(0)\"><i class=\"material-icons\" role=\"presentation\">person<\/i>Mi Perfil<\/a>";
	clntMenu += "<a class=\"mdl-navigation__link\" href=\"javascript:loadCnt('nuhu')\"><i class=\"material-icons\" role=\"presentation\">info<\/i>Sobre NUHU<\/a>";
	clntMenu += "<!--a class=\"mdl-navigation__link\" href=\"#tc\"><i class=\"material-icons\" role=\"presentation\">class<\/i>Términos y Condiciones<\/a>";
	clntMenu += "<a class=\"mdl-navigation__link\" href=\"#ap\"><i class=\"material-icons\" role=\"presentation\">spellcheck<\/i>Aviso de Privacidad<\/a>";
	clntMenu += "<a class=\"mdl-navigation__link\" href=\"#sos\"><i class=\"material-icons\" role=\"presentation\">help_outline<\/i><span class=\"visuallyhidden\"><\/span>Ayuda<\/a-->";
	clntMenu += "<div class=\"mdl-layout-spacer\"><\/div>";
	clntMenu += "<a class=\"mdl-navigation__link\" href=\"javascript:loadCnt('contacto')\"><i class=\"material-icons\" role=\"presentation\">forum<\/i>Contacto<\/a>";
	chiHqO(clntMenu,".nuhu-navigation");
	componentHandler.upgradeDom();
	//componentHandler.upgradeElement("#prodbtn");
}

function prodsMenu(prfx,forId,left){
	var prodsMenuCntnt="";
	prodsMenuCntnt += "	<ul id=\"prodsMenuCntnt\" class=\"mdl-menu mdl-js-menu mdl-js-ripple-effect mdl-menu--bottom-"+((left)?"left":"right")+"\" for=\""+forId+"\">";
	for(var cat in prodsCats){
		prodsMenuCntnt += "		<li class=\"mdl-menu__item\" onclick=\"loadCnt('"+prfx+"prods','"+cat+"')\">"+prodsCats[cat]+"<\/li>";
	}
	/*/
	prodsMenuCntnt += "		<li class=\"mdl-menu__item\" onclick=\"javascript:loadCnt('"+prfx+"prods','hortaliza')\">HORTALIZAS<\/li>";
	prodsMenuCntnt += "		<li class=\"mdl-menu__item\" onclick=\"javascript:loadCnt('"+prfx+"prods','infusion')\">TÉS, SUPLEMENTOS, CAFÉ<\/li>";
	prodsMenuCntnt += "		<li class=\"mdl-menu__item\" onclick=\"javascript:loadCnt('"+prfx+"prods','bebida')\">BEBIDAS y NIEVES<\/li>";
	prodsMenuCntnt += "		<li class=\"mdl-menu__item\" onclick=\"javascript:loadCnt('"+prfx+"prods','lacteo')\">LÁCTEOS, HUEVO, PROCESADOS<\/li>";
	prodsMenuCntnt += "		<li class=\"mdl-menu__item\" onclick=\"javascript:loadCnt('"+prfx+"prods','harina')\">PASTAS, HARINAS, TORTILLAS<\/li>";
	prodsMenuCntnt += "		<li class=\"mdl-menu__item\" onclick=\"javascript:loadCnt('"+prfx+"prods','transforma')\">TRANSFORMACION \"La Coope\"<\/li>";
	prodsMenuCntnt += "		<li class=\"mdl-menu__item\" onclick=\"javascript:loadCnt('"+prfx+"prods','abarrote')\">ABARROTES<\/li>";
	prodsMenuCntnt += "		<li class=\"mdl-menu__item\" onclick=\"javascript:loadCnt('"+prfx+"prods','legumbre')\">SEMILLAS y LEGUMINOSAS<\/li>";
	prodsMenuCntnt += "		<li class=\"mdl-menu__item\" onclick=\"javascript:loadCnt('"+prfx+"prods','fruta')\">FRUTAS<\/li>";
	prodsMenuCntnt += "		<li class=\"mdl-menu__item\" onclick=\"javascript:loadCnt('"+prfx+"prods','higiene')\">HIGIENE, BELLEZA Y LIMPIEZA<\/li>";
	prodsMenuCntnt += "		<li class=\"mdl-menu__item\" onclick=\"javascript:loadCnt('"+prfx+"prods','huerto')\">PLÁNTULAS Y HUERTO<\/li>";
	/**/
	prodsMenuCntnt += "	<\/ul>";
	return prodsMenuCntnt;
}

addLoadEvent(initSes);
