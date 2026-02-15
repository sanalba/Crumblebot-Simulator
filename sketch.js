let nombreArchivoActual='Sin_titulo';
let abiertoCrumble=false;
// ***** Normbres de los últimos archivos externos *****
let ultimoArchivoAza = null;
let ultimoArchivoCrm = null;
// ***** BOTONES DEL MENÚ SUPERIOR *****
let numBotones=8;
let boton = [];
let xBoton = [];
let yBoton = [];
let xBloqueCategoria = [];
let yBloqueCategoria = [];
// ***** ARRAYS PARA BOTONES *****
const BOTON_MENU = [
  ["InputButton", "o", "_ Input/Output "],
  ["SparklesButton", "o", "_ Sparkles "],
  ["ControlButton", "o", "_ Control "],
  ["VariablesButton", "o", "_ Variables "],
  ["OperatorsButton", "o", "_ Operators "],
  ["SmartButton", "o", "_ Smart "],
];

const BOTON_DEL = ["DelButton", "o", "_ X "];
const BOTON_RENAME = ["RenameButton", "o", "_ ✏️ "];
const BOTON_ZOOM_MAS = ["BotonZoom+", "o", "_+"];
const BOTON_ZOOM_MENOS = ["BotonZomm-", "o", "_-"];
const BOTON_VARIABLE = ["VariableBlock", "o", "_ New Var "];
const ANCHO_BOTON = 24;
// ***** ARRAYS PARA LOS SELECTABLES DE LOS BLOQUES *****
const LISTA = [
  ["A", "B", "C", "D", "", "", "", "", "", "", "", ""],
  ["HI", "LO", "", "", "", "", "", "", "", "", "", ""],
  ["1", "2", "", "", "", "", "", "", "", "", "", ""],
  ["FORWARD", "REVERSE", "STOP", "", "", "", "", "", "", "", "", ""],
  ["270º", "SG92R", "", "", "", "", "", "", "", "", "", ""],
  ["MIDDLE", "HIGH", "HIGHEST", "LOWEST", "LOW", "", "", "", "", "", "", ""],
  ["C", "C#/Db", "D", "D#/Eb", "E", "F", "F#/Gb", "G", "G#/Ab", "A", "A#/Bb", "B"]
];

// ***** ARRAY PARA LA NOTACIÓN DE BLOQUES Y ATRIBUTOS DE LOS ARCHIVOS CRUMBLE *****
const NOTACION_CRUMBLE = [
  // Categoría 0
  [
    ["WhenRunBlock"],
    ["DigitalOutputBlock", "pin", "state"],
    ["MotorBlock", "motor", "action", "speed"],
    ["DigitalInputBlock", "pin", "state"],
    ["AnalogueInput", "pin"],
    ["ServoBlock", "pin", "angle"],
    ["ServoBlockType", "pin", "angle", "type"],
    ["ServoOffBlock", "pin"],
    ["DistanceBlock", "trig", "echo"],
  ],
  // Categoría 1
  [
    ["SetSprakleBlock", "address", "colour"],
    ["TurnSprakleOffBlock", "address"],
    ["SetAllSpraklesBlock", "colour"],
    ["TurnAllSpraklesOffBlock"],
    ["SetSprakleRGBBlock", "address", "red", "green", "blue"],
    ["SetAllSparklesRGBBlock", "red", "green", "blue"],

    // ✅ Baton (8 LEDs)
    ["SetSprakleBatonBlock",
      "brush",
      "colour0","colour1","colour2","colour3",
      "colour4","colour5","colour6","colour7"
    ],

    // ✅ Matrix (5x5 = 25 LEDs)
    ["SetSparkleMatrixBlock",
      "brush",
      "colour0","colour1","colour2","colour3","colour4",
      "colour5","colour6","colour7","colour8","colour9",
      "colour10","colour11","colour12","colour13","colour14",
      "colour15","colour16","colour17","colour18","colour19",
      "colour20","colour21","colour22","colour23","colour24"
    ]
  ],
  // Categoría 2
  [
    ["WaitBlock", "time"],
    ["WaitMSBlock", "time"],
    ["WaitUntilBlock", "conditional"],
    ["IfBlock", "conditional"],
    ["IfElseBlock", "conditional"],
    [],
    ["DoUntilBlock", "conditional"],
    ["DoForeverBlock", "conditional"],
    ["DoTimesBlock", "count"]
  ],
  // Categoría 3
  [
    ["AssignmentBlock", "larg", "rarg"],
    ["IncreaseBlock", "larg", "rarg"],
    ["DecreaseBlock", "larg", "rarg"]
  ],
  // Categoría 4
  [
    ["AddBlock", "larg", "rarg"],
    ["SubBlock", "larg", "rarg"],
    ["MultiplyBlock", "larg", "rarg"],
    ["DivideBlock", "larg", "rarg"],
    ["EqualityBlock", "larg", "rarg"],
    ["NotEqualBlock", "larg", "rarg"],
    ["LessThanBlock", "larg", "rarg"],
    ["GreaterThanBlock", "larg", "rarg"],
    ["AndBlock", "larg", "rarg"],
    ["OrBlock", "larg", "rarg"],
    ["NotBlock", "larg", "rarg"],
    ["RandomBlock", "min", "max"]
  ],
  // Categoría 5
  [
    ["SmartDigitsBlock", "pin", "value"],
    ["SmartDigitsOffBlock", "pin"],
    ["SmartTemperatureBlock", "pin"],
    ["SmartPitchBlock", "pin", "value"],
    ["SmartPitchOffBlock", "pin"],
    ["SmartPitchNoteBlock", "pin", "octave", "note", "length"],
    ["SetTempoBlock", "tempo"],
    ["SmartForceZeroBlock", "pin"],
    ["SmartForceBlock", "pin"]
  ]
];

// ***** ARRAY PARA LA CREACIÓN DE BLOQUES DE PROGRAMACIÓN *****
const t = [
  // Categoría 0
  [
    ["WhenRunBlock", "_", "_    Program Start  "],
    ["DigitalOutputBlock", "_", "_set", "0A", "_", "1HI", "_"],
    ["MotorBlock", "_", "_motor", "21", "_", "3FORWARD", "_at ", "o75", "_%"],
    ["DigitalInputBlock", "h", "_", "0A", "_is", "1HI", "_"],
    ["AnalogueInput", "o", "_analogue", "0A", "_"],
    ["ServoBlock", "_", "_servo", "0A", "_", "o0", "_degrees "],
    ["ServoBlockType", "_", "_servo", "0A", "_", "o0", "_degrees type:", "4270º", "_"],
    ["ServoOffBlock", "_", "_servo", "0A", "_Off"],
    ["DistanceBlock", "o", "_ distance (cm) T:", "0A", "_E:", "0A", "_"]
  ],
  // Categoría 1
  [
    ["SetSprakleBlock", "_", "_set sparkle", "o0", "_to ", "*#FF0000", "_"],
    ["TurnSprakleOffBlock", "_", "_turn sparkle", "o0", "_off "],
    ["SetAllSpraklesBlock", "_", "_set all sparkles to", "*#FF0000", "_"],
    ["TurnAllSpraklesOffBlock", "_", "_turn all sparkles off"],
    ["SetSprakleRGBBlock", "_", "_set", "o0", "_to ", "o0", "_", "o0", "_", "o0", "_"],
    ["SetAllSparklesRGBBlock", "_", "_set all sparkles to", "o0", "_", "o0", "_", "o0", "_"],
    ["SetSprakleBatonBlock", "_", "_set baton ", "*#FF0000",
    "*#000000","*#000000","*#000000","*#000000","*#000000","*#000000","*#000000","*#000000"],
    ["SetSparkleMatrixBlock", "_", "_set matrix ", "*#FF0000",
      "*#000000","*#000000","*#000000","*#000000","*#000000",
      "*#000000","*#000000","*#000000","*#000000","*#000000",
      "*#000000","*#000000","*#000000","*#000000","*#000000",
      "*#000000","*#000000","*#000000","*#000000","*#000000",
      "*#000000","*#000000","*#000000","*#000000","*#000000"]
  ],
  // Categoría 2
  [
    ["WaitBlock", "_", "_wait", "o1.0", "_seconds"],
    ["WaitMSBlock", "_", "_wait", "o100", "_ milliseconds"],
    ["WaitUntilBlock", "_", "_wait until", "h  ", "_"],
    ["IfBlock", "_", "_if", "h", "_then "],
    ["IfElseBlock", "_", "_if", "h", "_then "],
    ["ElseBlock", "_", "_else           "],
    ["DoUntilBlock", "_", "_do until ", "h", "_"],
    ["DoForeverBlock", "_", "_do forever"],
    ["DoTimesBlock", "_", "_do", "o10", "_times"]
  ],
  // Categoría 3
  [
    ["AssignmentBlock", "_", "_let", "o", "_=", "o0", "_"],
    ["IncreaseBlock", "_", "_increase", "o", "_by", "o1", "_"],
    ["DecreaseBlock", "_", "_decrease", "o", "_by", "o1", "_"],
    ["AddNewVariableButton", "o", "_    Add new variable    "]
  ],
  // Categoría 4
  [
    ["AddBlock", "o", "_", "o0", "_+", "o0", "_"],
    ["SubBlock", "o", "_", "o0", "_-", "o0", "_"],
    ["MultiplyBlock", "o", "_", "o0", "_*", "o0", "_"],
    ["DivideBlock", "o", "_", "o0", "_/", "o0", "_"],
    ["EqualityBlock", "h", "_", "o0", "_=", "o0", "_"],
    ["NotEqualBlock", "h", "_", "o0", "_≠", "o0", "_"],
    ["LessThanBlock", "h", "_", "o0", "_<", "o0", "_"],
    ["GreaterThanBlock", "h", "_", "o0", "_>", "o0", "_"],
    ["AndBlock", "h", "_", "h0", "_and", "h0", "_"],
    ["OrBlock", "h", "_", "h0", "_or", "h0", "_"],
    ["NotBlock", "h", "_ not", "h", "_"],
    ["RandomBlock", "o", "_ random", "o0", "_to", "o10", "_"]
  ],
  // Categoría 5
  [
    ["SmartDigitsBlock", "_", "_digits crumb on", "0A", "_: display", "o0", "_ "],
    ["SmartDigitsOffBlock", "_", "_digits crumb on", "0A", "_: turn off"],
    ["SmartTemperatureBlock", "_", "_temperature on", "0A", "_ in Cº"],
    ["SmartPitchBlock", "_", "_pitch on", "0A", "_: play", "o440", "_Hz tone"],
    ["SmartPitchOffBlock", "_", "_pitch on", "0A", "_: turn off"],
    ["SmartPitchNoteBlock", "_", "_pitch on", "0A", "_: play", "5MIDDLE", "_", "6C", "_ for", "o1", "_ beats"]
  ]
];

