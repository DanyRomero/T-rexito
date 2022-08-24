//agregar el evento click al boton

let btnStart = document.querySelector(".start");
btnStart.addEventListener("click", () =>{
 iniciarJuego();  
} )

//ID interval
let idInterval;

//Imagenes
const trexito = new Image();
trexito.src = "trex1.webp";
const cactusImg = new Image();
cactusImg.src = "cactus1.webp";
const huesoImg = new Image();
huesoImg.src = "hueso.png"

// sprites
const cero = new Image();
cero.src = "0.gif";
const uno = new Image();
uno.src = "1.gif";
const dos = new Image();
dos.src = "2.gif";
const tres = new Image();
tres.src = "3.gif";
const cuatro = new Image();
cuatro.src = "4.gif";
const cinco = new Image();
cinco.src = "5.gif";
const seis = new Image();
seis.src = "6.gif";
const siete = new Image();
siete.src = "7.gif";

const sprites = [cero, uno, dos, tres, cuatro, cinco, seis, siete];
let posicion = 0;

//seleccional el canvas
let lienzo = document.getElementById("lienzo")
let ctx = lienzo.getContext("2d");

//lista de enemigos 
const nopalitos = [];
const huesos = [];

//Nuestro Personaje --> class
class Trex{
    constructor(x,y,w,h, color, vida, imagen){
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.color = color;
        this.vida = vida;
        this.imagen = imagen
        this.saltando = false;
        this.score = 0;
    }
    avanzar(){
        if(this.x + this.w < 330){
            this.x += 10;
        }   
    }
    retroceder(){
        if(this.x > 0){
               this.x -= 10; 
        }
        
    }
    saltar(){
        if(this.x < 250){
            this.saltando = true;
        }
    }
    dibujarse(){
        ctx.fillStyle = this.color;
        //ctx.fillRect(this.x, this.y, this.w, this.h);
        //dibujar la imagen
        ctx.drawImage(this.imagen,this.x, this.y, this.w, this.h)
    }
    disparar(){
        const huesito = new Hueso(this.x + this.w, this.y + 10, 20, 40, huesoImg);
        huesos.push(huesito);
       
    }
}         

//crar enemigo.. cactus
class Cactus{
    constructor(x,y,w,h,imagen,nivel){
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.imagen = imagen;
        this.nivel = nivel;
    }
    dibujarse(){
        ctx.fillStyle = "green";
        //.fillRect(this.x,this.y,this.w,this.h);
        ctx.drawImage(this.imagen,this.x,this.y,this.w,this.h);
        if (this.nivel === "facil"){
            this.x -= 1;
        } else {
            this.x -= 3;
        }
        
    }
}

//crear Balas--huesitos
class Hueso{
    constructor(x,y,w,h,imagen){
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.imagen = imagen;
    }
    dibujarse(){
        ctx.fillStyle = "green";
        //ctx.fillRect(this.x,this.y,this.w,this.h);
        ctx.drawImage(this.imagen,this.x,this.y,this.w,this.h);
        this.x += 3;
    }
}
//Dibujar piso
function dibujarPiso(){
    ctx.beginPath();
    ctx.moveTo(0,170);
    ctx.lineTo(330, 170);
    ctx.stroke();
    ctx.closePath();
}
dibujarPiso();

//Mostrar nombre del juego
function mostrarDatos(distancia, score, vida){
    ctx.fillStyle = "black";
    ctx.font ="24px arial";
    ctx.fillText("T-rexito",130,20);
    //distancia
    ctx.fillText(`${distancia}m`, 20,20);
    //score
    ctx.fillText(`Score: ${score}`,230,20)
    ctx.fillText(`Vida: ${vida}`,220,50)

}



//escuchar teclas
function teclas(dino){
    document.addEventListener("keyup", (evento) =>{
        //console.log("Tecla tocada", evento.code);
        switch(evento.code) {
            case "Space":
            dino.saltar();
            break;
            case "ArrowRight":
            dino.avanzar();
            break;
            case "ArrowLeft":
            dino.retroceder();
            break;
            case "KeyF":
            dino.disparar();
            break;

        } 
    })
}

function crearCactus(){
    const num = Math.floor(Math.random()*100);
    if(num === 3) {
        const cactus = new Cactus(300,130,30,60,cactusImg,"facil");
        nopalitos.push(cactus);
    }
}

function iniciarJuego(){
    let distancia = 0;
    let score = 0;
    const dino = new Trex(20,130,30,60,"green",100,cero);
    teclas(dino);
   
   // AQUI SE REDIBUJA TODO EL VIDEOJUEGO (se llaman las funciones de dibujarse)
    idInterval = setInterval(()=>{
        ctx.clearRect(0,0,330,210);
        //mostrarDatos
        mostrarDatos(distancia,dino.score,dino.vida);
        distancia +=1
        dibujarPiso();

      ;

        dino.imagen = sprites[posicion];
        posicion++;
        if(posicion === 8){
            posicion = 0
        }
        
        dino.dibujarse();

        //esta saltando? y "gravedad"
        if(dino.saltando === true){
            //altura max de salto
            if(dino.y > 0){
                dino.y -= 5;
                dino.x += 5;
            }else{
                
                dino.saltando = false;
            }  
        } 

        //no esta saltando?
        if(dino.saltando === false && dino.y < 130){
            dino.y += 15;
            dino.x += 5;
        }
        
        //dibujar enemigos, elementos xtra
        nopalitos.forEach((cactus, index) =>{
            cactus.dibujarse();
            if(cactus.x <= dino.x + dino.y && cactus.x >= dino.x){

            }
            if(cactus.x <= dino.x + dino.w && 
               cactus.x >= dino.x &&
               cactus.y <= dino.y + dino.h
               
               ){

               //eleiminar el elemento de nopalitos (enemigo)
                //array.splice
                nopalitos.splice(index,1);
                dino.vida -= 25;
                if(dino.vida < 25){
                    clearInterval(idInterval);
                }
            }
        })
        //Proyectil
    huesos.forEach((hueso, hIndex) => {
        hueso.dibujarse();
        nopalitos.forEach((cactus, cIndex) => {
          if (hueso.x + hueso.w >= cactus.x) {
            // quitar el hueso y el cactus
            huesos.splice(hIndex, 1);
            nopalitos.splice(cIndex, 1);
            dino.score += 1;
          }
        });
      });

        crearCactus();
    },1000/30)
}


//iniciarJuego();


//pantalla de inicio

//agregar imagen trex

//crear cactus

//brincar

//recibir daño

//contador de avance

//t rex dispare

//socore

//perder

//sonido

//ganar

//reiniciar juego
