# Nuhu-WebApp
Progresive WebApp, para la tienda local de la Cooperativa Nuhu en Querétaro, que distribuye productos orgánicos de la región creada por pequeños productores, sin intermediarios, recolectada y distribuida una vez por semana.

## Framework
Construida sobre Firebase, con Realtime Database, no está implementado ningún framework, y tampoco ninguna librería de JS como Vue / React / Angular. Posiblemente se implemente **Vue más adelante**.

## Folders
+ **C** = Controladores (.js)
+ **V** = Vistas (.html)
   + **B** = Bloques (.html y .js , ahorita sólo los Modales)
   + **E** = Elementos Reusables (.js , ahorita sólo la card de productos)
   + **M** = Modelos (.css)

## Controladores de Base (Folder "C" ):
+ **C.js** = 1ero en cargar, variables y funciones globales (existentes desde proyectos previos, es una librería reusable que ya incluye funciones para FireBase)
+ **V.js** = carga al final del HTML, funciones para carga de las vistas, loadCnt() es la crucial, se asegura de cargar tanto el archivo de vista (html en folder V) como el controlador después de haber cargado la Vista y ejecutar su función propia, todos (el html, el js y la función dentro del js) deben tener el mismo nombre
+ **S.js** = Funciones para Sesión de Usuarios (logins, logout, y sus hijos)
+ **A.js** = Funciones para Sesiones de Usuarios especiales, sólo se carga si entra un usuario con permisos especiales

## Modelo de Datos
No hay un archivo en especial, pues la estructura de los datos es JSON (NoSQL) y éstos hablan por sí solos, las funciones para su manejo son las funciones simples de Firebase

## Adicionales
+ Hay una carpeta para "scripts" externos, sería mejor no mezclarla con los MVC-BEM porque no son para tocarlos
+ Para poder crear un usuario SuperAdmin y poder hacer uso de los roles Colaborador, Proveedor y Admin hay que ingresar como usuario por primera vez (por el momento sólo está activado con cuenta de Google) y pedir a un Desarrollador que active el rol "isSAdm=true" desde Firebase

## TIPs para uso de Firebase
+ Mantén actualizadas las versiones para evitar problemas difíciles de encontrar (script y CLI)
+ Si eres nuevo con FireBase deberías comenzar con éstos cursos y ligas:
  + https://codelabs.developers.google.com/codelabs/firestore-web/index.html?index=..%2F..index
  + https://codelabs.developers.google.com/codelabs/firebase-web/index.html?index=..%2F..index
  + https://stackoverflow.com/questions/41517682/onchild-added-vs-oncechild-added
  + https://stackoverflow.com/questions/42616809/sending-automated-emails-from-firebase-through-google-cloud-platform-no-third-p

## Zona de Pruebas y Credenciales de FTP
+ URL: http://nuhu.org.mx/wa
+ FTP: ftp://nuhu.org.mx
+ USER: wa@nuhu.org.mx
+ Pass: fUR8vsJ0fn1e