const numCategorias = t.length; // Obtiene el nº de categorías del array t
// ***** RESOLUCIÓN Y ORIENTACIÓN DE PANTALLA *****
let LOGIC_WIDTH;
let LOGIC_HEIGHT;
let orientacionActual;
let windowWidthActual;
let windowHeightActual;
let escalaDispositivo=1;
// ***** MENÚ y MODO *****
menu = 0;
modo = 5;
let estaAbierto;
// ***** FUENTE DE TEXTO *****
let Font1;
let grosorFont;
// Variables generales relacionadas con el Mouse
let offsetX, offsetY;
let transformedX, transformedY; // Coordenadas de lo seleccionado en el sistema transformado (con pan y zoom)
let transformedXbasico, transformedYbasico;
let mouseOrigenX, mouseOrigenY; // Almacena las coordenadas del puntero del ratón de un elemento al hacer click para su arrastre
// ***** BLOQUES *****
let codigo = [];
let codigoMenu = [];
let codigoCategoria = [];
let botonesVariables = [];
let bloquesSeleccionados = []; // Los bloques en esta LISTA se redibujan siempre
let grosorBloquesSeleccionados;
let bloquesNoSeleccionados = []; // Los bloques en esta LISTA son estáticos y se redibujan en ocasiones
let bloquesVirtuales = [];
let codigoVariables = [];
let botonCrearVariable;
let bloquesStart = []; // Guarda los bloques PROGRAM START existentes en el escenario
let bloqueStartSeleccionado;//Bloque estar seleccionado para su ejecución
let bloqueEjecutando;//Bloque que se está ejecutando en un momento dado
let numBloques = []; // Para almacenar el número de bloques que tiene cada categoría
let colorBloq = []; // Array de colores para los bloques en función de su categoría
let desplegableBloque = false;
let bloqueSeleccionado = null; // Almacena el bloque que está seleccionado para el desplazamiento
const SEPARACION_BLOQUES_MENU = 8;
let seleccion = null, seleccion2 = null, seleccion3 = null, seleccion4 = null; // Sirve para determinar qué bloque va a ser seleccionado
let seleccionSubBloque; // Indica el índice de subBloque seleccionado dentro de un bloque
let xFlecha, yFlecha; // Coordenadas de la flecha que indica el bloque 
let xDesplegable, yDesplegable; // Coordenadas del desplegable para duplicar/borrar
let inicioDesplazarBloque = false; // Para detectar si un bloque sobre el que hemos pinchado ha sido desplazado
// ***** MENÚS *****
const BORDE_MENU = 5;//Borde extra del menú
const ALTO_MENU_SUPERIOR = 35;//Alto del menú SUPERIOR que contiene los botones del MODO y del ZOOM
let anchoMenu = [];//Ancho del MENÚ IZQUIERDO
let altoMenu = [];//Alto del MENÚ IZQUIERDO
let anchoRect=0;//Anncho del recuadro que contiene el MENÚ IZQUIERDO
let panningMenuBloques = false;
let panMenuBloquesY = 0;//PANEADO VERTICAL de los bloques del MENÚ IZQUIERDO
let panStartMenuBloquesY = 0;
const ALTO_COMIENZO_BLOQUES = 110;//Coordenada en la que empiezan los bloques del MENÚ IZQUIERDO
let input; //Cuadro de texto para modificar valores de los bloques del escenario
// ***** PANEADO Y ZOOM EN EL MODO EDICIÓN DE BLOQUES *****
let panCodigoX = 0, panCodigoY = 0;
let panningCodigo = false;
let panStartCodigoX = 0, panStartCodigoY = 0;
let zoomCodigo = 1.0;
// ***** PANEADO Y ZOOM EN EL MODO SIMULACIÓN *****
let panSimulacionX = 0, panSimulacionY = 0;
let panStartSimulacionX = 0, panStartSimulacionY = 0;
let panningSimulacion = false;
let zoomSimulacion = 0.5;
// ***** PANEADO Y ZOOM EN EL MODO CONFIGURACIÓN *****
let panConfiguracionX = 0, panConfiguracionY = 0;
let panningConfiguracion = false;
let panStartConfiguracionX = 0, panStartConfiguracionY = 0;
let zoomConfiguracion = 0.75;
// ***** FÍSICAS *****
const Engine = Matter.Engine;
const World = Matter.World;
const Bodies = Matter.Bodies;
const Body = Matter.Body;
const Vertices = Matter.Vertices;
const Composite = Matter.Composite;
let engine, world;
let robot;
let fisicaActiva = true;
let p5Canvas;  // Variable para guardar el canvas
// ***** ESCENARIO *****
let fondo; // Imagen del fondo para el modo de SIMULACIÓN
let nombreFondo = "";
let anchoTapete = 2362;
let altoTapete = 1143;
let anchoMundo = 8000;
let altoMundo = 8000;
// ***** ROBOT *****
let desplazandoRobot = false;
let robotSeleccionado = false;
let robotPequeño;
let robotPequeñoUltrasonidos;
let robotGrande;
let robotVisible = true;
const LARGO_IMAGEN_ROBOT = 257;
const ANCHO_IMAGEN_ROBOT = 164;
const ANCHO_ROBOT = 645;
const ALTO_ROBOT = 600;
let CrumX, CrumY;//Coordenadas del robot mientras lo estamos desplazando con el ratón
let CrumblebotAnteriorX = 0, CrumblebotAnteriorY = 0;
// Para el movimiento del robot
const MAX_SPEED = 5000;
const MAX_WHEEL_SPEED = 500;
// ***** JUMPER *****
let jumpers = [];
let jumperSeleccionado = null;
// ***** CABLES *****
let conector = [];
let conectorSeleccionado = null;
// ***** GPIOS *****
let conectorGPIO = [];
let gpio = [];
let elemento = [];
let letraGPIO = [];
let letrasGPIOs = ['A', 'B', 'C', 'D'];
let nomenclaturaElementos = [];
// ***** OBSTÁCULOS *****
let obstaculo = [];
let laterales = [];
let lateralesVisibles=true;
let obstaculoInicio = [];
let obstaculoDesplazando = null;
let obstaculoSeleccionado = null;
let offsetAngulo = 0;
let anguloInicial = 0;
let transformedObstaculoX = 0, transformedObstaculoY = 0;
let RectX, rectY; //Coordenadas del obstáculo cuando lo estamos desplazando con el ratón
// ***** ULTRASONIDOS *****
let ultrasonic;
const ANCHO_ULTRASONIC = 200;
const ALTO_ULTRASONIC = 105;
let ULTRASONIC_X = 0, ULTRASONIC_Y = 0;
let ultrasonidos;
const ANCHO_ULTRASONIDOS = 330;
const ALTO_ULTRASONIDOS = 76;
let ULTRASONIDOS_X = 0, ULTRASONIDOS_Y = 0;
let radio = 0;
let ruidoTiempo = 0;       // variable global que evoluciona
const ruidoVelocidad = 0.05;  // controla la rapidez del temblor
const ruidoIntensidad = 24;    // amplitud del “jitter” de la onda
let anguloOnda = 0;
// ***** SENSOR REFLEXIVO B/N *****
const DIST_SENSOR_BN = 436.68 * 150 / 590;
const ANGULO_SENSOR_BN = 0.221;
// ***** SENSOR LDR PARA CAPTAR LA LUZ AMBIENTAL *****
const DIST_LDR = 506.41 * 150 / 590;
const ANGULO_LDR = 0.489;
// ***** LEDS *****
let colorLED = new Array(8);
let ledsActivos = 0;
// ***** ZUMBADOR *****
// NOTA: p5.js tiene su propia librería de sonido
// let sine;
let isBeeping = false;
// ***** BOMBILLA *****
let bulb;
let anchoBulb = 0, altoBulb = 0;
let light;
let bulbX = 0, bulbY = 0;
let desplazandoBulb = false;
// ***** HILO DE EJECUCIÓN *****
let ejecutando = false;
let inicio = 0;
let miliSegundos = 0;
let esperarUnCiclo = false;
let saltoIfElse = false;
let movidoDuranteEjecucion = false;
let inicioCrono=0;
let Crono = 0;
let Distancia = 0;
// ***** SELECCIÓN DE COLOR *****
let x = 0, y = 0;
let desplazandoVentanaColor = false;
let currentColor;
let colorPickerOpen = false;
let customColorActivo = false;
let BASIC_COLOR =[];
let BASIC_COLORSeleccionado = 0;
let customColorSeleccionado = 0;
let HSLimage;
const PICKER_X = 220;
const PICKER_Y = 200;
const ANCHO_PICKER = 180;
const ALTO_PICKER = 180;
const ANCHO_MARCO = PICKER_X + ANCHO_PICKER + 30;
const ALTO_MARCO = 310;
let hue = 0, saturation = 0, brightness = 0;
let customColor = new Array(16);
let rgbInputs = [];
let hsbInputs = [];
let mouseColorX = 0, mouseColorY = 0;
// ***** SELECCIÓN DE TAPETE *****
let thumbnails = [];
let anchoThumbnail = 0, altoThumbnail = 0;
let imageFiles = [];
let imageNames = [];
let xPos = [], yPos = [];
let offsetYBarra = 0;
let xPosStart = 0;
let indiceTapeteSeleccionado = 0;
let draggingScrollBar = false;
let dragStartY = 0;
let scrollBarY = 0;
let scrollBarHeight = 0;
let totalThumbnailsHeight = 0;
// ***** MENSAJES *****
let inicioMensaje = 0;
let mensaje = "";
// ***** CUADROS DE EDICIÓN DE TEXTO/DATOS *****
let bloqueEditando = null;
let subBloqueEditando = 0;
let maximoCaracteres = 0;
let textoTemporal = "";
// ***** BUFFERS *****
let bufferEfectos;
let bufferMenuSuperior;
// ***** ESCALA GENERAL *****
let escalaBase = calcularEscala();
// ***** SONIFO ******
let osc;
//Para incrementos
let inc;
// Borrar al finalizar el proyecto
let cont = 0;

thumbnailsPorFila = 4;
espacioEntreThumbs = 20;
anchoThumbnail = 150;
altoThumbnail = 150;
let archivosSVG = [
  "ángulos.svg",
  "circuito.svg", 
  "óvalo.svg",
  "rayas1.svg",
  "rayas2.svg", 
  "rebote.svg",
];
let resultadoSeleccion;
let logoPath = 'assets/images/logoAzzaiteros.png';

function preload() {
  Matter = window.Matter;
  robotGrande=loadImage('assets/images/CrumblebotXL.png');
  robotPequeño=loadImage('assets/images/CrumblebotXLIcono.png');
  robotPequeñoUltrasonidos=loadImage('assets/images/CrumblebotXLIcono2.png');
  ultrasonidos=loadImage('assets/images/Ultrasonidos.png');
  ultrasonic=loadImage('assets/images/UltrasonidosFrontal.png');
  bulb=loadImage('assets/images/bulb.png');
  HSLimage=loadImage('assets/images/HSL.png');
  //logo=loadImage(logoPath);
  boton = new Array(numBotones);
  for (let i = 0; i < numBotones; i++) {
    boton[i] = loadImage(`assets/images/botones/boton${i}.png`);
  }
  cargarTapetes();
}

