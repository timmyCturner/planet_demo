import {OrbitControls} from 'https://unpkg.com/three@0.127.0/examples/jsm/controls/OrbitControls.js'
import {SphereGeometry, BoxGeometry, MeshBasicMaterial, ImageUtils, Raycaster, WebGLRenderer, Vector2,
   Mesh, Color,  Scene,PerspectiveCamera,TextureLoader,PlaneGeometry,Camera } from 'https://unpkg.com/three@0.127.0/build/three.module.js';

import { GLTFLoader } from "https://unpkg.com/three@0.127.0/examples/jsm/loaders/GLTFLoader";


class Satalite {


 constructor(){
   var geometry = new BoxGeometry( 1, 1, 1);


   colorRandom();
   var material = new MeshBasicMaterial( { color: colorRandom() } );
   // enable transparency
   material.transparent = true;
   // set opacity to 50%
   material.opacity = 0.5;
   //const texture = new THREE.TextureLoader().load( '/assets/textures/Earth.002_diffuse.jpeg' );
   //const material = new THREE.MeshBasicMaterial( { map: texture } );
   this.satalite = new Mesh( geometry, material );
   this.satalite.position.x = 50;
   this.satalite.position.y = 0;
   this.satalite.position.z = 0;

   this.satalite.scale.z=10;
   //this.satalite.rotation.x;
   this.satalite.rotation.x=-45;
   // console.log(this);
   return this;

 }
 HeightByPopulation(){
   var population = this.satalite.population;
   var height=(population/8405837)*20;
   this.satalite.scale.z=height;
 }
 SatByLatLong(lat, long){

   var cartesian_cordinates=calcCrow(lat,long, 50);
   this.satalite.position.x = cartesian_cordinates.x;
   this.satalite.position.y = cartesian_cordinates.y;
   this.satalite.position.z = cartesian_cordinates.z;

   return this;
 }
 SatByCart(x,y,z){
   this.satalite.position.x = x;
   this.satalite.position.y = z;
   this.satalite.position.z = y;
 }
 changeColorRandom(){

 }

}
function calcCrow(latitude, longitude, radius)
{

   const lat =  latitude;
   const lon =  longitude;
   console.log(Math.cos(lat),Math.cos(lon));
   const x = radius*Math.cos(lat) * Math.cos(lon)

   const y = radius*Math.cos(lat) * Math.sin(lon)

   const z = radius*Math.sin(lat)
   console.log((6371*x/250),(6371*y/250),(6371*z/250));
   return {x,y,z}

}
function calcCrowReverse(x,y,z)
{

 const lat = Math.asin(z,1);
 const long = Math.atan2(y,x);

}
function colorRandom(){

 const genRanHex = size => [...Array(size)].map(() => Math.floor(Math.random() * 16).toString(16)).join('');

 return '#'+genRanHex(6);

}

/**
* Provides requestAnimationFrame in a cross browser way.
* @author paulirish / http://paulirish.com/
*/

