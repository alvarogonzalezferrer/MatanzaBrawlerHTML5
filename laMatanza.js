/*********************
Copyright 2015-2018 Kronoman

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
**********************/

/* 
 * La Matanza Brawler
 * 
 * Copyright (c) 2015-2018 Kronoman
 * In Loving Memory Of My Father
 * 
 * Libs Used:
 * EaselJS
 * PreloadJS
 * SoundJS
 * https://github.com/olsn/Collision-Detection-for-EaselJS <-- deteccion pixel perfect
 * Gamepads: http://www.gamepadjs.com/
 * 
 * 
 * NOTA: recordar pasar el codigo por http://www.jslint.com para buscar errores
 * 
 * Ejemplo teclado: 
 * http://nokarma.org/2011/02/27/javascript-game-development-keyboard-input/
 * https://developer.mozilla.org/es/docs/Web/API/KeyboardEvent
 */


// demo a ver
// http://www.createjs.com/Demos/EaselJS/SpriteSheet
/*-------------------- ejemplo OOP 
 // Define a class like this
 function Person(name, gender){
 
 // Add object properties like this
 this.name = name;
 this.gender = gender;
 }
 
 // Add methods like this.  All Person objects will be able to invoke this
 Person.prototype.speak = function(){
 alert("Howdy, my name is" + this.name);
 };
 
 // Instantiate new objects with 'new'
 var person = new Person("Bob", "M");
 
 // Invoke methods like this
 person.speak(); // alerts "Howdy, my name is Bob"
 
 --------------------*/


// para que netbeans sepa que usamos createjs 
/* global createjs */


// GLOBALES -- odio javascript, que lenguaje de mierda

var stage, stage_w, stage_h; // pantalla

var loader; // aca cargo todos los recursos del juego

var fondo, heroe, enemigo1, enemigo2, enemigo3, negro1; // fondo, heroe, enemigos

var energia = 4; // test
var proximo_scroll = 0; // test de scroll

// inicio de createjs
function init()
{
    // preparar el canvas para CreateJS
    var canvas = document.getElementById("canvasMatanza");
    stage = new createjs.Stage(canvas);

    // tomar el ancho y alto del canvas para uso futuro
    stage_w = stage.canvas.width;
    stage_h = stage.canvas.height;

    // TODO mostrar una animacion procedural mientras carga todo, o un "Cargando...", algo asi...
    var text = new createjs.Text("Cargando...", "64px Arial", "#ff0000");
    text.y = 100;
    text.x = 100;
    text.textBaseline = "alphabetic";
    stage.addChild(text);
    stage.update();

    // cosas a cargar
    manifest = [
        {src: "heroe_spritesheet.png", id: "heroe"},
        {src: "enemigo1_spritesheet.png", id: "enemigo1"},
        {src: "negro1_spritesheet.png", id: "negro1"},
        {src: "fondo1.jpg", id: "fondo1"}
    ];

    // cargar los recursos del juego
    loader = new createjs.LoadQueue(false);
    loader.addEventListener("complete", cargaCompleta);
    loader.loadManifest(manifest, true, "img/");

}