let cargadas = 0;

function cargarTapetes() {
  thumbnails = new Array(archivosSVG.length);
  cargadas = 0;
  for (let i = 0; i < archivosSVG.length; i++) {
    let filename = archivosSVG[i];
    loadImage(
      "assets/images/escenarios/" + filename,
      img => {
        let thumb = img.get(); // clona la imagen
        thumb.resize(150, 150);
        thumbnails[i] = thumb;

        cargadas++;
        if (cargadas === archivosSVG.length) {
          calcularThumbnails();
        }
      }
    );
  }
  indiceTapeteSeleccionado = -1;
  offsetYBarra = 0;
}


function calculateLogicScale() {
  // Escalar lógica a tamaño de pantalla
  //escalaBase = max(windowWidth / LOGIC_WIDTH, windowHeight / LOGIC_HEIGHT)*escalaDispositivo;
  //escalaBase = (windowHeight / LOGIC_HEIGHT)*escalaDispositivo;
  //escalaBase = max(windowWidth / LOGIC_WIDTH, windowHeight / LOGIC_HEIGHT)*escalaDispositivo;
  escalaBase = (windowWidth/LOGIC_WIDTH)*escalaDispositivo;
  calcularThumbnails();
  crearMenuSuperior();
  if (bloqueEditando!=null) cerrarEdicionTexto();
}

function windowResized() {
    // Si hay un input abierto, ignorar el resize (viene del teclado)
  if (document.querySelector('input[type="text"]')) {
    console.log('Input abierto, ignorando resize');
    return;
  }
  resizeCanvas(windowWidth, windowHeight- ALTURA_MENU);
  windowWidthActual=windowWidth;
  windowHeightActual=windowHeight;
  //pixelDensity(displayDensity());
  pixelDensity(1);
  calculateLogicScale();
  redraw();
}

let primerPlay = false;
function setup() {
  document.body.classList.add('loading');
  appLista=false;
  crearMenuHTML();
  bufferMenuSuperior = createGraphics(windowWidth,ALTO_MENU_SUPERIOR);
  bufferMenuSuperior.colorMode(RGB, 255);
  //Crea un sonido de oscilador (timbre)
  //Muy importante. Los audios en p5.js sólo pueden activarse con un evento
  osc = new p5.Oscillator('sine');
  osc.amp(0);
  osc.freq(440);     // frecuencia (La)
   // PRIMERO crear el canvas y guardarlo
  p5Canvas = createCanvas(windowWidth, windowHeight - ALTURA_MENU);
  pixelDensity(displayDensity());
  // Deshabilitar menú contextual (usar p5Canvas.elt)
  p5Canvas.elt.addEventListener('contextmenu', function(event) {
    event.preventDefault();
    return false;
  }); 
  //Deshabilitar gestos de los dispositivos móviles con los dedos
  deshabilitarGestosMóviles() 
// Listener global en el canvas real
  p5Canvas.elt.addEventListener('mousedown', () => {
    cerrarMenus();
  });
  LOGIC_WIDTH = windowWidth;
  LOGIC_HEIGHT = windowHeight - 50;
  calculateLogicScale();
  //pixelDensity(1);
  smooth(8);
  // Crear motor Matter.js
  engine = Engine.create();
  world = engine.world;
  world.gravity.y = 0;
  Matter.Common.setDecomp(decomp);
  //***** INPUT *******/
  input = createInput();
  input.style('text-align', 'center');
  input.style('border', '1px solid grey');
  input.style('z-index', '10'); // asegurarse que está encima
  input.style('outline', 'none');  // elimina el borde azul al foco
  //***** ROBOT *****
  for (let i = 0; i < 8; i++) {
    colorLED[i] = null;
  }
  // Define las coordenadas de los LEDs
  let angleLED = -46.5;
  let xLED = new Array(8);
  let yLED = new Array(8);
  inc = 0;
  for (let i = 0; i < 9; i++) {
    angleLED -= 8.7;
    if (i == 4) inc = -1;
    else {
      //colorLED[i + inc] = null;
      xLED[i + inc] = 365 * cos(radians(angleLED));
      yLED[i + inc] = 80 + 365 * sin(radians(angleLED));
    }
  }
  angleLED = 43;
  let AxLED = new Array(8);
  let AyLED = new Array(8);
  inc = 0;
  for (let i = 0; i < 9; i++) {
    angleLED -= 8.6;
    if (i == 4) inc = -1;
    else {
      AxLED[i + inc] = 30 + 95 * cos(radians(angleLED));
      AyLED[i + inc] = 95 * sin(radians(angleLED));
    }
  }
  // Crea las instancias del robot
  robot = new Robot(0, 0, xLED, yLED); // Crea la instancia del robot grande estático (modo CONFIGURACIÓN)
  // Crear robot físico
  robotFisico = new DifferentialRobot(0, 0, 264, 154, AxLED, AyLED);
  Composite.add(world, robotFisico.body); // Asegúrate de añadir el .body
  // DEFINE LOS COLORES DE LOS BLOQUES
  colorBloq = [
    color(0, 122, 255),    // Azul oscuro
    color(88, 86, 214),    // Morado
    color(255, 149, 0),    // Naranja
    color(200, 110, 223),  // Violeta
    color(76, 217, 100),   // Verde
    color(16, 160, 160)    // Azul Turquesa
  ];
  //CONFIGURA LA FUENTE
  textFont('Arial');
  //***** BLOQUES *****
  numBloques = new Array(numCategorias); // Para almacenar el número de bloques que tiene cada categoría
  colorBloq = new Array(8); // Array de colores para los bloques en función de su categoría
  // Configura los colores de cada categoría
  colorBloq[0] = color(0, 122, 255); // Azul oscuro
  colorBloq[1] = color(88, 86, 214); // Morado
  colorBloq[2] = color(255, 149, 0); // Naranja
  colorBloq[3] = color(200, 110, 223); // Violeta
  colorBloq[4] = color(76, 217, 100); // Verde
  colorBloq[5] = color(16, 160, 160); // Azul Turquesa 
  //***** DIBUJO DE MENÚS *****
  anchoMenu = new Array(numCategorias);
  altoMenu = new Array(numCategorias); 
  //***** OBSTÁCULOS *****
  obstaculo = []; // LISTA in situ de obstáculos
  obstaculoInicio = [];
  if (fondo!=null && fondo!=undefined) {
    anchoTapete=fondo.width;
    altoTapete=fondo.height;
  }
  //Genera las barreras para los laterales del tapete
  laterales.push(new Obstaculo(0,-altoTapete/2-10,anchoTapete+40,20,0,true));
  laterales.push(new Obstaculo(0,altoTapete/2+10,anchoTapete+40,20,0,true));
  laterales.push(new Obstaculo(-anchoTapete/2-10,0,20,altoTapete,0,true));
  laterales.push(new Obstaculo(anchoTapete/2+10,0,20,altoTapete,0,true));  
  //***** ULTRASONIDOS *****
  ULTRASONIC_X = -ANCHO_ROBOT / 2 - ANCHO_ULTRASONIC / 2; // Coordenadas del sensor
  ULTRASONIC_Y = 50 - ALTO_ROBOT / 2;
  ULTRASONIDOS_X = 0; // Coordenadas del sensor
  ULTRASONIDOS_Y = -ALTO_ROBOT / 2 + 85;
  // Calcula el número de bloques de cada categoría
  for (let i = 0; i < t.length; i++) {
    numBloques[i] = t[i].length;
  }
  //***** BOMBILLA *****
  anchoBulb = 50;
  altoBulb = 59;
  //***** SELECCIÓN DE COLOR *****
  // En p5.js, se usa directamente el array de números
  BASIC_COLOR = [
    color(255, 128, 128), color(255, 255, 128), color(128, 255, 128), color(0, 255, 128),
    color(128, 255, 255), color(0, 128, 255), color(255, 128, 192), color(255, 128, 255),
    color(255, 0, 0), color(255, 255, 0), color(128, 255, 0), color(0, 255, 64),
    color(0, 255, 255), color(0, 128, 192), color(128, 128, 192), color(255, 0, 255), 
    color(128, 64, 64), color(255, 128, 64), color(0, 255, 0), color(0, 128, 128),
    color(0, 64, 128), color(128, 128, 255), color(128, 0, 64), color(255, 0, 128), 
    color(128, 0, 0), color(255, 128, 0), color(0, 128, 0), color(0, 128, 64),
    color(0, 0, 255), color(0, 0, 160), color(128, 0, 128), color(128, 0, 255), 
    color(64, 0, 0), color(128, 64, 0), color(0, 64, 0), color(0, 64, 64),
    color(0, 0, 128), color(0, 0, 64), color(64, 0, 64), color(64, 0, 128),
    color(0, 0, 0), color(128, 128, 0), color(128, 128, 64), color(128, 128, 128),
    color(64, 128, 128), color(192, 192, 192), color(64, 0, 64), color(255, 255, 255)
  ];
  BASIC_COLORSeleccionado = 48;
  customColorSeleccionado = 16;
  hue = 120;
  saturation = 120;
  brightness = 120;
  rgbInputs = ["255", "0", "0"];
  hsbInputs = ["120", "120", "120"];
  //***** SELECCIÓN DE TAPETE *****
  indiceTapeteSeleccionado = -1; 
  //***** CUADROS DE EDICIÓN DE TEXTO/DATOS *****
  textoTemporal = ""; // Variable temporal que almacena lo que se está escribiendo in situ
  let cantidadGPIOS = 9;
  conectorGPIO = new Array(cantidadGPIOS); // Instancias de los conectores GPIO
  gpio = new Array(cantidadGPIOS); // Instancias de los GPIOs (contienen las letras)
  elemento = new Array(cantidadGPIOS); // Instancias de los elementos (sensores/actuadores)
  letraGPIO = new Array(4); // Instancias letras que serán asignadas a las instancias GPIO
  letrasGPIOs = ['A', 'B', 'C', 'D']; // Letras para los GPIOs
  nomenclaturaElementos = ["SONIC", "LIGHT1", "LINE1", "BUZZ", "SW1", "LDRs", "SW2", "LIGHT2", "LINE2"];
  // Crea los 2 conectores de los jumpers
  for (let i = 0; i < 4; i++) { // 4 parejas de conectores (jumpers)
    for (let j = 0; j < 2; j++) { // 2 conectores por cable
      conector.push(new Conector());
    }
  }
  // Crea los 2 conectores de los cables
  for (let i = 0; i < 4; i++) { // 4 parejas de conectores (cables)
    for (let j = 0; j < 2; j++) { // 2 conectores por cable
      conector.push(new Conector());
    }
  }
  // Crea los 4 jumpers
  for (let i = 0; i < 4; i++) {
    jumpers.push(new Jumper(0, 0, conector[i * 2], conector[i * 2 + 1], false, color(255, 255, 0)));
  }
  // Crea los 4 cables
  let colorCable = [color(255, 0, 0), color(255, 0, 255), color(0, 0, 255), color(0, 255, 255)];
  for (let i = 0; i < 4; i++) {
    jumpers.push(new Jumper(0, 0, conector[(i + 4) * 2], conector[(i + 4) * 2 + 1], true, colorCable[i]));
  }
  // Asocia conectores con Jumpers
  for (let i = 0; i < 8; i++) {
    conector[i * 2].jumperAsociado = jumpers[i];
    conector[i * 2 + 1].jumperAsociado = jumpers[i];
  }
    // Crea las 4 LetrasGPIOs
  for (let i = 0; i < letraGPIO.length; i++) {
    letraGPIO[i] = new Letra(letrasGPIOs[i]);
  }
  // Crea todo lo relacionado con los GPIOs
  let leftX = -165, leftY = -158;
  let rightX = 165, rightY = -140;
  inc = 11 * escalaBase; // distancia desde el centro del conector GPIO
  // Los 5 GPIOs de la izquierda
  for (let i = 0; i < 5; i++) {
    elemento[i] = new Elemento(leftX - inc, leftY + i * 18, nomenclaturaElementos[i]);
    let letraProvisional;
    if (i < 3) {
      letraProvisional = letraGPIO[0];
    } else {
      letraProvisional = letraGPIO[1];
    }
    gpio[i] = new GPIO(leftX + inc, leftY + i * 18, letraProvisional);
    conectorGPIO[i] = new ConectorGPIO(leftX, leftY + i * 18);
  }
  // Los 4 GPIOs de la derecha
  for (let i = 0; i < 4; i++) {
    elemento[i + 5] = new Elemento(rightX + inc, rightY + i * 18, nomenclaturaElementos[i + 5]);
    let letraProvisional;
    if (i < 2) {
      letraProvisional = letraGPIO[3];
    } else {
      letraProvisional = letraGPIO[2];
    }
    gpio[i + 5] = new GPIO(rightX - inc, rightY + i * 18, letraProvisional);
    conectorGPIO[i + 5] = new ConectorGPIO(rightX, rightY + i * 18);
  }
  // Asigna los GPIOs a las letras
  for (let i = 0; i < letraGPIO.length; i++) {
    if (i == 0) {
      for (let j = 0; j < 3; j++) {
        letraGPIO[i].gpioLetra.push(gpio[j]); // .add() en Processing -> .push() en p5.js
      }
    } else if (i == 1) {
      for (let j = 0; j < 2; j++) {
        letraGPIO[i].gpioLetra.push(gpio[j + 3]);
      }
    } else if (i == 2) {
      for (let j = 0; j < 2; j++) {
        letraGPIO[i].gpioLetra.push(gpio[j + 5]);
      }
    } else if (i == 3) {
      for (let j = 0; j < 2; j++) {
        letraGPIO[i].gpioLetra.push(gpio[j + 7]);
      }
    }
  }
  // Reseta conectores, jumpers y obstáculos
  eliminarConfiguracion();
  // ***** BOTONES DEL MENÚ *****
  for (let i = 0; i < numBotones; i++) {
    yBoton[i] = ALTO_MENU_SUPERIOR  / 2;
  }
  // Establece las coordenadas X de los botones para seleccionar el modo
  for (let i = 3; i < numBotones - 2; i++) {
    if (i == 3) {
      xBoton[3] = 20 + boton[0].width / 2;
    } else {
      xBoton[i] = xBoton[i - 1] + boton[i - 1].width / 2 + boton[i].width / 2 + 10;
    }
  }
  // Establece las coordenadas X de los botones de ejecución
  for (let i = 0; i < 3; i++) {
    if (i == 0) {
      xBoton[0] = xBoton[numBotones - 3] + 75;
    } else {
      xBoton[i] = xBoton[i - 1] + boton[i - 1].width / 2 + boton[i].width / 2 + 10;
    }
  }
  // Establece las coordenadas X de los botones para el ZOOM
  xBoton[6] = boton[6].width;
  xBoton[7] = xBoton[6]+boton[6].width*1.25;
  // ***** BOTONES DE LAS CATEGORÍAS *****
  let xMenu = 10; // Posición X inicial del primer botón 
  let yMenu = ALTO_MENU_SUPERIOR / 2; // Posición Y inicial del primer botón (centro del menú superior)
  let anchoMinimoMenu = 0;
  codigoCategoria = []; // Asegúrate de inicializar como array vacío si no está hecho
  for (let i = 0; i < BOTON_MENU.length; i++) {
    if (i % 3 == 0) {
      xMenu = 10;
      yMenu += 30;
    } else {
      if (codigoCategoria.length > 0) {
        let ultimo = codigoCategoria[codigoCategoria.length - 1];
        xMenu = xMenu + ultimo.ancho + 5;
      } else {
        xMenu = 10 + 5;
      }
    }
    let nuevoBloque = new Bloque(xMenu, yMenu, i, 300, BOTON_MENU[i], true, false);
    codigoCategoria.push(nuevoBloque);
    let actual = codigoCategoria[codigoCategoria.length - 1];
    if (actual.x + actual.ancho + 10 > anchoMinimoMenu) {
      anchoMinimoMenu = actual.x + actual.ancho + 10;
    }
  }
 //***** BLOQUES DEL MENÚ LATERAL IZQUIERDO *****
  for (let i = 0; i < codigoCategoria.length; i++) {
    let separacion;
    let anchoBloque = 0;
    let categoria = t[i];
    for (let j = 0; j < categoria.length; j++) {
      codigoMenu.push(new Bloque(10, 0, i, j, categoria[j], false, false));
      if (codigoMenu[codigoMenu.length - 1].nombre == "ElseBlock") {
        separacion = 0;
        if (codigoMenu.length >= 2) {
          codigoMenu[codigoMenu.length - 1].anterior = codigoMenu[codigoMenu.length - 2];
          codigoMenu[codigoMenu.length - 2].siguiente = codigoMenu[codigoMenu.length - 1];
        }
      } else {
        separacion = SEPARACION_BLOQUES_MENU;
      }
      if (j > 0 && codigoMenu.length >= 2 && codigoMenu[codigoMenu.length - 2].nombre == "WhenRunBlock") {
        separacion += 15;
      }
      if (j == 0) {
        codigoMenu[codigoMenu.length - 1].y = codigoCategoria[codigoCategoria.length - 1].y + codigoCategoria[codigoCategoria.length - 1].grosorTotal * 1.75;
      } else {
        codigoMenu[codigoMenu.length - 1].y = codigoMenu[codigoMenu.length - 2].y + codigoMenu[codigoMenu.length - 2].grosorTotal + separacion;
      }
      if (codigoMenu[codigoMenu.length - 1].ancho > anchoBloque) {
        anchoBloque = codigoMenu[codigoMenu.length - 1].ancho;
      }
      if (anchoBloque > anchoMinimoMenu) {
        anchoMenu[i] = anchoBloque + BORDE_MENU * 2;
      } else {
        anchoMenu[i] = anchoMinimoMenu;
      }
    }
    altoMenu[i] = codigoMenu[codigoMenu.length - 1].y + codigoMenu[codigoMenu.length - 1].grosorTotal + 10;
  }
  for (let i = 0; i < codigoCategoria.length; i++) {
    altoMenu[i] = altoMenu[i] * escalaBase;
    anchoMenu[i] = anchoMenu[i] * escalaBase;
  }
  for (let variable of codigoMenu) {
    variable.calcularVerticesBloque();
  }
  //***** Crea las VARIABLES desde la t a la z
  for (let i = 0; i < 7; i++) crearVariable(String.fromCharCode(116 + i));
  //***** BUFFER para la onda de ULTRASONIDOS *****
  bufferEfectos = createGraphics(windowWidth, windowHeight / 2);
  //***********/
  botonReiniciar();
  document.body.classList.remove('loading');
  appLista=true;
  // Al final de setup(), después de todo:
  setTimeout(() => {
    console.log('🔧 Forzando redibujado completo...');
    loop(); // Activar temporalmente
    setTimeout(() => {
      // Forzar varios frames
      for (let i = 0; i < 5; i++) {
        setTimeout(() => {
          redraw();
        }, i * 50);
      }
      // Volver a noLoop
      setTimeout(() => {
        noLoop();
        console.log('✅ Redibujado completado');
      }, 300);
    }, 100);
  }, 500);
}