if (!window.requestAnimationFrame) {

 window.requestAnimationFrame = (function() {

   return window.webkitRequestAnimationFrame ||
     window.mozRequestAnimationFrame ||
     window.oRequestAnimationFrame ||
     window.msRequestAnimationFrame ||
     function( /* function FrameRequestCallback */ callback, /* DOMElement Element */ element) {

       window.setTimeout(callback, 1000 / 60);

     };

 })();

}
  var container, stats;

          var back_texture ,  backgroundMesh
           var camera, scene, renderer, controls, raycaster
           var mouse = new Vector2(),
               INTERSECTED;
           var dictionary;
           var sphere, earth, salatites, plane;

           var targetRotationX = 0.5;
           var targetRotationOnMouseDownX = 0;

           var targetRotationY = 0.2;
           var targetRotationOnMouseDownY = 0;

           var mouseX = 0;
           var mouseXOnMouseDown = 0;

           var mouseY = 0;
           var mouseYOnMouseDown = 0;

           var backgroundScene ;
           var backgroundCamera;

           var windowHalfX = window.innerWidth / 2;
           var windowHalfY = window.innerHeight / 2;

           var slowingFactor = 0.25;
           document.addEventListener( 'mousewheel', (event) => {
             camera.position.z +=event.deltaY/50;
           });
           init().then(response=>{animate()})
           async function init() {

               container = document.createElement( 'div' );
               document.body.appendChild( container );

               raycaster = new Raycaster();
               renderer = new WebGLRenderer({
                   antialias: true
               });

               renderer.setSize( window.innerWidth, window.innerHeight );
               renderer.domElement.addEventListener("click", onclick, true);


               //renderer.setClearColor( 0x00cccc, 0);
               container.appendChild( renderer.domElement );
               document.addEventListener( 'mousedown', onDocumentMouseDown, false );

               scene = new Scene();
               back_texture = new TextureLoader().load( 'assets/textures/space.jpg' );
               backgroundMesh =
                  new MeshBasicMaterial({
                      map: back_texture
                  });

              // backgroundMesh.material.depthTest = false;
              // backgroundMesh.material.depthWrite = false;


              scene.background = back_texture ;
               //scene.background = new Color( 0x00cccc );
               console.log(scene);
               camera = new PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 1, 1000 );
               //console.log(camera);
               camera.position.y = 0;
               camera.position.z = 100;

               // camera.rotation.x = 0;
               // camera.rotation.y = 0;
               // camera.rotation.z = 0;
               //console.log(renderer);
               controls = new OrbitControls(camera, renderer.domElement);


               scene.add( camera );

               var geometry = new SphereGeometry( 50, 32, 16);
               //var material = new THREE.MeshBasicMaterial( { color: "#166294" } );
               const texture = new TextureLoader().load( 'assets/textures/Earth.002_diffuse.jpeg' );
               const material = new MeshBasicMaterial( { map: texture } );
               sphere = new Mesh( geometry, material );
               sphere.name = 'Earth'
               //log calcrow
               const city_list = await fetch('assets/json/sample.json').then(response => response.json());
               //console.log(city_list);
                 for (var i=0; i<100; i++) {
                   var temp_satalite = new Satalite();
                   temp_satalite.SatByCart(city_list[i].x, -1*city_list[i].y, city_list[i].z);
                   temp_satalite.satalite.name = city_list[i].city;
                   //console.log(city_list[i].population);
                   temp_satalite.satalite.population = city_list[i].population;
                   temp_satalite.HeightByPopulation()
                   scene.add( temp_satalite.satalite );


                 }
               // })
             controls.addEventListener( 'change', render);
             scene.add( sphere );




             plane = new Mesh( new PlaneGeometry( 200, 200 ), new MeshBasicMaterial( { color: 0xe0e0e0 } ) );
             //plane.rotation.x = - 90 * ( Math.PI / 180 );
             plane.overdraw = true;
           }

           function onDocumentMouseDown( event ) {

               event.preventDefault();

               document.addEventListener( 'mousemove', onDocumentMouseMove, false );
               document.addEventListener( 'mouseup', onDocumentMouseUp, false );
               document.addEventListener( 'mouseout', onDocumentMouseOut, false );

               mouseXOnMouseDown = event.clientX - windowHalfX;
               targetRotationOnMouseDownX = targetRotationX;

               mouseYOnMouseDown = event.clientY - windowHalfY;
               targetRotationOnMouseDownY = targetRotationY;
           }

           function onDocumentMouseMove( event ) {

               mouseX = event.clientX - windowHalfX;

               targetRotationX = ( mouseX - mouseXOnMouseDown ) * 0.00025;

               mouseY = event.clientY - windowHalfY;

               targetRotationY = ( mouseY - mouseYOnMouseDown ) * 0.00025;
           }
           function onDocumentMouseUp( event ) {
               document.removeEventListener( 'mousemove', onDocumentMouseMove, false );
               document.removeEventListener( 'mouseup', onDocumentMouseUp, false );
               document.removeEventListener( 'mouseout', onDocumentMouseOut, false );
           }
           function onDocumentMouseOut( event ) {
               document.removeEventListener( 'mousemove', onDocumentMouseMove, false );
               document.removeEventListener( 'mouseup', onDocumentMouseUp, false );
               document.removeEventListener( 'mouseout', onDocumentMouseOut, false );
           }
           function animate() {
               requestAnimationFrame( animate );
               render();
           }

           function render() {

               targetRotationY = targetRotationY * (1 - slowingFactor);
               targetRotationX = targetRotationX * (1 - slowingFactor);
               //console.log(camera);
               raycaster.setFromCamera(mouse, camera);
               var intersects = raycaster.intersectObjects(scene.children);
               if (intersects.length > 0) {
                   if (INTERSECTED != intersects[0].object) {
                       // if ( INTERSECTED ) INTERSECTED.material.emissive.setHex( INTERSECTED.currentHex );
                       INTERSECTED = intersects[0].object;
                       // INTERSECTED.currentHex = INTERSECTED.material.emissive.getHex();
                       // console.log(document.getElementsByClassName("display")[0]);
                       // console.log(intersects);
                       var display = intersects[0].object.name;
                       var population = intersects[0].object.population;
                       if (population === undefined){
                         population = '---'
                       }
                       console.log(population);
                       document.getElementsByClassName("display")[0].innerHTML = display
                       document.getElementsByClassName("population")[0].innerHTML = population

                   }
               }
               renderer.render( scene, camera );


           }
