
// JavaScript Document
'use strict';

/**
	* Proyect: NUHU
	* File: V/E/prod-card.js
	* Version : 0.7
	* author: Quidware.com
	* descr: Constructor de Card de Producto, tanto para Clientes como Colaboradores, Proveedores y Administradores
	*
 */

function cardBase(card,vals,USR){
	//var Rand=Math.ceil(Math.random()*1);

	return new Promise(function(resolve,reject){
		if(!(card,vals)) reject("Faltan valores para la card");

		var x=card.consec;
		var st=vals.Cstts;

		card.dsc=(vals.dsc)?vals.dsc:"SIN DESCRIPCIÓN";
		card.exs=(vals.exs)?"checked":"";

		var CB="";
		CB += "<!-- Card MDL "+x+": "+card.id+"-->";
		CB += "<div class=\""+card.class+" NUHU-card-wide mdl-card mdl-shadow--4dp\" ";
		//if(Rand==3)CB += "onMouseOver=\"triggererClassToggle('editing')\" onMouseOut=\"triggererClassToggle('editing')\" ";
		CB += " id=\""+card.id+"\"> ";
		CB += "	<label for=\"C"+x+"-AF2\" style=\"z-index: 3;\">";
		CB += "		<div class=\"mdl-card__title\">";
		CB += "			<h2 class=\"mdl-card__title-text\">Producto "+card.id+" en Card C"+x+"<\/h2>";
		CB += "		<\/div>";
		CB += "		<input class=\"NUHU-card-actFase2 not-sync\" type=\"radio\" id=\"C"+x+"-AF2\" name=\"actFase2\" value=\"C"+x+"\" OLDonChange=\"marcAcc("+x+",'"+card.id+"'); \" \/>";
		CB += "		<div class=\"mdl-card__media\" "
		if(vals.img)CB += "			style=\"background-image: url("+vals.img+");\"";
		CB += "		><\/div>";
		CB += "		<div class=\"fase2\">";
		CB += "			<div class=\"back-card\">"+card.dsc;
		CB += "				<hr class=\"graycolorborder3\">";
		//CB += "				<a class=\"masbutton\" href=\"#FichaTecnica"+card.id+"\" onclick=\"console.log('"+card.route+card.id+"')\">+ Más<\/a>";
		CB += "			<\/div>";
		CB += "		<\/div>";
		CB += "		<div class=\"mdl-card__actions mdl-color-text--white mdl-color--grey mdl-typography--text-center\">"+card.id+"<br />$ "+vals.prc+" por "+vals.tsd+"<\/div>";
		CB += "		<div class=\"mdl-card__menu\">";
		//if(!card.admin)CB += "			<label for=\"CanNmr-"+x+"\" id=\"CanAdd-"+x+"\" class=\"mdl-color--primary mdl-button mdl-color-text--primary-contrast mdl-button--icon mdl-js-button mdl-js-ripple-effect\" title=\"Agregar "+card.id+" a tu canasta\" onclick=\"CarAddProd('"+categ+"','"+card.id+"');\"> <i class=\"material-icons\">add<\/i> <\/label><br />";
		/*/	// Text con Datalist
		if(!card.admin)CB += "			<input type=\"number\" name=\""+card.id+"\" id=\"CanNmr-"+x+"\" class=\"NMR\" min=\"0\" max=\""+(vals.und*10)+"\" step=\""+vals.und+"\" onChange=\"(this.value>0)?cssDisplay('inline-block','#CanRem-"+x+"'):desaparece('#CanRem-"+x+"');\" /><br />";
		/* /	// Text con Datalist
		if(!card.admin)CB += "			<input type=\"text\" list=\"CanLst-"+x+"\" name=\""+card.id+"\" id=\"CanNmr-"+card.id+"\" class=\"NMR\" onChange=\"(this.value>0)?cssDisplay('inline-block','#CanRem-"+x+"'):desaparece('#CanRem-"+x+"');\" /><datalist id=\"CanLst-"+x+"\"><option value="+(vals.und)+"><option value="+(vals.und*2)+"><option value="+(vals.und*3)+"><option value="+(vals.und*4)+"><option value="+(vals.und*5)+"><option value="+(vals.und*6)+"><option value="+(vals.und*7)+"><option value="+(vals.und*8)+"><option value="+(vals.und*9)+"><option value="+(vals.und*10)+"></datalist><br />";
		/*/
		if(!card.admin)CB += "			<select name=\""+card.id+"\" id=\"CanNmr-"+x+"\" class=\"NMR mdl-color--primary mdl-color-text--primary-contrast mdl-button--icon \" onChange=\"(this.options[this.selectedIndex].value>0)? cssDisplay('inline-block','#CanRem-"+x+"'):desaparece('#CanRem-"+x+"');\" title=\"Agregar "+card.id+" a tu canasta\" /><option value selected>+</option><option value="+Number(vals.und)+">"+Number(vals.und)+"</option><option value="+Number(vals.und)*10*2/10+">"+Number(vals.und)*10*2/10+"</option><option value="+Number(vals.und)*10*3/10+">"+Number(vals.und)*10*3/10+"</option><option value="+Number(vals.und)*10*4/10+">"+Number(vals.und)*10*4/10+"</option><option value="+Number(vals.und)*10*5/10+">"+Number(vals.und)*10*5/10+"</option><option value="+Number(vals.und)*10*6/10+">"+Number(vals.und)*10*6/10+"</option><option value="+Number(vals.und)*10*7/10+">"+Number(vals.und)*10*7/10+"</option><option value="+Number(vals.und)*10*8/10+">"+Number(vals.und)*10*8/10+"</option><option value="+Number(vals.und)*10*9/10+">"+Number(vals.und)*10*9/10+"</option></select><br />";
		/**/
		if(!card.admin)CB += "			<button id=\"CanRem-"+x+"\" class=\"mdl-color--accent mdl-color-text--accent-contrast mdl-button mdl-button--icon mdl-js-button mdl-js-ripple-effect oculto\" title=\"Quitar "+card.id+" de tu canasta\" onclick=\"CarRemProd('"+categ+"','"+card.id+"','"+x+"');\"> <i class=\"material-icons\">clear<\/i> <\/button>";
		//if(card.admin)CB += "			<button id=\"Existencia-"+card.id+"\" class=\"mdl-color--accent mdl-color-text--accent-contrast mdl-button mdl-button--icon mdl-js-button mdl-js-ripple-effect\" title=\"Disponible?\" onclick=\"console.log('Existencia:"+card.route+"','"+card.id+"');\"> <i class=\"material-icons\">done<\/i> <\/button>";
		if(card.admin)CB += "<input class='tgl tgl-flip EXS' id=\"EXS-"+card.id+"\" type='checkbox' name=\""+card.id+"/exs\" ><label class='tgl-btn' data-tg-off='No' data-tg-on='Si' for='EXS-"+card.id+"' title='Disponible?' style=\"float: left; width: 50px;\"></label>";	//"+card.exs+"
		if(card.admin)CB += "			<button id=\"Editar-"+card.id+"\" class=\"mdl-color--accent mdl-color-text--accent-contrast mdl-button mdl-button--icon mdl-js-button mdl-js-ripple-effect\" title=\"Editar\" onclick=\"edit_prod('"+card.route+"','"+card.id+"');\" OLDonclick=\"console.log('Editar:"+card.route+"','"+card.id+"');\"> <i class=\"material-icons\">create<\/i> <\/button>";

		CB += "		<\/div>";
		CB += "	<\/label>";
		CB += "<\/div>";
		CB += "<!-- \/Card MDL -->";
		resolve(CB);
	});
}

if(tst_logs)console.log("cardBase loaded");