//*******************************DRAW***********************************************/
function draw() { 
  if (bloquesStart.length>0 && bloqueStartSeleccionado==null && bloqueStartSeleccionado==undefined) {
    bloqueStartSeleccionado=bloquesStart[0];
  }
  //Para móviles
  let nuevaOrientacion = (width > height) ? "horizontal" : "vertical";
  if (nuevaOrientacion !== orientacionActual) {
    orientacionActual = nuevaOrientacion;
    windowResized() ;
  }
  if (windowWidth!=windowWidthActual || windowHeight!=windowHeightActual) {
    windowResized();
  }
  //***** BUCLE PRINCIPAL PARA EJECUCIÓN DE BLOQUES *****
  // Sólo se ejecuta en los modos CONFIGURACIÓN Y SIMULACIÓN
  if (ejecutando && (modo == 3 || modo == 5)) {
    isBeeping=comprobarBuzzer();
    if (modo == 5) Crono+= 1 / 60;
    if (miliSegundos>0) miliSegundos-= 1000 / 60;
    if (miliSegundos<=0) {
      if (bloqueEjecutando == null || bloqueEjecutando == undefined ) {
        if (robotFisico.potMotor[0] == 0 && robotFisico.potMotor[1] == 0) {
          botonStop();
        }
      } else {
        bloqueEjecutando.ejecutar();
      }
    }
  } //***** MODO SIMULACIÓN *****
  if (modo == 5) {
    if (ejecutando) {//Si se ha pulsado el botón play
      Engine.update(engine);//Actualiza la física
      robotFisico.update();//Actualiza el movimiento del robot;
    }
    for (let elem of elemento) elem.actualizarValor(); 
    background(255);
    fill(255);
    imageMode(CENTER);
    rectMode(CENTER);
    push();
    translate( windowWidth/2, windowHeight/2);
    scale(zoomSimulacion * escalaBase);
    translate(panSimulacionX, panSimulacionY);
    let translate1 = createVector(0, 0);
    let translate2 = createVector(0, 0);
    //Si estamos desplazando el robot con el mouse
    if (desplazandoRobot) {
      transformedX = (mouseX - windowWidth / 2) / (zoomSimulacion * escalaBase) - panSimulacionX;
      transformedY = (mouseY - windowHeight / 2) / (zoomSimulacion * escalaBase) - panSimulacionY;
      translate1.x=-CrumblebotAnteriorX;
      translate1.y=-CrumblebotAnteriorY;
      translate2.x= transformedX + offsetX;
      translate2.y= transformedY + offsetY;
    } // Si el robot está moviéndose o parado
    else {
      translate1.x=- robotFisico.body.position.x;
      translate1.y=- robotFisico.body.position.y;
      translate2.x= robotFisico.body.position.x;
      translate2.y= robotFisico.body.position.y;
    }
    //Dibujo del FONDO
    translate(translate1);
    if (fondo != null && fondo != undefined) image(fondo, 0, 0);
    // Dibujo de los obstáculos, barreras y laterales
    if (lateralesVisibles) {
      for (let o of laterales) o.dibujar();
    }
    for (let o of obstaculo) o.dibujar();
    if (obstaculoDesplazando != null) obstaculoDesplazando.dibujar(); 
    //Dibujo del ROBOT
    translate(translate2);
    robotFisico.dibujar();
    // Dibujo de los efectos del ULTRASONIDO
    if (robot.ultrasonidosConectado && ejecutando) {
      push();
      imageMode(CORNER);
      rotate(anguloOnda - robotFisico.body.angle);
      image(
        bufferEfectos,
        0,
        -bufferEfectos.height / 2 / zoomSimulacion,
        bufferEfectos.width / zoomSimulacion,
        bufferEfectos.height / zoomSimulacion
      );
      bufferEfectos.push();
      bufferEfectos.translate(0, bufferEfectos.height / 2);
      bufferEfectos.scale(zoomSimulacion);
      bufferEfectos.strokeWeight(3);
      bufferEfectos.noFill();
      const lectura = letraGPIO[0].valorLetra;
      const maxLectura = 400;
      const FOV = radians(7.5);
      const colorOnda = (lectura >= maxLectura) ? bufferEfectos.color(255, 0, 0) : bufferEfectos.color(0, 255, 0);
      const capas = 5;
      const pasoRadio = 45;
      // ⚡ avance real
      radio += pasoRadio;
      // ⏱️ avanzar ruido suavemente
      ruidoTiempo += ruidoVelocidad;
      for (let i = 0; i < capas; i++) {
        // 🌫️ ruido ultrasónico suave
        const ruido = noise(ruidoTiempo + i * 0.35);
        const jitter = map(ruido, 0, 1, -ruidoIntensidad, ruidoIntensidad);
        const r = radio - i * pasoRadio + jitter;
        if (r <= 0) continue;
        // 🔥 dfuminado de onda
        const t = constrain(r / 2000, 0, 1);
        const alphaDist = 255 * pow(1 - t, 2.8);
        const alphaEco  = map(i, 0, capas - 1, 255, 60);
        const alphaFinal = min(alphaDist, alphaEco);
        bufferEfectos.stroke(red(colorOnda),green(colorOnda),blue(colorOnda),alphaFinal);
        bufferEfectos.arc(robotFisico.frontal,0,r*2,r*2,-FOV,FOV);
      }
      if (radio / 10 > maxLectura || radio / 10 > lectura) {
        radio = 0;
        anguloOnda = robotFisico.body.angle;
        bufferEfectos.clear();
      }
      bufferEfectos.pop();
      pop();
    }
    pop();
    fill(0);
    //Dibujo de la BOMBILLA
    push();
    if (!desplazandoBulb) {
      scale(escalaBase);
      image(bulb, (windowWidth/2)/escalaBase, windowHeight/escalaBase - bulb.height*1.5);
    } else {
      translate(mouseX, mouseY);
      scale(escalaBase);
      noStroke();
      for (let i = 0; i < 20; i++) {
        fill(255, 255, 0, 12);
        ellipse(0, 0, i*50, i*50);
      }
    }
    pop();
    //Dibujo de la información y otros elementos del ESCENARIO
    stroke(100);
    strokeWeight(1);
    noFill();
    rectMode(CENTER);
    rect(windowWidth - 205, windowHeight / 2 - 40, 15, 15);
    rect(windowWidth - 125, windowHeight / 2 - 40, 15, 15);
    fill(100);
    ellipse(windowWidth - 205, windowHeight / 2 - 40, 10, 10);
    ellipse(windowWidth - 125, windowHeight / 2 - 40, 10, 10);
    text("SW1", windowWidth - 190, windowHeight / 2 - 40);
    text("SW2", windowWidth - 110, windowHeight / 2 - 40);  
    textAlign(RIGHT, CENTER);
    fill(100);
    ellipse(windowWidth - 210, windowHeight / 2, 5, 5);
    noFill();
    for (let radio = 10; radio < 30; radio += 5) {
      arc(windowWidth - 210, windowHeight / 2, radio, radio, radians(-45), radians(45));
    }
    fill(100);
    if (robot.ultrasonidosConectado && ejecutando) {
      text(elemento[0].valorElemento, windowWidth - 160, windowHeight / 2);
    } else {
      text(0, windowWidth - 160, windowHeight / 2); 
    }
    for (let i = 0; i < 2; i++) {
      push();
      translate(windowWidth - 205 + i * 80, windowHeight / 2 + 30);
      ellipse(0, 0, 10, 10);
      text(int(elemento[1 + i * 6].valorElemento), 45, 0);
      for (let ang = 0; ang < TWO_PI; ang += PI / 4) {
        rotate(ang);
        line(7, 0, 10, 0);
      }
      pop();
    } 
    for (let i = 0; i < 2; i++) {
      fill(100);
      text(int(elemento[2 + i * 6].valorElemento), windowWidth - 160 + i * 80, windowHeight / 2 + 60);
      rect(windowWidth - 210 + i * 80, windowHeight / 2 + 60, 10, 10);
      fill(255);
      rect(windowWidth - 200 + i * 80, windowHeight / 2 + 60, 10, 10);
    } 
    fill(100);
    textAlign(LEFT, CENTER);
    for (let i = 0; i < letraGPIO.length; i++) {
      letraGPIO[i].actualizarValor();
      text(String.fromCharCode(65 + i) + ": " + letraGPIO[i].valorLetra, windowWidth - 210, windowHeight / 2 + 90 + 30 * i);
    }  
    let y = windowHeight / 2 - (codigoVariables.length / 2) * 20;
    for (let variable of codigoVariables) {
      y = y + 20;
      text(variable.texto[0] + ": " + variable.valorNumerico, 65, y);
    }  
    //Dibujo de los botones para AÑDIR OBSTÁCULOS Y BARRERAS
    push();
    translate(windowWidth / 2, 0);
    scale(escalaBase);
    fill(100, 100, 200);
    rect(-90, 90, 160, 30);
    fill(200, 100, 100);
    rect(90, 90, 160, 30);
    fill(255);
    textAlign(CENTER, CENTER);
    text("AÑADIR OBSTÁCULO", -90, 90);
    text("AÑADIR BARRERA", 90, 90);
    pop();
  } //***** MODO EDICIÓN DE BLOQUES *****
  else if (modo == 4) {
    dibujarBloques();
    if (colorPickerOpen && bloqueEditando) {
      push();
        translate(windowWidth/2, windowHeight/2);
        scale(escalaBase);
        translate(-ANCHO_MARCO/2, -ALTO_MARCO/2);
        textSize(12);
        fill(200);
        strokeWeight(1);
        stroke(128);
        textAlign(LEFT, CENTER);
        if (customColorActivo) rect(0, 0, ANCHO_MARCO, ALTO_MARCO);
        else rect(0, 0, PICKER_X, ALTO_MARCO);
        drawColours();//Abre la función que dibuja todo lo referente al selector de color
        if (customColorActivo) drawColorPicker();
      pop();
      textSize(14);
    } // Si hay un DESPLEGABLE en el bloque para clonar o borrar...
    else if (desplegableBloque) {
      push();
      fill(200);
      rect(xDesplegable, yDesplegable, 200 * escalaBase, 50 * escalaBase);
      fill(0);
      textAlign(LEFT, TOP);
      textSize(int(14 * escalaBase));
      text("Duplicate blocks", xDesplegable + 10 * escalaBase, yDesplegable + 10 * escalaBase);
      text("Delete block", xDesplegable + 10 * escalaBase, yDesplegable + 30 * escalaBase);
      textSize(14);
      pop();
    }
  } //***** MODO CONFIGURACIÓN DEL ROBOT *****
  else if (modo == 3) {
    background(254);
    imageMode(CENTER);
    rectMode(CENTER);
    push();
    translate(windowWidth/2, windowHeight/2);
    scale(zoomConfiguracion * escalaBase);
    translate(panConfiguracionX, panConfiguracionY);
    robot.dibujar();
    for (let jumper of jumpers) jumper.dibujar();
    for (let i = 0; i < conector.length; i += 2) conector[i].jumperAsociado.dibujar();
    if (!robot.ultrasonidosConectado) image(ultrasonic, ULTRASONIC_X, ULTRASONIC_Y);
    else image(ultrasonidos, ULTRASONIDOS_X, ULTRASONIDOS_Y);
    noFill();
    strokeWeight(1);
    stroke(128);
    if (ejecutando && isBeeping) {
      for (let i = 10; i < 100; i += 10) {
        let radio = i + random(-5, 5);
        ellipse(-170, 45, radio, radio);
      }
    }
    pop();
  } //*************** MODO SELECCIÓN DE TAPETE *************************************/
  else if (modo == 6) { 
    // Si no hay xPos, calcularlos
    if (!xPos || xPos.length !== thumbnails.length) {
      calcularThumbnails();
    }
    push();
    imageMode(CORNER);
    background(240);
    noFill();
    scale(escalaBase);
    stroke(2);
    rectMode(CORNER);
    // DIBUJAR THUMBNAILS
    for (let i = 0; i < thumbnails.length; i++) {
      // Si el thumbnail existe, dibujarlo
      if (thumbnails[i]) {
        image(thumbnails[i], xPos[i], yPos[i] - offsetYBarra);
      }
      // Dibujar borde
      if (indiceTapeteSeleccionado != i) {
        stroke(128);
        strokeWeight(1);
      } else {
        stroke(255, 0, 0);
        strokeWeight(3);
      }
      rect(xPos[i], yPos[i] - offsetYBarra, anchoThumbnail, altoThumbnail);
    }
    // DIBUJAR BARRA DE SCROLL
    if (totalThumbnailsHeight > windowHeight - 100) {
      // Calcular tamaño y posición del scrollbar
      let visibleRatio = (windowHeight - 100) / totalThumbnailsHeight;
      let scrollBarHeight = (windowHeight - 100) * visibleRatio;
      // Calcular posición (igual que en Processing)
      let scrollBarY = 60 + ((windowHeight - 100 - scrollBarHeight) * 
                    (offsetYBarra / (totalThumbnailsHeight - (windowHeight - 100))));
      // Dibujar barra de scroll
      fill(200); 
      rect(windowWidth - 40, 60, 20, windowHeight - 100);
      fill(150); 
      rect(windowWidth - 40, scrollBarY, 20, scrollBarHeight);
    }  
    pop();
  }
  dibujarNoBloques();  
}

