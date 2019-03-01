// JavaScript Document
'use strict';

/**
* Proyect:NUHU
* File: C/A.js
* Version : 0.81
* author: Quidware.com
* descr: Controlador de Ambiente para usuarios Especiales (Colaborador, Proveedor y Administrador)
*
* PENDS: Tal vez todo éste código o partes de él deberían obtenerse de ramas en la base de datos restringidas según el tipo de usuario
*/

// Globales de Elementos muy útiles para Ambientes de Usuarios especiales

var bgCliente="mdl-color--blue-grey-800";
var bgCol="mdl-color--light-blue-800";
var bgProv="mdl-color--green-800";
var bgAdmin="mdl-color--pink-800";

var bgCurrent="mdl-color--blue-grey-800";
var selCurrent="#aCliente-sel";

function A(rslt){
  document.querySelector("#user-menu").innerHTML="";
  if(rslt.val().isClb==1 || rslt.val().isPrv==1 || rslt.val().isAdm==1 || rslt.val().isSAdm==1){
    document.querySelector("#user-menu").innerHTML+='<li class="mdl-menu__item"  onclick="aCliente()"><i class="material-icons">face</i>Cliente<div class="mdl-layout-spacer"></div><i class="material-icons" id="aCliente-sel">radio_button_checked</i></li>';
  }
  if(rslt.val().isClb==1 || rslt.val().isSAdm==1){
    document.querySelector("#user-menu").innerHTML+='<li class="mdl-menu__item"  onclick="aCol()"><i class="material-icons">ballot</i>Colaborador<div class="mdl-layout-spacer"></div><i class="material-icons" id="aCol-sel">radio_button_unchecked</i></li>';
  }
  if(rslt.val().isPrv==1 || rslt.val().isSAdm==1){
    document.querySelector("#user-menu").innerHTML+='<li class="mdl-menu__item"  onclick="aProv()"><i class="material-icons">nature_people</i>Proveedor<div class="mdl-layout-spacer"></div><i class="material-icons" id="aProv-sel">radio_button_unchecked</i></li>';
  }
  if(rslt.val().isAdm==1 || rslt.val().isSAdm==1){
    document.querySelector("#user-menu").innerHTML+='<li class="mdl-menu__item"  onclick="aAdmin('+rslt.val().isSAdm+')"><i class="material-icons">vpn_key</i>Administrador<div class="mdl-layout-spacer"></div><i class="material-icons" id="aAdmin-sel">radio_button_unchecked</i></li>';
  }
  document.querySelector("#user-menu").innerHTML+='<li class="mdl-menu__item" onclick="logOut()"><i class="material-icons">clear</i>Cerrar Sesión</li>';
}
function aCliente(){
  remCssO("is-visible", "#accbtn + div");
  chiHqO("radio_button_unchecked",selCurrent);
  chiHqO("radio_button_checked","#aCliente-sel");
  selCurrent="#aCliente-sel";
  remCssO(bgCurrent,".nuhu-navigation");
  addCssO(bgCliente,".nuhu-navigation");
  bgCurrent=bgCliente;
  fillClientMenu();
}
function aCol(){
  remCssO("is-visible", "#accbtn + div");
  chiHqO("radio_button_unchecked",selCurrent);
  chiHqO("radio_button_checked","#aCol-sel");
  selCurrent="#aCol-sel";
  remCssO(bgCurrent,".nuhu-navigation");
  addCssO(bgCol,".nuhu-navigation");
  bgCurrent=bgCol;
  var colMenu="";
  colMenu += "<div class=\"mdl-layout-spacer\"><\/div>";
  colMenu += "<a class=\"mdl-navigation__link\" href=\"https://api.whatsapp.com/send?phone=525584213337\" target=\"_blank\"><i class=\"material-icons\" role=\"presentation\">forum<\/i>Webmaster<\/a>";
  chiHqO(colMenu,".nuhu-navigation");
  componentHandler.upgradeDom();
  //componentHandler.upgradeElement("#prodbtn");
  remCssO('is-visible',".mdl-menu__container");
}
function aProv(){
  remCssO("is-visible", "#accbtn + div");
  chiHqO("radio_button_unchecked",selCurrent);
  chiHqO("radio_button_checked","#aProv-sel");
  selCurrent="#aProv-sel";
  remCssO(bgCurrent,".nuhu-navigation");
  addCssO(bgProv,".nuhu-navigation");
  bgCurrent=bgProv;
  var provMenu="";
  provMenu += "<div class=\"mdl-layout-spacer\"><\/div>";
  provMenu += "<a class=\"mdl-navigation__link\" href=\"https://api.whatsapp.com/send?phone=525584213337\" target=\"_blank\"><i class=\"material-icons\" role=\"presentation\">forum<\/i>Webmaster<\/a>";
  chiHqO(provMenu,".nuhu-navigation");
  componentHandler.upgradeDom();
  //componentHandler.upgradeElement("#prodbtn");
}
function aAdmin(S){
  remCssO("is-visible", "#accbtn + div");
  chiHqO("radio_button_unchecked",selCurrent);
  chiHqO("radio_button_checked","#aAdmin-sel");
  selCurrent="#aAdmin-sel";
  remCssO(bgCurrent,".nuhu-navigation");
  addCssO(bgAdmin,".nuhu-navigation");
  bgCurrent=bgAdmin;
  var adminMenu="";
  adminMenu += "<a class=\"mdl-navigation__link\" OLDhref=\".\/\" href=\"javascript:loadCnt('inicio')\"><i class=\"material-icons\" role=\"presentation\">home<\/i>Slides de Inicio<\/a>";
  adminMenu += "<div>";
  adminMenu += "	<button id=\"prodbtn\" class=\"mdl-button mdl-js-button mdl-js-ripple-effect\" OLDclass=\"mdl-navigation__link mdl-js-button\" onclick=\"javascript:void(0)\" OLDonclick=\"javascript:loadCnt('productos')\"><i class=\"material-icons\" role=\"presentation\">store<\/i>Productos<\/button>";
  adminMenu += prodsMenu("A_","prodbtn");
  adminMenu += "<\/div>";
  adminMenu += "<a class=\"mdl-navigation__link\" href=\"javascript:void(0)\"><i class=\"material-icons\" role=\"presentation\">flag<\/i>Ofertas<\/a>";
  adminMenu += "<a class=\"mdl-navigation__link\" href=\"javascript:loadCnt('A_nuhu')\"><i class=\"material-icons\" role=\"presentation\">info<\/i>Sobre NUHU<\/a>";
  adminMenu += "<a class=\"mdl-navigation__link\" OLDhref=\".\/\" href=\"javascript:loadCnt('productos')\"><i class=\"material-icons\" role=\"presentation\">people_outline<\/i>Usuarios<\/a>";
  if(S)adminMenu += "<a class=\"mdl-navigation__link\" OLDhref=\".\/\" href=\"javascript:loadCnt('productos')\"><i class=\"material-icons\" role=\"presentation\">settings<\/i>Config<\/a>";
  adminMenu += "<div class=\"mdl-layout-spacer\"><\/div>";
  adminMenu += "<a class=\"mdl-navigation__link\" href=\"https://api.whatsapp.com/send?phone=525584213337\" target=\"_blank\"><i class=\"material-icons\" role=\"presentation\">forum<\/i>Webmaster<\/a>";
  chiHqO(adminMenu,".nuhu-navigation");
  componentHandler.upgradeDom();
  //componentHandler.upgradeElement("#prodbtn");
}