function cargaCompleta() {


    fondo = new createjs.Bitmap(loader.getResult("fondo1"));

    // crear sprite sheet del heroe
    // ejemplo de: https://github.com/CreateJS/EaselJS/blob/master/examples/SpriteSheet.html
    // http://createjs.com/Docs/EaselJS/classes/SpriteSheet.html
    var dataHeroe = {
        framerate: 30,
        "images": [loader.getResult("heroe")],
        "frames": [
            // x, y, width, height, imageIndex*, regX*, regY* (regx, regy es las coordenadas de registro del sprite, setear al medio abajo para personajes)
            // coordenadas sale del generador de spritesheets http://www.leshylabs.com/apps/sstool/
            // online: http://www.spritecow.com/
            // o se pueden seleccionar con el gimp y ver x,y,w,h con la herramienta de seleccion en sus parametros
            // caminar
            [12, 0, 74, 185, 0, 37, 185], //0
            [101, 4, 87, 181, 0, 44, 181], //1
            [209, 4, 91, 181, 0, 45, 181], //2
            // parado
            [402, 1, 92, 184, 0, 46, 184], //3
            [514, 5, 126, 180, 0, 63, 180], //4
            [658, 3, 110, 182, 0, 55, 182], //5
            // patada
            [0, 199, 108, 190, 0, 54, 190], //6
            [128, 203, 94, 186, 0, 47, 186], //7
            [233, 223, 174, 166, 0, 87, 166], //8           
            // golpe
            [465, 206, 122, 184, 0, 61, 184], //9
            [609, 206, 150, 184, 0, 75, 184], //10
            // dolor
            [23, 408, 110, 176, 0, 55, 176], //11
            // caida al piso (combinar con dolor)
            [169, 458, 126, 126, 0, 63, 126], //12
            [313, 526, 206, 58, 0, 103, 58]  // 13


        ],
        "animations": {
            // start, end, next*, speed* (*opt)
            //"caminar": [0, 5, "caminar", 0.1]
            "caminar": {
                frames: [0, 1, 0, 2],
                next: "parado",
                speed: 0.1
            },
            "parado": {
                frames: [3, 4, 5, 4],
                next: "parado",
                speed: 0.1
            },
            "patada": {
                frames: [6, 7, 8, 7, 6],
                next: "parado",
                speed: 0.2
            },
            "golpe": {
                frames: [9, 10, 9],
                next: "parado",
                speed: 0.2
            },
            "dolor": {
                frames: [11, 11],
                next: "parado",
                speed: 0.1
            },
            "caida": {
                frames: [0, 11, 12, 13, 13, 13, 13, 13, 12, 11, 0],
                next: "parado",
                speed: 0.1
            }


        }
    };

    var spriteSheetHeroe = new createjs.SpriteSheet(dataHeroe);
    heroe = new createjs.Sprite(spriteSheetHeroe, "parado");

    heroe.x = 100;
    heroe.y = stage_h - 10;

    // enemigo 1
    var dataEnemigo1 = {
        framerate: 30,
        "images": [loader.getResult("enemigo1")],
        "frames": [
            // enemigo
            // golpe
            [0, 0, 118, 194, 0, 50, 194],
            [144, 0, 150, 194, 0, 50, 194],
            [318, 0, 126, 194, 0, 50, 194],
            // caminar
            [524, 0, 104, 194, 0, 50, 194],
            [652, 0, 116, 194, 0, 50, 194],
            [792, 0, 104, 194, 0, 50, 194],
            [914, 0, 122, 194, 0, 50, 194]
        ],
        "animations": {
            "caminar": {
                frames: [3, 4, 5, 6, 5, 4],
                next: "caminar",
                speed: 0.1
            },
            "golpe": {
                frames: [0, 1, 2, 1, 0, 3],
                next: "caminar",
                speed: 0.2
            }

        }
    };

    var spriteSheetEnemigo = new createjs.SpriteSheet(dataEnemigo1);
    enemigo1 = new createjs.Sprite(spriteSheetEnemigo, "caminar");

    enemigo1.scaleX = -1; // flip X -- DEBUG poner en -1
    enemigo1.scaleY = 1; // DEBUG sacar esto
    enemigo1.x = stage_w;
    enemigo1.y = 300;

    // negro 1 -- DEBUG TEST
    var dataNegro1 = {
        framerate: 30,
        "images": [loader.getResult("negro1")],
        "frames": [
            // caminar
            [0, 0, 70, 194, 0, 35, 194],
            [80, 0, 118, 194, 0, 59, 194],
            [208, 0, 129, 194, 0, 65, 194]
        ],
        "animations": {
            "caminar": {
                frames: [0, 1, 0, 2],
                next: "caminar",
                speed: 0.2
            }
        }
    };

    var spriteSheetNegro1 = new createjs.SpriteSheet(dataNegro1);
    negro1 = new createjs.Sprite(spriteSheetNegro1, "caminar");
    negro1.x = 320;
    negro1.y = 470; // DEBUG TEST

    // empezar loop principal	
    createjs.Ticker.setFPS(30);
    createjs.Ticker.addEventListener("tick", tick);

    // test -- dando click zangief puñetea
    stage.addEventListener("stagemousedown", manejarMouse);

    enemigo2 = new createjs.Sprite(spriteSheetEnemigo, "caminar"); // test para hacer un 2ndo enemigo
    enemigo2.scaleX = -1;

    enemigo3 = new createjs.Sprite(spriteSheetEnemigo, "golpe"); // test para hacer un 3er enemigo

    // control de teclado hiper pedorro, mejorar -- http://nokarma.org/2011/02/27/javascript-game-development-keyboard-input/
    window.addEventListener('keydown', function (event) {
        var movio = false;

        if (heroe.currentAnimation === "caida")
            return; // no se puede mover caido :P

        switch (event.keyCode) {
            case 37: // Left
                heroe.x -= 5;
                heroe.scaleX = -1;
                movio = true;
                break;

            case 38:  // up
                heroe.y -= 5;
                movio = true;
                break;

            case 39: // Right
                heroe.x += 5;
                heroe.scaleX = 1;
                movio = true;
                break;

            case 40: // Down
                heroe.y += 5;
                movio = true;
                break;
        }
        if (movio)
            if (heroe.currentAnimation === "parado")
                heroe.gotoAndPlay("caminar");

    }, false);


}