function calcularThumbnails() { 
  let thumbnailsPorFila = 4;
  let espacioEntreThumbs = 20;
  anchoThumbnail = 150;
  altoThumbnail = 150;
  // Inicializar arrays
  xPos = new Array(thumbnails.length);
  yPos = new Array(thumbnails.length);  
  // CALCULAR POSICIONES EN GRID
  for (let i = 0; i < thumbnails.length; i++) {
    // Columna y fila en el grid
    let columna = i % thumbnailsPorFila;
    let fila = Math.floor(i / thumbnailsPorFila);   
    // Calcular posición
    xPos[i] = espacioEntreThumbs + columna * (anchoThumbnail + espacioEntreThumbs);
    // Desplazar Y por el menú superior
    yPos[i] = espacioEntreThumbs + fila * (altoThumbnail + espacioEntreThumbs) + ALTO_MENU_SUPERIOR * escalaBase;
  }   
  // Calcular altura total para scroll
  totalThumbnailsHeight = espacioEntreThumbs + 
                          Math.ceil(thumbnails.length / thumbnailsPorFila) * 
                          (altoThumbnail + espacioEntreThumbs) +
                          ALTO_MENU_SUPERIOR * escalaBase;
}


function dibujarBloques() {
  background(254);
  if (anchoMenu[menu] > anchoMenu[0]) {
    anchoRect = anchoMenu[menu] + 10;
  } else {
    anchoRect = anchoMenu[0] + 10;
  }
  rectMode(CORNER);
  imageMode(CORNER);
  bloquesNoSeleccionados = codigo.filter(item => !bloquesSeleccionados.includes(item));
  for (let bloque of bloquesNoSeleccionados) {
    if (bloque.tipo=='_') bloque.dibujoSub();
    else bloque.dibujoSub();
  }
  fill(205);
  noStroke();
  rect(0, 0, anchoRect * escalaBase, (altoMenu[menu] + 5) * escalaBase);
  push();
  translate(0, panMenuBloquesY);
  for (let bloque of codigoMenu) if (bloque.categoria==menu) bloque.dibujar();
  // Sólo muestra los bloques de las variables si el menú es el de las variables
  for (let bloque of codigoVariables) if (bloque.categoria == 3 && bloque.categoria == menu) bloque.dibujar();
  for (let bloque of botonesVariables) if (bloque.categoria == 3 && bloque.categoria == menu) bloque.dibujar();
  pop();
  rect(0, 0, anchoRect * escalaBase, ALTO_COMIENZO_BLOQUES * escalaBase);
  for (let bloque of codigoCategoria) bloque.dibujar();
  for (let bloque of bloquesSeleccionados) {
    if (bloque.tipo=='_') bloque.dibujoSub();
  }
  if (bloqueSeleccionado != null) {
    bloqueSeleccionado.dibujoSub();//Para que el bloque seleccionado se vea siempre arriba
    if (bloqueSeleccionado.siguiente!=null) {
      if (bloqueSeleccionado.siguiente.nombre=="ElseBlock") {
        bloqueSeleccionado.siguiente.dibujar();
      }
    }
  }
  dibujoFlecha();
}

