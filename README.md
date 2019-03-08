# Nuhu-WebApp
WebApp Progresiva, para la tienda local de la Cooperativa Nuhu en Querétaro, que distribuye productos orgánicos de la región creada por pequeños productores, sin intermediarios, recolectada y distribuida una vez por semana.

## Estado del proyecto
Nuestra organización existe desde principios de 2018, distribuyendo productos orgánicos entre los productores regionales y las familias citadinas, sin intermediarios.
La metodología de trabajo funciona hasta el momento con herramientas muy básicas: una forma de Google Docs para los pedidos y hojas de excel para la recolección, armado y entrega.

### Problemática
El problema principal es que la forma de Google (abierta de miércoles a viernes, el corte se hace los sábados temprano y el pedido a proveedores el sábado a medio día) ya es demasiado grande por la cantidad de productos que se manejan y genera ya muchos problemas para la confirmación del cliente que está haciendo el pedido, cosa que incluso espanta a los clientes y los desmotiva de volver a usar el servicio.

### Objetivo
La urgencia es reemplazar esa [forma de Google](http://pedidos.nuhu.org.mx) por la primera etapa de ésta WebApp, para que los clientes puedan hacer sus pedidos semanales de forma ágil y confiable estructuralmente, y de ahí generar el archivo CSV para importar en Excel el concentrado de pedidos confirmados, para continuar con el resto del proceso actual.

## RoadMap
Acabando ésta 1era etapa (pedidos semanales) y después de probarla bien con el equipo, ya podemos pasarnos al resto de los casos de uso (proveedores, colaboradores, admins, etc) señalados en el [mapa mental](https://www.mindmeister.com/1080714193).

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