// test de golpe y movimiento enemigo
function manejarMouse(evt) {
    if (enemigo1.currentAnimation === "caminar") // solo golpear si esta caminando, para no re animar el golpe en medio de un golpe
    {
        enemigo1.gotoAndPlay("golpe");


        if (Math.floor((Math.random() * 100) + 1) < 50)
            heroe.gotoAndPlay("golpe"); // test 
        else
            heroe.gotoAndPlay("patada"); // test

        //enemigo1.x = evt.stageX;

        // le pego al personaje nuestro?

        if (Math.abs(enemigo1.x - heroe.x) < heroe.getBounds().width && Math.abs(enemigo1.y - heroe.y) < heroe.getBounds().height * 0.2)
        {
            energia--;

            if (energia < 0)
            {
                heroe.gotoAndPlay("caida"); // test 
                energia = Math.floor((Math.random() * 5) + 1);
            }
            else
                heroe.gotoAndPlay("dolor"); // test


        }
    }
}



// loop principal de juego
function tick(e) {


    if (heroe.x > stage_w - heroe.getBounds().width * 1.2)
    {
        heroe.x = stage_w - heroe.getBounds().width * 1.2;
        proximo_scroll = 128; // scrollear proxima pantalla
    }

    if (proximo_scroll > 0)
    {
        proximo_scroll--;
        fondo.x -= 5;
        heroe.x -= 5;
        if (fondo.x < -3200)
            fondo.x = -3200;
    }

    // IA pedorra
    if (enemigo1.y > heroe.y - 5)
        enemigo1.y -= 2;

    if (enemigo1.y < heroe.y - 5)
        enemigo1.y += 2;

    if (enemigo1.x < heroe.x - 60)
    {
        enemigo1.x += 2;
        enemigo1.scaleX = 1;
    }

    if (enemigo1.x > heroe.x + 60)
    {
        enemigo1.x -= 2;
        enemigo1.scaleX = -1;
    }


    enemigo2.x = enemigo2.x - 4;
    if (enemigo2.x < stage_w * -0.2)
        enemigo2.x = stage_w * 1.1;

    enemigo2.y = 400;

    enemigo3.x += 4;

    if (enemigo3.x > stage_w * 1.2)
        enemigo3.x = stage_w * -0.1;

    enemigo3.y = 370;
    
    
    negro1.x += 2;
    if (negro1.x > stage_w*1.2) negro1.x = stage_w * -0.2;

    stage.addChild(fondo);

    stage.addChild(enemigo3);

    stage.addChild(enemigo2);

    stage.addChild(enemigo1);
    
    stage.addChild(negro1);

    stage.addChild(heroe);

    stage.update();


}




init(); // iniciar