function dibujarNoBloques() {
  imageMode(CORNER);
  push();
  scale(escalaBase);
  image(bufferMenuSuperior,0,0);
  rectMode(CORNER);
  if (modo == 3 || modo == 5) {
    fill(255);
    stroke(128);
    rect(10, 70, 100, 40);
    rect(10, 115, 100, 40);
    fill(128);
    textAlign(CENTER);
    text("Cronómetro", 55, 85);
    text(nf(Crono, 0, 1) + " seg", 55, 100);
    text("Distancia", 55, 130);
    text(nf(Distancia / 10, 0, 1) + " cm", 55, 145);
  }
  pop();
  if (movidoDuranteEjecucion) {
    fill(255, 0, 0);
    ellipse(windowWidth - 50*escalaBase, windowHeight - 75*escalaBase, 25, 25);
  }
}

function crearMenuSuperior() {
  bufferMenuSuperior.push();
    bufferMenuSuperior.imageMode(CENTER);
    //Dibuja el MENÚ en el que se encuentran los BOTONES del MODO y del ZOOM
    bufferMenuSuperior.fill(205);
    bufferMenuSuperior.noStroke();
    bufferMenuSuperior.rectMode(CORNER);
    bufferMenuSuperior.rect(0, 0, windowWidth, ALTO_MENU_SUPERIOR);
    //Dibujo de los botones de ejecución
    for (let i = 0; i < 3; i++) {
      bufferMenuSuperior.noTint();
      if ( modo==4 || ( (modo==3 || modo==5) && ( ((ejecutando || bloqueEjecutando==null) && i==0) || (!ejecutando && i==1) ))) bufferMenuSuperior.tint(255, 100);
      bufferMenuSuperior.image(boton[i], xBoton[i], yBoton[i]);
    }
    //Dibujo de los botones del modo
    for (let i = 3; i < numBotones - 2; i++) {
      bufferMenuSuperior.noTint();
      if (i == modo) bufferMenuSuperior.tint(255, 100);
      bufferMenuSuperior.image(boton[i], xBoton[i], yBoton[i]);
    }
    bufferMenuSuperior.image(boton[6],windowWidth/escalaBase-xBoton[6], yBoton[6]);
    bufferMenuSuperior.image(boton[7],windowWidth/escalaBase-xBoton[7], yBoton[7]);
  bufferMenuSuperior.pop();
}

function dibujoFlecha() {
  if (bloqueSeleccionado==null) return;
  fill(128, 128, 128, 200);
  let hayFlecha = false;
  if (seleccion4 != null) {
    hayFlecha = true;
    xFlecha = seleccion4.x;
    yFlecha = seleccion4.y;
  } else if (seleccion3 != null) {
    hayFlecha = true;
    xFlecha = seleccion3.x;
    yFlecha = seleccion3.y + seleccion3.grosorTotal;
  } else if (seleccion2 != null) {
    hayFlecha = true;
    xFlecha = seleccion2.x + seleccion2.xDato[seleccionSubBloque];
    yFlecha = seleccion2.y + seleccion2.grosorBloque / 2;
  } else if (seleccion != null) {
    hayFlecha = true;
    if (seleccion.bucle || seleccion.nombre=="WhenRunBlock") {
      xFlecha = seleccion.x+seleccion.anchoLadoIzqBucle;
    } else {
      xFlecha = seleccion.x;
    }
    yFlecha = seleccion.y + seleccion.grosorBloque;
  }
  if (hayFlecha) {
    push();
    translate(windowWidth / 2, windowHeight / 2);
    scale(zoomCodigo * escalaBase);
    translate(panCodigoX, panCodigoY);
    beginShape();
    vertex(xFlecha, yFlecha);
    vertex(xFlecha - 10, yFlecha - 10);
    vertex(xFlecha - 10, yFlecha - 5);
    vertex(xFlecha - 30, yFlecha - 3);
    vertex(xFlecha - 30, yFlecha + 3);
    vertex(xFlecha - 10, yFlecha + 5);
    vertex(xFlecha - 10, yFlecha + 10);
    vertex(xFlecha, yFlecha);
    endShape();
    pop();
  }
}

// Es una de las funciones más complejas
function conectar(origen, destino, esArriba) {
  if (origen != destino) { // Comprobación de seguridad. Evitamos conectar a sí mismo
    let bloquePadre = null; // Variable para guardar el bloque padre del destino
    let inferiorOrigen = bloquesSeleccionados[bloquesSeleccionados.length - 1]; // Este es el último bloque de lo arrastrado
    // Siempre que exista un bloque siguiente en el destino...Si el destino es la parte inferior de un bucle O el destino es un bloque normal
    if (destino.siguiente != null && ((destino.bucle && !esArriba) || !destino.bucle)) {
      destino.siguiente.anterior = inferiorOrigen;
      inferiorOrigen.siguiente = destino.siguiente;
    }
    if (destino.bucle && esArriba) { // Si el destino es la parte superior de un bucle...
      bloquePadre = destino; // El bloque padre para los bloques inferiores al origen será el propio bloque destino
      if (destino.bucleSiguiente != null) {
        destino.bucleSiguiente.anterior = inferiorOrigen; // El bloque anterior del que antes era bucleSiguiente, será el último bloque del conjunto desplazado
        inferiorOrigen.siguiente = destino.bucleSiguiente;
      }
      destino.bucleSiguiente = origen; // El parámetro bucleSiguiente de la parte superior del bucle será el bloque origen
    } else { // Si no es la parte superior de un bucle
      bloquePadre = destino.padre; // El bloque padre para los bloques inferiores al origen será el mismo padre que tiene el bloque destino
    }
    // Si el destino es un bloque normal o el destino es la parte inferior de un bucle
    if (!destino.bucle || (destino.bucle && !esArriba)) {
      origen.anterior = destino; // El bloque superior del arrastrado pasa a ser el bloque destino.
      destino.siguiente = origen; // ahora ya podemos asignar como bloque siguiente del destino el propio bloque que arrastramos.
    }
    // Volvemos a recorrer los bloques inferiores a origen para actualizar sus bloques padres
    let bloque = origen; // Guardamos la referencia del bloque que queremos conectar en una variable.
    origen.padre = bloquePadre;
    while (bloque.siguiente != null) {
      bloque.siguiente.padre = bloquePadre;
      bloque = bloque.siguiente;
    }
    origen.calculoGrosorBucle();
    destino.calculoGrosorBucle();
    destino.actualizarCoordenadas();
    origen.calcularVerticesBloque();
    destino.calcularVerticesBloque()
  } 
  //bloqueSeleccionado = null; // Ya hemos conectado luego deja de haber bloque Seleccionado
}

// Esta función desconecta unos bloques de otros al pinchar sobre ellos y arrastrarlos
function desconectar(origen) {
  if (origen.tipo == '_') {
    if (origen.anterior != null) {
      origen.anterior.siguiente = null; // Si tenía un bloque anterior, Ese bloque anterior se desvincula.
      origen.anterior = null; // El bloque también pierde la referencia al bloque anterior.
    } else if (origen.padre != null) {
      origen.padre.bucleSiguiente = null;
    }
    let bloquePadre = origen.padre; // Si el bloque está en un bucle, guardamos la referencia al bloque padre/bucle.
    origen.padre = null;
    let bloque = origen;
    while (bloque.siguiente != null) { // Vamos a recorrer todos los bloques que hay debajo. Mientras que existan bloques...
      bloque = bloque.siguiente; // Seleccionamos el bloque que hay justamente debajo
      bloque.padre = null; // Ahora ya podemos eliminar la referencia al bloque padre/bucle.
    }
    if (bloquePadre != null) {
      bloquePadre.calculoGrosorBucle();
      bloquePadre.actualizarCoordenadas();
      bloquePadre.calcularVerticesBloque()
      if (bloquePadre.nombre=="ElseBlock") bloquePadre.anterior.calcularVerticesBloque();
    }
  }
}

// Calcula si un número en formato texto tiene el formato de número real
function esNumeroReal(str) {
  try {
    parseFloat(str);
    return !isNaN(parseFloat(str)) && isFinite(str);
  } catch (e) {
    return false;
  }
}

function crearVariable(nombreVariable) {
   let yVariable; 
  // Calcular posición Y
  if (codigoVariables.length === 0) {
    yVariable = botonCrearVariable.y + botonCrearVariable.grosorBloque + SEPARACION_BLOQUES_MENU;
  } else {
    let ultimaVariable = codigoVariables[codigoVariables.length - 1];
    yVariable = ultimaVariable.y + ultimaVariable.grosorBloque + SEPARACION_BLOQUES_MENU;
  }  
  // Crea el bloque de la variable
  let nuevaVariable = new Bloque(10, yVariable, 3, 4, BOTON_VARIABLE, false, false);
  nuevaVariable.texto[0] = nombreVariable;
  nuevaVariable.AxTexto[0] = nuevaVariable.calculoAnchoDato(nuevaVariable.texto[0]);
  nuevaVariable.calculoDimensiones();
  nuevaVariable.dato[0] = "0";
  codigoVariables.push(nuevaVariable);
  // Actualizar altura del menú
  if (codigoMenu.length > 0) {
    let ultimoMenu = codigoMenu[codigoMenu.length - 1];
    altoMenu[3] = yVariable + ultimoMenu.grosorTotal + 10;
  }
  // Crea el bloque DEL asociado a la variable
  let xDel = nuevaVariable.x + nuevaVariable.ancho + 10;
  let botonDel = new Bloque(xDel, yVariable, 3, 100, BOTON_DEL, true, false);
  botonesVariables.push(botonDel);
  // Configurar relaciones
  nuevaVariable.siguiente = botonDel;  // Para poder borrar posteriormente
  botonDel.padre = nuevaVariable;
  // Crea el bloque RENAME asociado a la variable
  let xRename = botonDel.x + botonDel.ancho + 10;
  let botonRename = new Bloque(xRename, yVariable, 3, 200, BOTON_RENAME, true, false);
  botonesVariables.push(botonRename);
  // Configurar relaciones
  botonDel.siguiente = botonRename;  // Para poder borrar posteriormente
  botonRename.padre = nuevaVariable;  // Para poder borrar posteriormente la propia variable
}

function drawColours() {
  const BASIC_COLOR = [
  color(255, 128, 128), color(255, 255, 128), color(128, 255, 128), color(0, 255, 128),
  color(128, 255, 255), color(0, 128, 255), color(255, 128, 192), color(255, 128, 255),
  color(255, 0, 0), color(255, 255, 0), color(128, 255, 0), color(0, 255, 64),
  color(0, 255, 255), color(0, 128, 192), color(128, 128, 192), color(255, 0, 255),
  color(128, 64, 64), color(255, 128, 64), color(0, 255, 0), color(0, 128, 128),
  color(0, 64, 128), color(128, 128, 255), color(128, 0, 64), color(255, 0, 128),
  color(128, 0, 0), color(255, 128, 0), color(0, 128, 0), color(0, 128, 64),
  color(0, 0, 255), color(0, 0, 160), color(128, 0, 128), color(128, 0, 255),
  color(64, 0, 0), color(128, 64, 0), color(0, 64, 0), color(0, 64, 64),
  color(0, 0, 128), color(0, 0, 64), color(64, 0, 64), color(64, 0, 128),
  color(0, 0, 0), color(128, 128, 0), color(128, 128, 64), color(128, 128, 128),
  color(64, 128, 128), color(192, 192, 192), color(64, 0, 64), color(255, 255, 255)
  ];
  fill(0);
  text("Basic colours:", 10, 20);
  strokeWeight(1);
  stroke(128);
  // Dibujo de los colores básicos
  for (let i = 0; i < 48; i++) {
    fill(BASIC_COLOR[i]);
    rect(10 + (i % 8) * 25, 40 + int(i / 8) * 20, 20, 15);
  }
  // Dibujo del borde del color básico seleccionado
  if (BASIC_COLORSeleccionado < 48) {
    stroke(128);
    noFill();
    rect(10 + int(BASIC_COLORSeleccionado % 8) * 25 - 2, 
         40 + int(BASIC_COLORSeleccionado / 8) * 20 - 2, 
         24, 19);
  }
  // Dibujo de los colores customizados
  fill(0);
  text("Custom colours:", 10, 180); 
  for (let i = 0; i < 16; i++) {
    fill(customColor[i]);
    rect(10 + int(i % 8) * 25, 200 + int(i / 8) * 20, 20, 15);
  }
  // Dibujo del borde del color customizado seleccionado
  if (customColorSeleccionado < 16) {
    stroke(128);
    noFill();
    rect(10 + int(customColorSeleccionado % 8) * 25 - 2, 
         200 + int(customColorSeleccionado / 8) * 20 - 2, 
         24, 19);
  }
  // Botón Define Custom Colours (permite definir un color propio)
  fill(200);
  rect(10, 250, 195, 20);
  textAlign(CENTER, CENTER);
  if (customColorActivo) fill(128);
  else fill(0);
  text("Define Custom Colours>>", 120, 260);
  // Botones OK y Cancel y Add to Custom Colours
  fill(200);
  rect(10, 280, 90, 20);
  rect(115, 280, 90, 20);
  fill(0);
  text("OK", 55, 290);
  text("Cancel", 160, 290);
}

function drawColorPicker() {
  let sliderX = PICKER_X + ANCHO_PICKER + 10;
  let sliderY = PICKER_Y;
  let sliderWidth = 10;
  let inputY = PICKER_Y + 15;
  let inputWidth = 30;
  noFill();
  stroke(128);
  rect(PICKER_X, PICKER_Y, 180, -180); 
  // selector de color HS
  imageMode(CORNER);
  if (HSLimage) {
    image(HSLimage, PICKER_X, PICKER_Y - ALTO_PICKER);
  } 
  // Círculo que indica la parte seleccionada
  fill(255);
  stroke(0);
  strokeWeight(1);
  ellipse(PICKER_X + map(hue, 0, 239, 0, ANCHO_PICKER), 
          PICKER_Y - map(saturation, 0, 240, 0, ALTO_PICKER), 
          10, 10);
  // DIBUJO DE LA BARRA DE BRILLO (brightness)
  noStroke();
  for (let y = 0; y < ALTO_PICKER; y++) {
    fill(HSBtoRGB(hue, saturation, map(y, 0, ALTO_PICKER, 0, 240)));
    rect(sliderX, sliderY - y, sliderWidth, 1);
  }
  // Contorno de la barra
  stroke(0);
  noFill();
  rect(sliderX, sliderY, 10, -ALTO_PICKER);
  // Marcador de brillo
  let markerY = sliderY - map(getBrightness(currentColor), 0, 240, 0, ALTO_PICKER);
  stroke(0);
  strokeWeight(2);
  line(sliderX - 5, markerY, sliderX + sliderWidth + 5, markerY);
  fill(0);
  // DIBUJO DE LOS CAMPOS DE TEXTO
  strokeWeight(1);
  textAlign(RIGHT, CENTER);
  text("Hue:", PICKER_X + 88, inputY);
  text("Sat:", PICKER_X + 88, inputY + 20);
  text("Lum:", PICKER_X + 88, inputY + 40);
  text("Red:", PICKER_X + 168, inputY);
  text("Green:", PICKER_X + 168, inputY + 20);
  text("Blue:", PICKER_X + 168, inputY + 40);
  // Campos de entrada RGB
  fill(255);
  stroke(0);
  rect(PICKER_X + 90, inputY - 10, inputWidth, 20); // R
  rect(PICKER_X + 90, inputY + 10, inputWidth, 20); // G
  rect(PICKER_X + 90, inputY + 30, inputWidth, 20); // B
  // Campos de entrada HSB
  rect(PICKER_X + 170, inputY - 10, inputWidth, 20); // H
  rect(PICKER_X + 170, inputY + 10, inputWidth, 20); // S
  rect(PICKER_X + 170, inputY + 30, inputWidth, 20); // B
  // Texto en los campos
  textAlign(LEFT, CENTER);
  fill(0);
  text(rgbInputs[0], PICKER_X + 175, inputY);
  text(rgbInputs[1], PICKER_X + 175, inputY + 20);
  text(rgbInputs[2], PICKER_X + 175, inputY + 40);
  text(hsbInputs[0], PICKER_X + 95, inputY);
  text(hsbInputs[1], PICKER_X + 95, inputY + 20);
  text(hsbInputs[2], PICKER_X + 95, inputY + 40);
  // Botón Add to Custom Colours
  fill(200);
  rect(PICKER_X, 280, ANCHO_PICKER + 20, 20);
  fill(0);
  textAlign(CENTER, CENTER);
  text("Add to Custom Colours", PICKER_X + ANCHO_PICKER / 2, 290);
  // DIBUJA EL COLOR SELECCIONADO
  noStroke();
  // Cambia por:
  fill(colorValido(currentColor));
  //fill(currentColor);
  rect(PICKER_X, PICKER_Y + 10, 50, 40);
}

function updateColor() {
  rgbInputs[0] = str(int(red(currentColor)));
  rgbInputs[1] = str(int(green(currentColor)));
  rgbInputs[2] = str(int(blue(currentColor)));
  hsbInputs[0] = str(int(getHue(currentColor)));
  hsbInputs[1] = str(int(getSaturation(currentColor)));
  hsbInputs[2] = str(int(getBrightness(currentColor)));
}

function colorValido(c) {
  try {
    // Si ya es válido, usarlo
    let test = red(c);
    if (!isNaN(test)) return c;
  } catch (e) {
    // Si falla, crear uno nuevo
  }
  
  // Si currentColor es array [h,s,b]
  if (Array.isArray(c) && c.length >= 3) {
    return HSBtoRGB(c[0], c[1], c[2]);
  }
  
  // Si currentColor es array [r,g,b]
  if (Array.isArray(c) && c.length >= 3) {
    return color(c[0], c[1], c[2]);
  }
  
  // Por defecto
  return color(255, 255, 255);
}

function extraerRGB(c) {
  if (!c) return {r:0, g:0, b:0};
  try {
    if (Array.isArray(c) && c.length >= 3) return {r:c[0], g:c[1], b:c[2]};
    if (c.r !== undefined) return {r:c.r, g:c.g, b:c.b};
    if (typeof red === 'function') return {r:red(c), g:green(c), b:blue(c)};
    return {r:0, g:0, b:0};
  } catch(e) {
    return {r:0, g:0, b:0};
  }
}

function RGBtoHSB(r, g, b) {
  r = constrain(r, 0, 255)/255;
  g = constrain(g, 0, 255)/255;
  b = constrain(b, 0, 255)/255;
  let maxVal = max(r, g, b);
  let minVal = min(r, g, b);
  let delta = maxVal - minVal;
  let h = 0;
  if (delta !== 0) {
    if (maxVal === r) h = ((g - b)/delta) % 6;
    else if (maxVal === g) h = (b - r)/delta + 2;
    else h = (r - g)/delta + 4;
    h = (h * 60 + 360) % 360;
  }
  let bCrumble = (maxVal + minVal)/2.0;
  let sCrumble = delta !== 0 ? delta/(1 - abs(2 * bCrumble - 1)) : 0;
  return [map(h, 0, 360, 0, 239), sCrumble * 240, bCrumble * 240];
}

function HSBtoRGB(h, s, b) {
  // Asegurar valores válidos
  h = constrain(h, 0, 239);
  s = constrain(s, 0, 240);
  b = constrain(b, 0, 240);
  
  let hNorm = (h % 240)/239.0 * 360.0;
  let sNorm = s/240.0;
  let bNorm = b/240.0;
  
  let c = (1 - Math.abs(2 * bNorm - 1)) * sNorm;
  let x = c * (1 - Math.abs((hNorm/60) % 2 - 1));
  let m = bNorm - c/2;
  
  let r, g, bVal;
  if (hNorm < 60) { r = c; g = x; bVal = 0; }
  else if (hNorm < 120) { r = x; g = c; bVal = 0; }
  else if (hNorm < 180) { r = 0; g = c; bVal = x; }
  else if (hNorm < 240) { r = 0; g = x; bVal = c; }
  else if (hNorm < 300) { r = x; g = 0; bVal = c; }
  else { r = c; g = 0; bVal = x; }
  
  // DEVOLVER OBJETO COLOR DE P5.JS CORRECTAMENTE
  return color(
    Math.round(constrain((r + m) * 255, 0, 255)),
    Math.round(constrain((g + m) * 255, 0, 255)),
    Math.round(constrain((bVal + m) * 255, 0, 255))
  );
}

function colorAHex(c) {
  let rgb = extraerRGB(c);
  return "#" + hex(rgb.r, 2) + hex(rgb.g, 2) + hex(rgb.b, 2);
}

function getBrightness(c) {
  let rgb = extraerRGB(c);
  let hsb = RGBtoHSB(rgb.r, rgb.g, rgb.b);
  return hsb[2];
}

function getHue(c) {
  let rgb = extraerRGB(c);
  let hsb = RGBtoHSB(rgb.r, rgb.g, rgb.b);
  return hsb[0];
}

function getSaturation(c) {
  let rgb = extraerRGB(c);
  let hsb = RGBtoHSB(rgb.r, rgb.g, rgb.b);
  return hsb[1];
}

function calcularEscala() {
  const anchoActual = window.innerWidth;
  const altoActual = window.innerHeight;
  const escalaX = anchoActual / 1366;
  const escalaY = altoActual / 768;
  // Tomamos la escala más pequeña para que todo quepa en pantalla
  const escala = Math.min(escalaX, escalaY);
  return escala;
}

function deshabilitarGestosMóviles() {
  let canvas = document.querySelector('canvas');
  if (!canvas) return;
  
  // Configurar solo para el canvas, NO para toda la pantalla
  canvas.style.touchAction = 'none';
  canvas.style.webkitTouchCallout = 'none';
  canvas.style.userSelect = 'none';
  
  // Prevenir gestos solo en el canvas, no interferir con el menú
  canvas.addEventListener('touchstart', function(e) {
    // Solo prevenir si el target es el canvas o si hay múltiples toques
    if (e.target === canvas && e.touches.length > 1) {
      e.preventDefault();
    }
  }, { passive: false });
  
  canvas.addEventListener('touchmove', function(e) {
    // Solo prevenir si el target es el canvas
    if (e.target === canvas) {
      e.preventDefault();
    }
  }, { passive: false });
}

function habilitarMenuTactil() {
  console.log('Habilitando menú táctil...');
  const menu = document.getElementById('menu-bar');
  if (!menu) {
    console.error('No se encontró el menú');
    return;
  }
  
  // Configurar el menú para recibir eventos táctiles
  menu.style.touchAction = 'auto';
  menu.style.pointerEvents = 'auto';
  menu.style.zIndex = '1000';
  
  // LIMPIAR todos los onclick de HTML y añadir event listeners
  const menuButtons = document.querySelectorAll('.menu-button');
  console.log('Procesando botones:', menuButtons.length);
  
  menuButtons.forEach((button, index) => {
    // Guardar el texto del botón para saber qué menú abrir
    const buttonText = button.textContent.trim();
    console.log(`Configurando botón ${index}: "${buttonText}"`);
    
    // Eliminar onclick del HTML
    button.removeAttribute('onclick');
    
    // Determinar qué menú debe abrir
    let menuId = '';
    if (buttonText.includes('Archivo')) {
      menuId = 'archivo-menu';
    } else if (buttonText.includes('Configuración')) {
      menuId = 'config-menu';
    }
    
    // Añadir event listeners
    button.addEventListener('touchstart', function(e) {
      e.preventDefault();
      e.stopPropagation();
      console.log('Touchstart en botón:', buttonText);
      toggleMenu(menuId);
      return false;
    }, { passive: false });
    
    button.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      console.log('Click en botón:', buttonText);
      toggleMenu(menuId);
    });
    
    // Feedback visual al tocar
    button.addEventListener('touchstart', function() {
      this.style.backgroundColor = '#3a3d41';
    }, { passive: true });
    
    button.addEventListener('touchend', function() {
      this.style.backgroundColor = '';
    }, { passive: true });
    
    button.addEventListener('touchcancel', function() {
      this.style.backgroundColor = '';
    }, { passive: true });
  });
  
  // Procesar items del dropdown
  setTimeout(() => {
    const dropdownItems = document.querySelectorAll('.dropdown-item');
    console.log('Procesando items dropdown:', dropdownItems.length);
    
    dropdownItems.forEach((item, index) => {
      // Guardar el onclick original
      const originalOnClick = item.getAttribute('onclick');
      if (originalOnClick) {
        console.log(`Item ${index}: "${item.textContent.trim()}" -> ${originalOnClick}`);
        
        // Eliminar onclick del HTML
        item.removeAttribute('onclick');
        
        // Añadir event listeners
        item.addEventListener('touchstart', function(e) {
          e.preventDefault();
          e.stopPropagation();
          console.log('Touchstart en item:', this.textContent.trim());
          
          // Ejecutar la función original
          ejecutarFuncionDesdeString(originalOnClick);
          
          // Cerrar todos los menús después de un pequeño delay
          setTimeout(cerrarTodosMenus, 100);
          return false;
        }, { passive: false });
        
        item.addEventListener('click', function(e) {
          e.preventDefault();
          e.stopPropagation();
          console.log('Click en item:', this.textContent.trim());
          ejecutarFuncionDesdeString(originalOnClick);
          setTimeout(cerrarTodosMenus, 100);
        });
        
        // Feedback visual
        item.addEventListener('touchstart', function() {
          this.style.backgroundColor = '#3a3d41';
        }, { passive: true });
        
        item.addEventListener('touchend', function() {
          this.style.backgroundColor = '';
        }, { passive: true });
      }
    });
  }, 200); // Pequeño delay para asegurar que los dropdowns existen
}

// Función auxiliar para ejecutar funciones desde string
function ejecutarFuncionDesdeString(funcString) {
  console.log('Ejecutando:', funcString);
  try {
    // Manejar casos especiales
    if (funcString.includes('toggleBarrerasLaterales')) {
      if (typeof toggleBarrerasLaterales === 'function') {
        toggleBarrerasLaterales();
      }
    } else if (funcString.includes('setModoVisualizacion')) {
      const match = funcString.match(/'([^']+)'/);
      if (match && typeof setModoVisualizacion === 'function') {
        setModoVisualizacion(match[1]);
      }
    } else {
      // Evaluar la función de forma segura
      const func = new Function('return ' + funcString.replace(/^.*?\(/, 'function(').replace(/\)$/, ')'));
      func().call(window);
    }
  } catch (e) {
    console.error('Error ejecutando función:', e, 'String:', funcString);
  }
}

// Función auxiliar para ejecutar funciones desde string
function ejecutarFuncionDesdeString(funcString) {
  try {
    // Extraer el nombre de la función y sus argumentos
    const match = funcString.match(/([^(]+)\(([^)]*)\)/);
    if (match) {
      const funcName = match[1].trim();
      const args = match[2].split(',').map(arg => 
        arg.trim().replace(/['"]/g, '')
      ).filter(arg => arg);
      
      if (typeof window[funcName] === 'function') {
        window[funcName](...args);
      }
    }
  } catch (e) {
    console.error('Error ejecutando función:', e);
  }
}

function comprobarBuzzer() {
  if (elemento[3].conectorElemento != null) {
    let otroConector = elemento[3].conectorElemento.jumperAsociado.devolverOtroExtremo(elemento[3].conectorElemento);
    if (otroConector && otroConector.gpioConectado != null) {
      let letraAsociada = otroConector.gpioConectado.letraAsociada;
      let valor = max(letraAsociada.valorOutput, letraAsociada.valorLetra);
      if (valor > 127) {
        osc.amp(0.5);
        return true;
      } else if (valor < 128) {
        osc.amp(0);
        return false;
      }  
    }
  }
  // ❌ Falta un return si no se cumple ninguna condición
  return false; // AÑADE esto
}

//Centra el código en la pantalla
function centrarCodigo() {
  for (let bloque of codigo) {  // ❌ Este primer bucle sobra
    let sumaX = 0;
    let sumaY = 0;
    let total = codigo.length;
    for (let bloque of codigo) {  // ✅ Este es el correcto
      sumaX += bloque.x;
      sumaY += bloque.y;
    }
    // 2️⃣ Calcular la media
    let mediaX = sumaX / total;
    let mediaY = sumaY / total;
    // 3️⃣ Desplazar todos los bloques
    for (let bloque of codigo) {
      bloque.x -= mediaX;
      bloque.y -= mediaY;
    } 
  } // ❌ Esta llave cierra el primer for que sobra
  panCodigoX=0;
  panCodigoY=0;
}

// ✅ Versión corregida:
function centrarCodigo() {
  if (codigo.length === 0) return;
  
  let sumaX = 0;
  let sumaY = 0;
  
  for (let bloque of codigo) {
    sumaX += bloque.x;
    sumaY += bloque.y;
  }
  
  let mediaX = sumaX / codigo.length;
  let mediaY = sumaY / codigo.length;
  
  for (let bloque of codigo) {
    bloque.x -= mediaX;
    bloque.y -= mediaY;
  }
  
  panCodigoX = 0;
  panCodigoY = 0;
}

