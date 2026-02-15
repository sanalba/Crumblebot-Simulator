let appLista = false;
function mousePressed() {
  if (mouseButton === LEFT) {
    handleLeftClick(mouseX, mouseY);
  } else if (mouseButton === RIGHT) {
    handleRightClick(mouseX, mouseY);
  }
  return false;
}

/*function touchStarted() {
  // Verificar si hay toques
  if (touches.length === 0) return true;
  
  const touch = touches[0];
  const canvas = document.querySelector('canvas');
  const menu = document.getElementById('menu-bar');
  
  if (!canvas || !menu) return true;
  
  // Obtener rectángulos de los elementos
  const canvasRect = canvas.getBoundingClientRect();
  const menuRect = menu.getBoundingClientRect();
  
  // DEBUG: Mostrar coordenadas
  console.log('📱 TOUCH:', {
    touchX: touch.x,
    touchY: touch.y,
    canvasRect: {
      left: canvasRect.left,
      top: canvasRect.top,
      right: canvasRect.right,
      bottom: canvasRect.bottom
    }
  });
  
  // 1. Verificar si el toque está en el menú
  if (touch.y >= menuRect.top && touch.y <= menuRect.bottom) {
    console.log('📍 Toque en MENÚ, ignorar para canvas');
    return true; // Dejar que el menú maneje el evento
  }
  
  // 2. Verificar si el toque está dentro del canvas
  if (touch.x >= canvasRect.left && touch.x <= canvasRect.right && 
      touch.y >= canvasRect.top && touch.y <= canvasRect.bottom) {
    
    // CONVERTIR coordenadas: de absolutas a relativas al canvas
    const canvasX = touch.x - canvasRect.left;
    const canvasY = touch.y - canvasRect.top;
    
    console.log('🎯 Toque en CANVAS convertido:', {
      absolutas: { x: touch.x, y: touch.y },
      relativas: { x: canvasX, y: canvasY },
      dentro: true
    });
    
    // Llamar a handleLeftClick con las coordenadas convertidas
    handleLeftClick(canvasX, canvasY + ALTURA_MENU);
    return false; // Prevenir comportamiento por defecto
  }
  
  console.log('❌ Toque fuera del canvas');
  return true;
}*/

function handleLeftClick(xMouse, yMouse) {
  if (!appLista) return;
  pixel=get(xMouse,yMouse);
  // Si hemos pinchado en la pantalla. Si había un bloque que se estaba editando se cierra.
  if (bloqueEditando !== null && !colorPickerOpen) cerrarEdicionTexto();
    pixel=get(xMouse,yMouse);
    //Si se pincha en el fondo blanco se comienza el paneado
    if (pixel[0] == 254 && pixel[1] == 254 && pixel[2] == 254) {
      if (modo==4) {
        panningCodigo = true;
        panStartCodigoX=xMouse;
        panStartCodigoY=yMouse;
        return;
      } else if (modo==3) {
        panningConfiguracion = true;
        panStartConfiguracionX=xMouse;
        panStartConfiguracionY=yMouse;
        return;
      }
    }
    transformedXbasico = xMouse / escalaBase;
    transformedYbasico = yMouse / escalaBase;
    console.log(windowWidth,"   ",windowHeight);
    console.log(transformedXbasico,"   ",transformedYbasico);
    console.log(xBoton[6]);
    // Si se pincha en los botones del menú superior
    for(let i = 3; i < numBotones - 2; i++) {    

      if (transformedXbasico > xBoton[i] - boton[i].width/2 && 
        transformedXbasico < xBoton[i] + boton[i].width/2 && 
        transformedYbasico > yBoton[i] - boton[i].height/2 && 
        transformedYbasico < yBoton[i] + boton[i].height/2) {      
        if (modo !== i) {
          modo = i; 
          crearMenuSuperior();
          return;
        }
      }
    }
    // Si se pincha en el botón - o + (ZOOM)
    for(let i = 6; i < 8; i++) { 
      if (xMouse > windowWidth-(xBoton[i] + ANCHO_BOTON/2)*escalaBase && 
          xMouse <  windowWidth-(xBoton[i] - ANCHO_BOTON/2)*escalaBase && 
          yMouse > (yBoton[i] - ANCHO_BOTON/2)*escalaBase && 
          yMouse < (yBoton[i] + ANCHO_BOTON/2)*escalaBase) {
          if (i==6) zoom(-0.25); else zoom(0.25);
          return;
      } 
    }
    // Si se pincha en los botones PLAY, PARAR O REFRESCAR
    for(let i = 0; i < 3; i++) { 
      if (transformedXbasico > xBoton[i] - ANCHO_BOTON / 2 && 
        transformedXbasico < xBoton[i] + ANCHO_BOTON / 2 && 
        transformedYbasico > yBoton[i] - ANCHO_BOTON / 2 && 
        transformedYbasico < yBoton[i] + ANCHO_BOTON / 2) {       
        if (robot.ultrasonidosConectado) {
          radio = 0;
          bufferEfectos.clear();
        }       
        // Si se pulsa el botón PLAY
        if (i === 0 && !ejecutando && (modo==3 || modo==5)) {
          if (primerPlay==false) {
            primerPlay=true;
            userStartAudio(); // 🔑 desbloqueo (una sola vez)
            osc.start();
            osc.amp(0);
          }
          botonPlay();
        // Si se pulsa el botón PARAR
        } else if (i === 1 && ejecutando) {
          osc.amp(0);
          botonStop();
        // Si se pulsa el botón REINICIAR
        } else if (i === 2) {
          osc.amp(0);
          botonReiniciar();
        }
        return;
      }
    }
    if (modo == 5) { // MODO SIMULACIÓN
      if (ejecutando) {
        //Pulsación den los botones SW1 y SW2
        if (distanciaAlCuadrado(xMouse,yMouse,windowWidth-205,windowHeight/2-40)<100) {
          elemento[4].valorElemento=255; return;
        } else if (distanciaAlCuadrado(xMouse,yMouse,windowWidth-125,windowHeight/2-40)<100) {
          elemento[6].valorElemento=255; return;
        }
      } else if (!ejecutando) {
        // Convertir coordenadas del mouse considerando PAN y ZOOM
        transformedX=(xMouse-windowWidth/2)/(zoomSimulacion*escalaBase)-panSimulacionX;
        transformedY=(yMouse-windowHeight/2)/(zoomSimulacion*escalaBase)-panSimulacionY;
        transformedObstaculoX=(xMouse-windowWidth/2)/(zoomSimulacion*escalaBase)-panSimulacionX+robotFisico.body.position.x;
        transformedObstaculoY=(yMouse-windowHeight/2)/(zoomSimulacion*escalaBase)-panSimulacionY+robotFisico.body.position.y;   
        transformedXbasico=(xMouse-windowWidth/2)/escalaBase;
        transformedYbasico=(yMouse-0)/escalaBase;
        //Si se pincha en el botón AÑADIR OBSTÁCULO
        if (transformedXbasico > -90-80 && transformedXbasico < -90+80 && transformedYbasico > 75 && transformedYbasico < 105) {         
          //Crear nuevo obstáculo
          let nuevoObstaculo = new Obstaculo(
            transformedX + robotFisico.body.position.x, 
            transformedY + robotFisico.body.position.y, 
            80, 80, 0, false
          );          
          obstaculo.push(nuevoObstaculo);    
          offsetX=nuevoObstaculo.body.position.x-transformedX;//Distancia entre ratón y punto de referencia del subBloque
          offsetY=nuevoObstaculo.body.position.y-transformedY;
          RectX=nuevoObstaculo.body.position.x; 
          RectY=nuevoObstaculo.body.position.y; 
          obstaculoSeleccionado = null;
          obstaculoDesplazando = nuevoObstaculo; // ¡IMPORTANTE! No uses esto con MouseConstraint           
          robotSeleccionado=null;
          movidoDuranteEjecucion = true;       
          return; 
        }
        //Si se pincha en el botón AÑADIR BARRERA
        if (transformedXbasico>90-80 && transformedXbasico<90+80 && transformedYbasico>75 && transformedYbasico<105) { 
          let nuevaBarrera = new Obstaculo(
            transformedX + robotFisico.body.position.x, 
            transformedY + robotFisico.body.position.y, 
            80, 80, 0, true
          );          
          obstaculo.push(nuevaBarrera);    
          offsetX=nuevaBarrera.body.position.x-transformedX;//Distancia entre ratón y punto de referencia del subBloque
          offsetY=nuevaBarrera.body.position.y-transformedY;
          RectX=nuevaBarrera.body.position.x; 
          RectY=nuevaBarrera.body.position.y; 
          obstaculoSeleccionado = null;
          obstaculoDesplazando = nuevaBarrera; // ¡IMPORTANTE! No uses esto con MouseConstraint           
          robotSeleccionado=null;
          movidoDuranteEjecucion = true;       
          return; 
        }
        //Si se pincha en cualquier obstáculo del tablero del robot
        //Si hay un obstáculo seleccionado podemos girarlo o agrandarlo (obtenemos el modo según donde se pinche)
        if (obstaculoSeleccionado!=null) {
          obstaculoSeleccionado.modoTransformacion=obstaculoSeleccionado.colision();  
          if (obstaculoSeleccionado.modoTransformacion>0 && obstaculoSeleccionado.modoTransformacion<6) {
            obstaculoSeleccionado.body.isStatic=true;
            if (obstaculoSeleccionado.modoTransformacion == 1) { // Para giro
              let anguloInicial = atan2(transformedObstaculoY - obstaculoSeleccionado.body.position.y, transformedObstaculoX - obstaculoSeleccionado.body.position.x);
              offsetAngulo = anguloInicial - obstaculoSeleccionado.body.angle;
              obstaculoSeleccionado.body.isStatic=true;
            }   
          } else {
            obstaculoSeleccionado.body.isStatic=obstaculoSeleccionado.estatico;
            obstaculoSeleccionado=null;
          }
          return;
        }      
        // Revisa si se ha pinchado sobre alguno de los obstáculos del escenario...
        for (let variable of obstaculo) {
          if (variable.colision()==6) {
            if (Crono>0) movidoDuranteEjecucion=true;
            offsetX=variable.body.position.x-transformedX;
            offsetY=variable.body.position.y-transformedY;
            obstaculoDesplazando=variable;
            RectX=obstaculoDesplazando.body.position.x; 
            RectY=obstaculoDesplazando.body.position.y; 
            obstaculoSeleccionado=null;
            movidoDuranteEjecucion = true;   
            return;
          }
        }
        //Revisa si se ha pinchado sobre el robot
        resultadoSeleccion=robotFisico.colision();
        //Si se pincha en el robot...
        if (robotSeleccionado) {
          obstaculoSeleccionado=null;
          if (resultadoSeleccion==1) { 
            let anguloInicial=atan2(transformedY,transformedX);
            offsetAngulo=anguloInicial-robotFisico.body.angle;
            return;
          } else if (resultadoSeleccion==0) { 
            robotSeleccionado=false;
            return;
          }
        }
        if (resultadoSeleccion==2){
          desplazandoRobot=true;
          robotFisico.body.isStatic=true;
          robotSeleccionado=false;
          offsetX=robotFisico.body.position.x-transformedX;//Distancia entre ratón y origen del robot
          offsetY=robotFisico.body.position.y-transformedY;
          CrumblebotAnteriorX=robotFisico.body.position.x;
          CrumblebotAnteriorY=robotFisico.body.position.y;
          CrumX=robotFisico.body.position.x; 
          CrumY=robotFisico.body.position.y; 
          return;
        }
      }
      //Pulsación en la bombilla
      if (xMouse>windowWidth/2 - bulb.width/2*escalaBase
         && xMouse<windowWidth/2 + bulb.width/2*escalaBase
         && yMouse>windowHeight- (bulb.height*1.5+bulb.height/2)*escalaBase
         && yMouse<windowHeight- (bulb.height*1.5-bulb.height/2)*escalaBase) { 
        bulbX = windowWidth/2 - robotFisico.body.position.x;
        bulbY = windowHeight - bulb.height*1.5 - robotFisico.body.position.y;
        offsetX = bulbX - transformedXbasico;//Distancia entre ratón y punto de referencia del subBloque
        offsetY = bulbY - transformedYbasico;
        desplazandoBulb=true;
        return;
      } //Si no, es porque se ha pinchado en la pantalla...
      else if (!ejecutando) {
        panningSimulacion=true;
        panStartSimulacionX=xMouse;
        panStartSimulacionY=yMouse;
      } 
      return;
    }
    // MODO EDICIÓN DE BLOQUES (modo == 4)
    else if (modo == 4 ) {
      // Convertir coordenadas del mouse considerando PAN y ZOOM
      if (colorPickerOpen && bloqueEditando) {
        mouseColorX = (xMouse - windowWidth/2)/escalaBase + ANCHO_MARCO/2;
        mouseColorY = (yMouse - windowHeight/2)/escalaBase + ALTO_MARCO/2;
        // Lógica de selección de color
        let pickerMouseX = xMouse - (windowWidth/2 - ANCHO_MARCO/2 * escalaBase);
        let pickerMouseY = yMouse - (windowHeight/2 - ALTO_MARCO/2 * escalaBase);
        let scaledX = pickerMouseX/escalaBase;
        let scaledY = pickerMouseY/escalaBase;
        // Selector principal
        if (mouseColorX >= PICKER_X && mouseColorX <= PICKER_X + ANCHO_PICKER && 
            mouseColorY >= PICKER_Y - ALTO_PICKER && mouseColorY <= PICKER_Y) {
          hue = map(mouseColorX - PICKER_X, 0, ANCHO_PICKER, 0, 239);
          saturation = map(PICKER_Y - mouseColorY, 0, ALTO_PICKER, 0, 240);
          currentColor = HSBtoRGB(hue, saturation, getBrightness(currentColor));
          updateColor();
          return;
        }
        // Deslizador de brillo
        let sliderX = PICKER_X + ANCHO_PICKER + 10;
        if (mouseColorX >= sliderX && mouseColorX <= sliderX + 10 && 
            mouseColorY >= PICKER_Y - ALTO_PICKER && mouseColorY <= PICKER_Y) {
          brightness = map(PICKER_Y - mouseColorY, 0, ALTO_PICKER, 0, 240);
          currentColor = HSBtoRGB(getHue(currentColor), getSaturation(currentColor), brightness);
          updateColor();
          return;
        }
        
        // Botón "Define Custom Colours"
        if (scaledX > 10 && scaledX < 205 && scaledY > 250 && scaledY < 270) {
          customColorActivo = !customColorActivo;
          return;
        }      
        // Botón "OK"
        if (scaledX > 10 && scaledX < 100 && scaledY > 280 && scaledY < 300) {
          colorPickerOpen = false;
          bloqueEditando.dato[subBloqueEditando] = colorAHex(currentColor);
          console.log(bloqueEditando.dato[subBloqueEditando]);
          bloqueEditando = null;
          return;
        }    
        // Botón "Cancel"
        if (scaledX > 115 && scaledX < 205 && scaledY > 280 && scaledY < 300) {
          colorPickerOpen = false;
          bloqueEditando = null;
          return;
        }
        
        // Selección de color básico
        if (scaledX > 10 && scaledX < 210 && scaledY > 40 && scaledY < 160) {
          let col = int((scaledX - 10)/25);
          let fila = int((scaledY - 40)/20);
          if (col >= 0 && col < 8 && fila >= 0 && fila < 6) {
            BASIC_COLORSeleccionado = fila * 8 + col;
            currentColor = BASIC_COLOR[BASIC_COLORSeleccionado];
            updateColor();
          }
          return;
        }
        // Selección de color personalizado
        if (scaledX > 10 && scaledX < 210 && scaledY > 200 && scaledY < 240) {
          let col = int((scaledX - 10)/25);
          let fila = int((scaledY - 200)/20);
          if (col >= 0 && col < 8 && fila >= 0 && fila < 2) {
            customColorSeleccionado = fila * 8 + col;
            if (customColor[customColorSeleccionado]) {
              currentColor = customColor[customColorSeleccionado];
              updateColor();
            }
          }
          return;
        }
        
        // Selector de color HSB (custom)
        if (customColorActivo && scaledX > PICKER_X && scaledX < PICKER_X + ANCHO_PICKER && 
            scaledY > PICKER_Y - ALTO_PICKER && scaledY < PICKER_Y) {
          hue = map(scaledX - PICKER_X, 0, ANCHO_PICKER, 0, 239);
          saturation = map(PICKER_Y - scaledY, 0, ALTO_PICKER, 0, 240);
          currentColor = HSBtoRGB(hue, saturation, brightness);
          updateColor();
          return;
        }
        
        // Barra de brillo (custom)
        if (customColorActivo && scaledX > PICKER_X + ANCHO_PICKER + 10 && 
            scaledX < PICKER_X + ANCHO_PICKER + 20 && 
            scaledY > PICKER_Y - ALTO_PICKER && scaledY < PICKER_Y) {
          brightness = map(PICKER_Y - scaledY, 0, ALTO_PICKER, 0, 240);
          currentColor = HSBtoRGB(hue, saturation, brightness);
          updateColor();
          return;
        }
        
        // Botón "Add to Custom Colours"
        if (customColorActivo && scaledX > PICKER_X && scaledX < PICKER_X + ANCHO_PICKER + 20 && 
            scaledY > 280 && scaledY < 300) {
          if (customColorSeleccionado < 16) {
            customColor[customColorSeleccionado] = currentColor;
            console.log("HECHO");
          } else {
            for (let i = 0; i < customColor.length; i++) {
              if (!customColor[i]) {
                customColor[i] = currentColor;
                customColorSeleccionado = i;
                break;
              }
            }
          }
          return;
        }
        return;
      } else {
        // Lógica normal de edición de bloques (cuando el selector de color está cerrado)
        transformedX = (xMouse - windowWidth / 2) / (zoomCodigo * escalaBase) - panCodigoX;
        transformedY = (yMouse - windowHeight / 2) / (zoomCodigo * escalaBase) - panCodigoY;
      }
      if (pixel[0] == 205 && pixel[1] == 205 && pixel[2] == 205 && yMouse>ALTO_MENU_SUPERIOR && altoMenu[menu]>windowHeight) {
        panningMenuBloques = true;
        console.log("menu");
        panStartMenuBloquesY=yMouse;
      }
      // Si hay un código Seleccionado 2 es porque hemos pinchado con el botón derecho sobre un bloque y se ha abierto un desplegable
      if (bloqueSeleccionado !== null && desplegableBloque) {
        // Si está abierto el desplegable para Duplicar/Eliminar bloques
        // Si se pincha en duplicar bloques
        if (xMouse > xDesplegable + 10 * escalaBase && 
          xMouse < xDesplegable + 200 * escalaBase && 
          yMouse > yDesplegable && 
          yMouse < yDesplegable + 25 * escalaBase) {  
          let copia;
          bloquesVirtuales = [];
          for (let variable of bloquesSeleccionados) {
            copia = variable.clonarBloque();
            bloquesVirtuales.push(copia);
          }  
          for (let i = 0; i < bloquesSeleccionados.length; i++) {
            if (bloquesSeleccionados[i].anteriorClon === -1) {
              bloquesVirtuales[i].anterior = null;
            } else {
              bloquesVirtuales[i].anterior = bloquesVirtuales[bloquesSeleccionados[i].anteriorClon];
            }
            if (bloquesSeleccionados[i].siguienteClon === -1) {
              bloquesVirtuales[i].siguiente = null;
            } else {
              bloquesVirtuales[i].siguiente = bloquesVirtuales[bloquesSeleccionados[i].siguienteClon];
            }          
            if (bloquesSeleccionados[i].padreClon === -1) {
              bloquesVirtuales[i].padre = null;
            } else {
              bloquesVirtuales[i].padre = bloquesVirtuales[bloquesSeleccionados[i].padreClon];
            }            
            if (bloquesSeleccionados[i].bucleSiguienteClon === -1) {
              bloquesVirtuales[i].bucleSiguiente = null;
            } else {
              bloquesVirtuales[i].bucleSiguiente = bloquesVirtuales[bloquesSeleccionados[i].bucleSiguienteClon];
            }     
            // Preparamos las variables para un posible posterior clonado
            bloquesSeleccionados[i].anteriorClon = -1;
            bloquesSeleccionados[i].siguienteClon = -1;
            bloquesSeleccionados[i].padreClon = -1;
            bloquesSeleccionados[i].bucleSiguienteClon = -1;
          }        
          for (let i = 0; i < bloquesVirtuales.length; i++) {
            // Preparamos las variables para un posible posterior clonado
            bloquesVirtuales[i].anteriorClon = -1;
            bloquesVirtuales[i].siguienteClon = -1;
            bloquesVirtuales[i].padreClon = -1;
            bloquesVirtuales[i].bucleSiguienteClon = -1;             
            // Añadimos la copia a los códigos del programa
            codigo.push(bloquesVirtuales[i]);
            bloquesVirtuales[i].calcularVerticesBloque();
          }
          desplegableBloque=false;  
          return;
        }    
        // Si se pincha en eliminar bloques
        if (xMouse > xDesplegable + 10 * escalaBase && 
          xMouse < xDesplegable + 200 * escalaBase && 
          yMouse > yDesplegable + 25 * escalaBase && 
          yMouse < yDesplegable + 50 * escalaBase) {
          eliminarBloques(); 
          bloquesSeleccionados=[];
          desplegableBloque=false;   
          return;
        }
      }
      desplegableBloque = false;
      // Si pincho sobre uno de los bloques del menú de categorías...
      for (let i = 0; i < codigoCategoria.length; i++) {
        if (codigoCategoria[i].colision(transformedXbasico, transformedYbasico, true) !== null) {
          menu = i;
          panMenuBloquesY=0;
          return;
        }
      }
      let transformedYmenuBloques = yMouse / escalaBase;
      if (transformedXbasico>0 && transformedXbasico<anchoRect && transformedYbasico>ALTO_COMIENZO_BLOQUES && transformedYbasico<altoMenu[menu]) {
        transformedYmenuBloques = yMouse / escalaBase - panMenuBloquesY;
        // *********************************************************************************
        // Si pincho sobre uno de los bloques del MENÚ DE LA IZQUIERDA...
        // *********************************************************************************
        for (let bloque of codigoMenu) { // Recorro todos los bloques del Menú
          // Solo analizamos los que pertenecen al menú de bloques seleccionado anteriormente
          if (bloque.categoria === menu) { // Pero sólo chequeo aquellos bloques en los que la categoría coincide con el menú que hay seleccionado
            if (bloque.tipo=="_") {
              bloqueSeleccionado = bloque.contienePunto(transformedXbasico , transformedYmenuBloques);
            } else {
              bloqueSeleccionado = bloque.colision(transformedXbasico , transformedYmenuBloques);
            } 
            if (bloqueSeleccionado != null) {
              if (bloque.nombre === "AddNewVariableButton" && menu==3) { // Si pinchamos el botón Crear nueva variable...
                crearVariable("My Var");
                bloqueSeleccionado=null;
                return;
                //bloqueEditando = codigoVariables[codigoVariables.length - 1];
              } else {
                let ident = bloque.id;
                offsetX = bloque.x - transformedXbasico; // Distancia entre ratón y punto de referencia del subBloque
                offsetY = bloque.y - transformedYmenuBloques;                 
                let nuevoBloque = new Bloque(
                  (transformedX + offsetX) / zoomCodigo,
                  (transformedY + offsetY) / zoomCodigo,
                  menu, ident, t[menu][ident], false, true
                );      
                codigo.push(nuevoBloque); // Crea un nuevo bloque para incorporar a código  
                if (bloque.nombre === "IfElseBlock") { // Si se trata de un bloque if/else crea sus correspondiente bloque else y vincula ambos
                  let bloqueElse = new Bloque(
                    bloque.x, bloque.y, menu, ident + 1, t[menu][ident + 1], false, true
                  );     
                  codigo.push(bloqueElse); // Crea un nuevo bloque para incorporar al código
                  codigo[codigo.length - 1].anterior = codigo[codigo.length - 2];
                  //codigo[codigo.length - 1].num = cont; // Añade un número al bloque creado
                  cont++;
                  codigo[codigo.length - 2].siguiente = codigo[codigo.length - 1];
                  //codigo[codigo.length - 2].num = cont; // Añade un número al bloque creado
                  //cont++;
                  bloqueSeleccionado = codigo[codigo.length - 2];
                } else {
                  bloqueSeleccionado = codigo[codigo.length - 1];
                }
                bloqueSeleccionado.calcularVerticesBloque();
                // Si el bloque es un bloquesStart se añade un nuevo hilo
                if (bloqueSeleccionado.nombre === "WhenRunBlock") {
                  bloquesStart.push(bloqueSeleccionado);
                  bloqueStartSeleccionado = bloqueSeleccionado;
                  bloqueEjecutando = bloqueSeleccionado;
                }                
                // Deja el bloque seleccionado como único en la LISTA de Seleccionados
                bloqueSeleccionado.seleccionBloquesDependientes();
                codigo[codigo.length - 1].num = cont; // Añade un número al bloque creado
                cont++;
              }    
              panningMenuBloques=false;   
            return;
            }       
          }
        }
        if (menu==3) {
          // Si pincho sobre el bloque de la VARIABLE de la izquierda...
          for (let bloque of [...codigoVariables]) {
            if (bloque.colision(transformedXbasico, transformedYmenuBloques, true) !== null) {
              offsetX = bloque.x - transformedXbasico; // Distancia entre ratón y punto de referencia del subBloque
              offsetY = bloque.y - transformedYmenuBloques;       
              let nuevoBloqueVariable = new Bloque(
                transformedX + offsetX,
                transformedY + offsetY,
                3, 4, BOTON_VARIABLE, false, true
              );      
              codigo.push(nuevoBloqueVariable); // Crea un nuevo bloque para incorporar a código
              codigo[codigo.length - 1].texto[0] = bloque.texto[0];
              codigo[codigo.length - 1].AxTexto[0] = bloque.AxTexto[0];
              codigo[codigo.length - 1].variablePadre = bloque; // Vinculamos su VARIABLE para que todos los bloques incorporados tengan un valor común
              bloqueSeleccionado = codigo[codigo.length - 1];
              bloqueSeleccionado.seleccionBloquesDependientes();
              return;
            }
          }
          for (let bloque of [...botonesVariables]) {
            if (bloque.colision(transformedXbasico, transformedYmenuBloques, true) !== null && menu==3) {
              if (bloque.boton) {
                // Si se trata de un botón DELETE. Borramos el propio bloque y todos los bloques vinculados: VARIABLE y DELETE
                if (bloque.id === 100) {
                  let index = botonesVariables.indexOf(bloque);           
                  // Borramos el bloque RENAME asociado
                  let siguienteIndex = botonesVariables.indexOf(bloque.siguiente);
                  if (siguienteIndex > -1) {
                    botonesVariables.splice(siguienteIndex, 1);
                  }        
                  // Borra todas las variables existentes en el escenario
                  for (let bloque2 of [...codigo]) {
                    let resultado = bloque2.borrarVariables(bloque.padre); // Aquí el bloque padre es la propia variable del menú izquierdo
                    if (resultado !== null) {
                      let bloqueIndex = codigo.indexOf(resultado);
                      if (bloqueIndex > -1) {
                        codigo.splice(bloqueIndex, 1);
                      }
                    }
                  }                      
                  // Borramos la propia variable
                  let padreIndex = codigoVariables.indexOf(bloque.padre);
                  if (padreIndex > -1) {
                    codigoVariables.splice(padreIndex, 1);
                  }                    
                  // Borramos el propio botón DELETE
                  let bloqueIndex = botonesVariables.indexOf(bloque);
                  if (bloqueIndex > -1) {
                    botonesVariables.splice(bloqueIndex, 1);
                  }                     
                  altoMenu[3] = altoMenu[3] - codigoMenu[codigoMenu.length - 1].grosorTotal - SEPARACION_BLOQUES_MENU; // Calcula el alto del menú                    
                  // Movemos hacia arriba todos los bloque inferiores al borrado
                  for (let i = index; i < botonesVariables.length; i = i + 2) {
                    botonesVariables[i].y = botonesVariables[i].y - botonesVariables[i].grosorBloque - SEPARACION_BLOQUES_MENU;
                    botonesVariables[i].siguiente.y = botonesVariables[i].y;
                    botonesVariables[i].padre.y = botonesVariables[i].y;
                  }
                  return;
                } 
                // Si se trata de un botón RENAME...
                else if (bloque.id === 200) {
                  bloqueEditando = bloque.padre; // Vincula para editar texto el bloque padre (VARIABLE EN SÍ)
                  bloqueEditando.crearInput();
                  return;
                }
              }
            }
          }
        }    
      }
      // ***** COMPROBAMOS SI SE HA PINCHADO EN ALGÚN BLOQUE DEL ESCENARIO ******
      // Si pincho sobre uno de los bloques del escenario... buscar el bloque más profundo (subbloques) que colisiona
      for (let bloque of codigo) {    
        if (bloque.nombre !== "ElseBlock") { // Impide que en el bloque else se pueda seleccionar
          if (bloque.tipo=="_") {
            bloqueSeleccionado = bloque.contienePunto(transformedX , transformedY);
          } else {
            bloqueSeleccionado = bloque.colision(transformedX , transformedY);
          } 
        }
        // Si hay selección de un bloque. Comprobamos si hay selección de alguno de los parámetros interiores del bloque
        if (bloqueSeleccionado != null) {
          offsetX = bloque.x - transformedX; // Distancia entre ratón y origen de bloque
          offsetY = bloque.y - transformedY;
          // No queremos que la siguiente línea tenga efecto en los bloques del menú, ya que no podemos editar datos en esos bloques
          if (bloqueSeleccionado.enEscenario) { // No queremos que la siguiente línea tenga efecto en los bloques del menú
            let resultado=bloqueSeleccionado.colisionDatos(transformedX, transformedY);
            if (resultado!=null) {
              bloqueSeleccionado=resultado;
              //return; // Busca si el puntero está en parámetros/datos en los bloques y ejecuta su edición si los detecta
            } else {
              bloqueSeleccionado=null;
              return;
            }
          } 
          // Si hay algún bloque o subBloque seleccionado
          if (bloqueSeleccionado != null) {  
            bloquesSeleccionados = [];
            bloqueSeleccionado.seleccionBloquesDependientes();   
            offsetX = bloqueSeleccionado.x - transformedX; // Distancia entre ratón y punto de referencia del subBloque
            offsetY = bloqueSeleccionado.y - transformedY;  
            // Cerramos el cuadro de texto si hubiera alguno activo
            if (bloqueEditando != null) cerrarEdicionTexto();  
            inicioDesplazarBloque = true;
            //Sirve para detectar si posteriormenete realmente se ha desplazado el bloque
            mouseOrigenX = xMouse;
            mouseOrigenY = yMouse;
          } 
          break;
        }
      }
      if (bloqueSeleccionado !== null) {
          if (bloqueSeleccionado.nombre === "WhenRunBlock") {
          bloqueStartSeleccionado = bloqueSeleccionado;
          bloqueEjecutando = bloqueSeleccionado;
        }
        return;
      }
      // ***********************************************************************
      // A estas alturas, si hemos llegado aquí es porque no hemos pinchado en ningún objeto; es decir, hemos pinchado en la pantalla.
      // Si la zona pinchada está fuera de las áreas de los menús, se produce el PANEADO

    }  //***************** MODO CONFIGURACIÓN *************************************************
    else if (modo == 3) {  
      // Transformar coordenadas del mouse (teniendo en cuenta zoom y desplazamiento)
      transformedXbasico = (xMouse - windowWidth/2) / (zoomConfiguracion * escalaBase) - panConfiguracionX;
      transformedYbasico = (yMouse - windowHeight/2) / (zoomConfiguracion * escalaBase) - panConfiguracionY;
      // Si se presionan los pulsadores SW1 o SW2
      if (distanciaAlCuadrado(transformedXbasico, transformedYbasico, -107, 266) < 100) {
        elemento[4].valorElemento = 255;
        return;
      }
      if (distanciaAlCuadrado(transformedXbasico, transformedYbasico, 224, 33) < 100) {
        elemento[6].valorElemento = 255;
        return;
      }
      // Si se presiona el interruptor del robot
      if (transformedYbasico > 270 && transformedYbasico < 280) {
        if (transformedXbasico > 45 && transformedXbasico < 55 && ejecutando) {
          if (ejecutando) {
            botonStop();
          }
          return;
        } else if (transformedXbasico > 80 && transformedXbasico < 90 && ejecutando == false) {
          if (!ejecutando) {
            botonPlay();
          }
          return;
        }
      }
      // Si se pincha en un jumper
      for (let i = 0; i < jumpers.length; i++) {
        let variable = jumpers[i];
        jumperSeleccionado = variable.desconectar(transformedXbasico, transformedYbasico);
        if (jumperSeleccionado != null) return;
      }
      // Si se pincha en el extremo de un cable
      for (let i = 0; i < conector.length; i++) {
        let variable = conector[i];
        conectorSeleccionado = variable.desconectar(transformedXbasico, transformedYbasico);
        if (conectorSeleccionado != null) return;
      }
      // Si se presiona el sensor de ultrasonidos
      if (transformedXbasico > ULTRASONIC_X - ANCHO_ULTRASONIC/2 && 
          transformedXbasico < ULTRASONIC_X + ANCHO_ULTRASONIC/2 && 
          transformedYbasico > ULTRASONIC_Y - ALTO_ULTRASONIC/2 && 
          transformedYbasico < ULTRASONIC_Y + ALTO_ULTRASONIC/2 &&
          !robot.ultrasonidosConectado) {
        robot.ultrasonidosConectado = true;
        return;
      } else if (transformedXbasico > ULTRASONIDOS_X - ANCHO_ULTRASONIDOS/2 && 
                transformedXbasico < ULTRASONIDOS_X + ANCHO_ULTRASONIDOS/2 && 
                transformedYbasico > ULTRASONIDOS_Y - ALTO_ULTRASONIDOS/2 && 
                transformedYbasico < ULTRASONIDOS_Y + ALTO_ULTRASONIDOS/2 &&
                robot.ultrasonidosConectado) {
        robot.ultrasonidosConectado = false;
        return;
      }
    } //**************** MODO SELECCIÓN DE TAPETE ++++++++++++++++++++++++
    else if (modo == 6) {
      // Ajustar coordenadas por escala
      let mx = xMouse / escalaBase;
      let my = yMouse / escalaBase + offsetYBarra;  
      // Verificar clic en thumbnails
      for (let i = 0; i < thumbnails.length; i++) {
        if (mx >= xPos[i] && mx <= xPos[i] + anchoThumbnail &&
            my >= yPos[i] && my <= yPos[i] + altoThumbnail) {
          indiceTapeteSeleccionado = i;
          nombreFondo=archivosSVG[i];
          cargarFondo();
        }
      }  
      // Verificar clic en barra de scroll (si existe)
      if (totalThumbnailsHeight > windowHeight) {
        let barraX = windowWidth - 40;
        if (xMouse >= barraX && xMouse <= barraX + 20 &&
            yMouse >= 60 && yMouse <= windowHeight - 40) {
          // Iniciar arrastre de scroll
          arrastrandoScroll = true;
          clickScrollY = yMouse;
          scrollOffsetInicial = offsetYBarra;
        }
      } 
      // Si se hace clic fuera de todo, deseleccionar
      indiceTapeteSeleccionado = -1;
    } // ******************** SI SE PULSA EL BOTÓN DERECHO *********************
}

function handleRightClick(xMouse,yMouse) {
    if (modo === 4) {
      transformedX = (xMouse - windowWidth / 2) / (zoomCodigo * escalaBase) - panCodigoX;
      transformedY = (yMouse - windowHeight / 2) / (zoomCodigo * escalaBase) - panCodigoY;
      for (let bloque of codigo) {    
        if (bloque.nombre !== "ElseBlock") { // Impide que en el bloque else se pueda seleccionar
          if (bloque.tipo=="_") {
            bloqueSeleccionado = bloque.contienePunto(transformedX , transformedY);
          } else {
            bloqueSeleccionado = bloque.colision(transformedX , transformedY);
          } 
          if (bloqueSeleccionado !== null) { 
            bloqueSeleccionado.seleccionBloquesDependientes();  
            desplegableBloque=true;
            xDesplegable = xMouse; 
            yDesplegable = yMouse;
            return;
          }
        } 
      }   
    }  
  
} 

function mouseDragged() {
  redraw();
  if (!appLista) return;
  if (modo == 5) { // MODO SIMULACIÓN
    if (panningSimulacion) {
      panSimulacionX = constrain(panSimulacionX, -width/2, width/2);
      panSimulacionY = constrain(panSimulacionY, -height/2, height/2);
      panSimulacionX+=(mouseX-panStartSimulacionX)/(zoomSimulacion*escalaBase);
      panSimulacionY+=(mouseY-panStartSimulacionY)/(zoomSimulacion*escalaBase);
      panStartSimulacionX=mouseX;
      panStartSimulacionY=mouseY;
      return;
    } 
    // 1. GESTIÓN DE OBSTÁCULOS    
    transformedX = (mouseX - windowWidth / 2) / (zoomSimulacion * escalaBase) - panSimulacionX;
    transformedY = (mouseY - windowHeight / 2) / (zoomSimulacion * escalaBase) - panSimulacionY;
    transformedObstaculoX = transformedX + robotFisico.body.position.x;
    transformedObstaculoY = transformedY + robotFisico.body.position.y;
     //Si hay un obstáculo seleccionado para editar su ángulo y dimensión
    if (obstaculoSeleccionado!=null) {
      if (obstaculoSeleccionado.modoTransformacion==1) {
      // Para giro: calculamos el nuevo ángulo y aplicamos el offset
        //let nuevoAngulo=atan2(transformedObstaculoY-obstaculoSeleccionado.body.position.y,transformedObstaculoX-obstaculoSeleccionado.body.position.x);
        //obstaculoSeleccionado.body.angle=nuevoAngulo-offsetAngulo;
        Body.setAngle(obstaculoSeleccionado.body,atan2(transformedObstaculoY-obstaculoSeleccionado.body.position.y,transformedObstaculoX-obstaculoSeleccionado.body.position.x) - offsetAngulo);
      } else {
        // Convertimos el movimiento a coordenadas locales del rectángulo
        let dx=(mouseX-pmouseX)/(zoomSimulacion*escalaBase);
        let dy=(mouseY-pmouseY)/(zoomSimulacion*escalaBase);        
        // Rotamos el vector de movimiento inversamente al ángulo del rectángulo
        let cosAng=cos(-obstaculoSeleccionado.body.angle);
        let sinAng=sin(-obstaculoSeleccionado.body.angle);
        let dxLocal=dx*cosAng-dy*sinAng;
        let dyLocal=dx*sinAng+dy*cosAng;        
        // Aplicamos solo el componente necesario (X para ensanchar, Y para alargar)
        if (obstaculoSeleccionado.modoTransformacion==2) {
          obstaculoSeleccionado.ensanchar(dxLocal*2);
        } else if (obstaculoSeleccionado.modoTransformacion==3) {
          obstaculoSeleccionado.ensanchar(-dxLocal*2);
        } else if (obstaculoSeleccionado.modoTransformacion==4) {
          obstaculoSeleccionado.alargar(dyLocal*2);
        } else if (obstaculoSeleccionado.modoTransformacion==5) {
          obstaculoSeleccionado.alargar(-dyLocal*2);
        }
      }
      return;
    }//Si hay un obstáculo seleccionado para ser arrastrado
    else if (obstaculoDesplazando!=null) {
      RectX=transformedX+offsetX;
      RectY=transformedY+offsetY;
      return;
    }
    // 3. GESTIÓN DE BOMBILLA
    else if (desplazandoBulb) {
      bulbX=transformedX+offsetX;
      bulbY=transformedY+offsetY;
      return;
    }    
    // PAN DEL ESCENARIO
    else if (robotSeleccionado) {//Si el robot está seleccionado modificamos su ángulo
      if (Crono>0) movidoDuranteEjecucion=true;
      Body.setAngle(robotFisico.body,atan2(transformedY, transformedX) - offsetAngulo);
    } else if (desplazandoRobot) {//Si el robot setá siendo desplazado cambiamos su posición
      movidoDuranteEjecucion=true;
      CrumX=transformedX+offsetX;
      CrumY=transformedY+offsetY;
      if (robotFisico.body.position.x<-anchoMundo/2.5|| robotFisico.body.position.x>anchoMundo/2.5 || robotFisico.body.position.y<-altoMundo/2.5 || robotFisico.body.position.y>altoMundo/2.5) {
        desplazandoRobot=false;
        Matter.Body.setPosition(robotFisico.body, { x: 0 , y: 0 });
        mensaje="Robot fuera de los límites del mundo";
        inicioMensaje=millis();      
      }
      return;  
    }
  } // MODO EDICIÓN DE BLOQUES (modo == 4)
  else if (modo == 4) {
    // PAN del área de código
    if (panningCodigo && !colorPickerOpen) {
      panCodigoX = constrain(panCodigoX, -width/2, width/2);
      panCodigoY = constrain(panCodigoY, -height/2, height/2);
      panCodigoX += (mouseX - panStartCodigoX) / (zoomCodigo * escalaBase);
      panCodigoY += (mouseY - panStartCodigoY) / (zoomCodigo * escalaBase);
      panStartCodigoX=mouseX;
      panStartCodigoY=mouseY;
      return;
    } else if (panningMenuBloques) {
      panMenuBloquesY += (mouseY - panStartMenuBloquesY) / escalaBase;
      panStartCodigoY=mouseY;
      let contenidoVisible = windowHeight - 2*ALTO_COMIENZO_BLOQUES;
      let contenidoTotal = altoMenu[menu] - ALTO_COMIENZO_BLOQUES;
      let minPan = contenidoVisible - contenidoTotal; // límite inferior
      let maxPan = 0; // límite superior
      if (panMenuBloquesY > maxPan) {
        panMenuBloquesY = maxPan;
      }
      if (panMenuBloquesY < minPan) {
        panMenuBloquesY = minPan;
      }
      return;
    } else if (inicioDesplazarBloque && (mouseOrigenX != mouseX || mouseOrigenY != mouseY)) {
      // Detecta si se ha producido movimiento del ratón
      //Para que en la segunda iteracción de mouseDragged no compreube si ha habido desplazamiento
      inicioDesplazarBloque = false;
      if (bloqueSeleccionado != null) {
        if (bloqueSeleccionado.tipo == '_') {
          desconectar(bloqueSeleccionado); // Lo desconectamos de su bloque superior
        }
        // Si no es un bloque normal y tiene padre (es un subBloque)...
        else if (bloqueSeleccionado.padre != null) {

          // Recorro todos los subBloques del padre (bloque que contiene el subBloque)
          for (let i = 0; i < bloqueSeleccionado.padre.subBloque.length; i++) {
            if (bloqueSeleccionado == bloqueSeleccionado.padre.subBloque[i]) {
              bloqueSeleccionado.padre.subBloque[i] = null;
              bloqueSeleccionado.padre.AxDato[i] = bloqueSeleccionado.padre.calculoAnchoDato(bloqueSeleccionado.padre.dato[i]);
              bloqueSeleccionado.padre.calculoDimensiones();
              bloqueSeleccionado.padre.calculoGrosorBucle();
              bloqueSeleccionado.padre.actualizarCoordenadas();
              bloqueSeleccionado.padre.calcularVerticesBloque()
              
              if (bloqueSeleccionado.padre.padre != null) {
                bloqueSeleccionado.padre.padre.calculoGrosorBucle();
                bloqueSeleccionado.padre.padre.actualizarCoordenadas();
                bloqueSeleccionado.calcularVerticesBloque()
              }
            }
          }
        }
        return;  
      }
    } else if (bloqueSeleccionado != null) { // Nos aseguramos que hay un bloque seleccionado
      transformedX = (mouseX - windowWidth / 2) / (zoomCodigo * escalaBase) - panCodigoX;
      transformedY = (mouseY - windowHeight / 2) / (zoomCodigo * escalaBase) - panCodigoY;
      bloqueSeleccionado.x = transformedX + offsetX;
      bloqueSeleccionado.y = transformedY + offsetY;
      if (bloqueSeleccionado.tipo == '_') {
        bloqueSeleccionado.actualizarCoordenadas(); // Modifica las coordenadas de los bloques conectados debajo del desplazado
      }    
      seleccion = null; // Bloque o parte superior en caso de bucles
      seleccion2 = null; // subBloques
      seleccion3 = null; // Parte inferior de Bucles 
      seleccion4 = null; //Parte inferior de un bloque o bucle con parte desconectada de un bloque o bucle   
      // **********PROCESO PARA DETECTAR COLISIONES CON OTROS BLOQUES ******************
      // Recorremos todos los bloques
      let menorDistancia = 10000;
      let distanciaColision=1600;
      for (let bloque of codigo) {
        //Para que no se solape a sí mismo
        if (bloqueSeleccionado!=bloque) {
          // Buscamos solape en otros bloques o en la parte superior de los bucles
          if (bloqueSeleccionado.tipo=="_" && bloque.tipo=="_") {
            // Buscamos solape en otros bloques o en la parte superior de los bloques o bucles
            distanciaBloques=distanciaAlCuadrado(bloqueSeleccionado.x+bloqueSeleccionado.anchoLadoIzqBucle,bloqueSeleccionado.y, bloque.x,bloque.y+bloque.grosorBloque);
            if (distanciaBloques < menorDistancia && distanciaBloques < distanciaColision) {
              menorDistancia=distanciaBloques;
              seleccion=bloque;
            }
            // Buscamos solape de la parte inferior de un bloque en la parte superior desconectada de un bloque
            if (bloque.anterior==null && bloque.padre==null && bloque.nombre!="WhenRunBlock") {
              if (bloqueSeleccionado.bucle) {
                if (bloqueSeleccionado.nombre=="IfElseBlock") {
                  distanciaBloques=distanciaAlCuadrado(bloqueSeleccionado.x+bloqueSeleccionado.anchoLadoIzqBucle , bloqueSeleccionado.y+bloqueSeleccionado.grosorTotal+bloqueSeleccionado.siguiente.grosorTotal , bloque.x , bloque.y);
                } else {
                  distanciaBloques=distanciaAlCuadrado(bloqueSeleccionado.x+bloqueSeleccionado.anchoLadoIzqBucle , bloqueSeleccionado.y+bloqueSeleccionado.grosorTotal , bloque.x,bloque.y);
                }
              } else {
                distanciaBloques=distanciaAlCuadrado(bloqueSeleccionado.x+bloqueSeleccionado.anchoLadoIzqBucle , bloqueSeleccionado.y+bloqueSeleccionado.grosorBloque , bloque.x,bloque.y);
              }
              if (distanciaBloques < menorDistancia && distanciaBloques < distanciaColision) {
                menorDistancia=distanciaBloques;
                seleccion4=bloque;
              }
            }
           // Buscamos solape en otros bloques o en la parte inferior de los bucles
            if (bloque.bucle && bloque.nombre != "DoForeverBlock" && bloque.nombre != "IfElseBlock") {
              distanciaBloques=distanciaAlCuadrado(bloqueSeleccionado.x+bloqueSeleccionado.anchoLadoIzqBucle,bloqueSeleccionado.y, bloque.x,bloque.y+bloque.grosorTotal);
              if (distanciaBloques < menorDistancia && distanciaBloques < distanciaColision) {
                menorDistancia=distanciaBloques;
                seleccion3=bloque;
              }
            }
          }
          // Buscamos solape en parámetros
          if (bloqueSeleccionado.tipo!="_") {
            for (let i = 0; i < bloque.numDatos; i++) {
              if (bloque.tipoDato[i] == bloqueSeleccionado.tipo) {
                distanciaBloques=distanciaAlCuadrado(bloqueSeleccionado.x , bloqueSeleccionado.y , bloque.x+bloque.xDato[i] , bloque.y);
                if (distanciaBloques < menorDistancia && distanciaBloques < distanciaColision) {
                  menorDistancia=distanciaBloques;
                  seleccion2=bloque;
                  seleccionSubBloque=i;
                }
              }
            }
          }
        } 
      }
    }
  } //MODO CONFIGURACIÓN
  else if (modo === 3) {
    if (panningConfiguracion) {
      panConfiguracionX = constrain(panConfiguracionX, -width/2, width/2);
      panConfiguracionY = constrain(panConfiguracionY, -height/2, height/2);
      panConfiguracionX += (mouseX - panStartConfiguracionX) / (zoomConfiguracion * escalaBase);
      panConfiguracionY += (mouseY - panStartConfiguracionY) / (zoomConfiguracion * escalaBase);
      panStartConfiguracionX = mouseX;
      panStartConfiguracionY = mouseY;
      return;
    }
    transformedXbasico = (mouseX - windowWidth / 2) / (zoomConfiguracion * escalaBase) - panConfiguracionX;
    transformedYbasico = (mouseY - windowHeight / 2) / (zoomConfiguracion * escalaBase) - panConfiguracionY; 
    if (jumperSeleccionado != null) {
        jumperSeleccionado.x = transformedXbasico + offsetX;
        jumperSeleccionado.y = transformedYbasico + offsetY; 
        return;
    } else if (conectorSeleccionado != null) {
        conectorSeleccionado.x = transformedXbasico + offsetX;
        conectorSeleccionado.y = transformedYbasico + offsetY;
        return;
    }    
  } // MODO SELECCIÓN DE TAPETE (modo == 6)
  else if (modo == 6) {
    if (draggingScrollBar) {
      let deltaY = mouseY - dragStartY;
      let maxOffset = totalThumbnailsHeight - (windowHeight / escalaBase - 100);
      offsetYBarra = constrain(offsetYBarra + deltaY, 0, maxOffset);
      dragStartY = mouseY;
    }
  }
}

function distanciaAlCuadrado(x1,y1,x2,y2) {
  let dx = x1 - x2;
  let dy = y1 - y2;
  return dx*dx + dy*dy;
}

function mouseReleased() {
  if (!appLista) return;
  if (modo == 5) { // MODO SIMULACIÓN
    panningSimulacion=false;
    desplazandoBulb=false;
    elemento[4].valorElemento=0;//Desactiva el BOTÓN SW1
    elemento[6].valorElemento=0;//Desactiva el BOTÓN SW2
    //Si se estaba desplazando un obstáculo 
    if (obstaculoDesplazando!=null) {
      //Si realmente no se ha producido arrastre del obstáculo, hacemos que se seleccione para editar (dimensionar/girar)
      if (mouseX==mouseOrigenX && mouseY==mouseOrigenY) {
        obstaculoSeleccionado=obstaculoDesplazando;
        robotSeleccionado=null;
      } 
      Matter.Body.setPosition(obstaculoDesplazando.body, { x: RectX , y: RectY });
      obstaculoDesplazando.xInicio=RectX;
      obstaculoDesplazando.yInicio=RectY;
      Matter.Body.setVelocity(obstaculoDesplazando.body, { x: 0, y: 0 });
      Matter.Body.setAngularVelocity(obstaculoDesplazando.body, 0);
      obstaculoDesplazando=null;
    } else if (obstaculoSeleccionado!=null) {
      obstaculoSeleccionado.anchoInicio=obstaculoSeleccionado.ancho;
      obstaculoSeleccionado.altoInicio=obstaculoSeleccionado.alto;
      obstaculoSeleccionado.anguloInicio=obstaculoSeleccionado.body.angle;
      Matter.Body.setVelocity(obstaculoSeleccionado.body, { x: 0, y: 0 });
      Matter.Body.setAngularVelocity(obstaculoSeleccionado.body, 0);
    } // Liberar robot
    else if (desplazandoRobot) {
      if (mouseX==mouseOrigenX && mouseX==mouseOrigenX) robotSeleccionado=true;
      Matter.Body.setPosition(robotFisico.body, { x: CrumX , y: CrumY });
      robotFisico.body.isStatic=false;
      Matter.Body.setVelocity(robotFisico.body, { x: 0, y: 0 });
      Matter.Body.setAngularVelocity(robotFisico.body, 0); 
      desplazandoRobot = false;
    } else if (robotSeleccionado && resultadoSeleccion==1) {
      resultadoSeleccion=0;
      robotSeleccionado = false;
    } 
    else if (desplazandoBulb) {
      desplazandoBulb = false;
    }
  } // MODO CONFIGURACIÓN DEL ROBOT (modo == 3)
  else if (modo == 3) {
    elemento[4].valorElemento=0;//Desactiva el pulsador SW1
    elemento[6].valorElemento=0;//Desactiva el pulsador SW2
    if (panningConfiguracion) {
      panningConfiguracion=false;
    } // Conectar jumper o conector al soltar
    else if (jumperSeleccionado != null) {
      jumperSeleccionado.conectar();
      jumperSeleccionado = null;
    } else if (conectorSeleccionado != null) {
      conectorSeleccionado.conectar();
      conectorSeleccionado = null;
    }
  } // MODO DE EDICIÓN DE BLOQUES
  else if (modo == 4) {
    panningCodigo = false;
    panningMenuBloques=false;
    desplazandoVentanaColor = false;
    if (bloqueSeleccionado != null) { // Nos aseguramos que hay un bloque seleccionado 
      // Convertir coordenadas del mouse considerando PAN y ZOOM
      transformedXbasico = mouseX/escalaBase + offsetX;
      transformedYbasico = mouseY/escalaBase + offsetY;
      // Si soltamos el bloque fuera de la pantalla activa
      if ((transformedXbasico < anchoRect && transformedYbasico < altoMenu[menu]) || 
          transformedYbasico < ALTO_MENU_SUPERIOR) {
        // Si el bloque es un bloquesStart lo elimina de la lista de bloques de inicio
        if (bloqueSeleccionado.nombre === "WhenRunBlock") {
          // Encontrar y eliminar el bloque de bloquesStart
          let index = -1;
          for (let i = 0; i < bloquesStart.length; i++) {
            if (bloquesStart[i] === bloqueSeleccionado) {
              index = i;
              break;
            }
          }
          if (index > -1) bloquesStart.splice(index, 1);
        }  
        eliminarBloques();  
        bloquesSeleccionados=[];         
      } else if (!inicioDesplazarBloque) {
        if (seleccion4 != null) {
          bloquesSeleccionados[bloquesSeleccionados.length-1].siguiente = seleccion4;
          seleccion4.anterior = bloquesSeleccionados[bloquesSeleccionados.length-1];
          if (bloqueSeleccionado.nombre=="WhenRunBlock") {
            bloqueSeleccionado.x = seleccion4.x-bloqueSeleccionado.anchoLadoIzqBucle;
          } else {
            bloqueSeleccionado.x = seleccion4.x;
          }
          bloqueSeleccionado.y = seleccion4.y - grosorBloquesSeleccionados;
          bloqueSeleccionado.actualizarCoordenadas(); 
        // Si hay selección en la parte inferior de un bucle y este no es un Do Forever
        } else if (seleccion3 != null) {
          conectar(bloqueSeleccionado, seleccion3, false); // Lo conectamos (false indica parte inferior)
        // Si hay selección de un subBloque...
        } else if (seleccion2 != null && bloqueSeleccionado.tipo == seleccion2.tipoDato[seleccionSubBloque]) {
          seleccion2.addSubBloque(seleccionSubBloque, bloqueSeleccionado); // Lo añadimos dentro de un bloque
        // Si hay selección de un bloque o de la parte superior de un bucle...
        } else if (seleccion != null && seleccion.tipo == '_' && bloqueSeleccionado.tipo == '_') {
          conectar(bloqueSeleccionado, seleccion, true); // Lo conectamos (true indica parte superior)  
        }
      } 
      if ((bloqueStartSeleccionado != null && bloqueStartSeleccionado != undefined && bloqueEjecutando!=bloqueStartSeleccionado) || ejecutando) {
        alert(`Al modifcar los bloques el robot se ha reinicializado`);
        ejecutando=false;
        botonReiniciar();
      }
      if(seleccion!=null || seleccion2!=null || seleccion3!=null || seleccion4!=null) {
        seleccion = null; seleccion2 = null; seleccion3 = null; seleccion4 = null;
      }
      if (!desplegableBloque) {
        bloqueSeleccionado = null;
        bloquesSeleccionados = [];
      }
    } 
  } // MODO SELECCIÓN DE TAPETE (modo == 6)
  else if (modo == 6) {
    // Liberar barra de scroll
    draggingScrollBar = false;
  }
  //*****************************************/
  if (modo==4 || modo==6 || (modo==3 && ejecutando==false)|| (modo==5 && !ejecutando)) {
    redraw(); noLoop();
  } else {
    loop();
  }
}

function keyPressed() {
  if (!appLista) return;
  if (modo == 5) {
    // Tecla ESPACIO: alternar ejecución
    if (key == ' ') {
      if (ejecutando) {
        botonStop();
      } else {
        botonPlay();
      }
      return;
    } 
    // Tecla 'R': reiniciar simulación
    if (key == 'r' || key == 'R') {
      botonReset();
      return;
    }
    if (keyCode === 27) {  // 27 es el código de ESC
      cerrarMenus();
    }
    // Tecla DELETE: eliminar obstáculo seleccionado
    if (keyCode == DELETE || keyCode == BACKSPACE) {
      if (obstaculoSeleccionado != null) {
        eliminarObstaculo(obstaculoSeleccionado);
        obstaculoSeleccionado = null;
      } 
      return;
    }
  } // MODO EDICIÓN DE BLOQUES
  else if (modo == 4) {
    // Si estamos editando texto
    if (modo==4 && bloqueEditando != null && !colorPickerOpen) {
      if (keyCode == BACKSPACE) {
        // Eliminar último carácter
        if (textoTemporal.length > 0) {
          textoTemporal = textoTemporal.substring(0, textoTemporal.length - 1);
        }
      } else if (keyCode == ENTER || keyCode == RETURN || keyCode == ESCAPE) {
        cerrarEdicionTexto();
      }  else if (textoTemporal.length < maximoCaracteres) {
        // Añadir carácter
        if (bloqueEditando.nombre!="VariableBlock") {
          if ((key >= '0' && key <= '9') || key == '.' || key == '-') {
            textoTemporal += key;
          } 
        } else if ((key >= '0' && key <= '9') || (key >= 'a' && key <= 'z') || (key >= 'A' && key <= 'Z') || key === '.' || key === '-') {
          textoTemporal += key;
        }
      }
      return;
    }
    // Tecla DELETE: eliminar bloque seleccionado
    if (keyCode == DELETE || keyCode == BACKSPACE) {
      if (modo==3  && bloqueSeleccionado != null) {
        // Lógica para eliminar bloque
        eliminarBloques(); 
        bloquesSeleccionados=[];
        desplegableBloque=false;   
        return;
      } else if (modo == 5 && obstaculoSeleccionado != null) {
        eliminarObstaculo(obstaculoSeleccionado);
        obstaculoSeleccionado = null;
      }
    }
    // Teclas ZOOM: Ctrl+ y Ctrl-
    if (keyCode == 61 && (keyIsDown(CONTROL) || keyIsDown(91))) { // Ctrl+ o Cmd+
      zoom(0.25); return;
    }
    if (keyCode == 173 && (keyIsDown(CONTROL) || keyIsDown(91))) { // Ctrl- o Cmd-
      zoom(-0.25); return;
    }
  }
}

function eliminarObstaculo(obst) {
  if (!obst) return;
  World.remove(world, obstaculoSeleccionado.body);
  let index = obstaculo.indexOf(obstaculoSeleccionado);
  if (index !== -1) obstaculo.splice(index, 1);
  obstaculoSeleccionado = null;
}

function eliminarBloques() {
  for (let bloque of bloquesSeleccionados) bloque.eliminarBloque();
}

function cerrarEdicionTexto() {
  textoTemporal=input.value();
  // Si estamos editando un bloque del escenario y no el nombre de una variable...
  if (!(bloqueEditando.categoria === 3 && bloqueEditando.id > 3)) {
    if (esNumeroReal(textoTemporal)) {
      let numero = parseFloat(textoTemporal);     
      // Si el número supera el máximo permitido para ese bloque lo limita
      if (bloqueEditando.nombre === "MotorBlock") {
        if (numero > 100) numero = 100;
        else if (numero < 0) numero = 0;
      } else if (bloqueEditando.nombre === "ServoBlock" || bloqueEditando.nombre === "ServoBlockType") {
        if (numero > 90) numero = 90;
        else if (numero < -90) numero = -90;
      } else if (bloqueEditando.nombre === "SetSprakleBlock" || bloqueEditando.nombre === "TurnSprakleOffBlock" || (bloqueEditando.nombre === "SetSprakleRGBBlock" && subBloqueEditando === 0)) {
        if (numero > 31) numero = 31;
        else if (numero < 0) numero = 0;
      } else if ((bloqueEditando.nombre === "SetSprakleRGBBlock" && (subBloqueEditando === 1 || subBloqueEditando === 2 || subBloqueEditando === 3)) || bloqueEditando.nombre === "SetAllSparklesRGBBlock") {
        if (numero > 255) numero = 255;
        else if (numero < 0) numero = 0;
      } else if (bloqueEditando.nombre === "WaitBlock" || bloqueEditando.nombre === "WaitMSBlock" || bloqueEditando.nombre === "DoTimesBlock") {
        if (numero > 32767) numero = 32767;
        else if (numero < 0) numero = 0;
      } else if (bloqueEditando.nombre === "AddBlock" || bloqueEditando.nombre === "SubBlock" || bloqueEditando.nombre === "MultiplyBlock" || bloqueEditando.nombre === "DivideBlock") {
        if (numero > 32767) numero = 32767;
        else if (numero < 0) numero = 0;
      } else if (bloqueEditando.nombre === "EqualityBlock" || bloqueEditando.nombre === "NotEqualBlock" || bloqueEditando.nombre === "LessThanBlock" || bloqueEditando.nombre === "GreaterThanBlock" || bloqueEditando.nombre === "RandomBlock") {
        if (numero > 32767) numero = 32767;
        else if (numero < 0) numero = 0;
      } else if (bloqueEditando.nombre === "SmartDigitsBlock") {
        if (numero > 32767) numero = 32767;
        else if (numero < 0) numero = 0;
      } else if (bloqueEditando.nombre === "SmartPitchBlock") {
        if (numero > 20000) numero = 20000;
        else if (numero < 0) numero = 0;
      } else if (bloqueEditando.nombre === "SetTempoBlock") {
        if (numero > 300) numero = 300;
        else if (numero < 0) numero = 0;
      }
      // Hay bloques que sólo permiten número enteros y otros que admiten números reales
      if (bloqueEditando.nombre === "WaitBlock") {
        textoTemporal = String(numero);
      } else {
        textoTemporal = String(Math.floor(numero));
      }
      // Sustituimos el valor del parámetro/dato del bloque por el del cuadro de texto
      bloqueEditando.dato[subBloqueEditando] = textoTemporal;
      // Recalculamos las dimensiones del bloque
      bloqueEditando.AxDato[subBloqueEditando] = bloqueEditando.calculoAnchoDato(bloqueEditando.dato[subBloqueEditando]);
      bloqueEditando.calculoDimensiones();
      bloqueEditando.calcularVerticesBloque();
    }
  } 
  // Si estamos editando el nombre de una variable
  else {
    // Si el nombre de la variable no está en blanco...
    if (textoTemporal.replace(/ /g, "").length > 0) {
      bloqueEditando.texto[0] = textoTemporal;
      bloqueEditando.AxTexto[0] = bloqueEditando.calculoAnchoDato(bloqueEditando.texto[0]);
      bloqueEditando.calculoDimensiones();
      // Recoloca el botón DELETE
      bloqueEditando.siguiente.x = bloqueEditando.x + bloqueEditando.ancho + 10;
      // Recoloca el botón RENAME
      bloqueEditando.siguiente.siguiente.x = bloqueEditando.siguiente.x + bloqueEditando.siguiente.ancho + 10;
      let bloqueRENAME = bloqueEditando.siguiente.siguiente;
      if (bloqueRENAME.x + bloqueRENAME.ancho + 5 > anchoMenu[3]) {
        anchoMenu[3] = bloqueRENAME.x + bloqueRENAME.ancho + 5;
      }
      // Actualizar nombre en todos los bloques
      for (let bloque of codigo) {
        bloque.actualizarNombreVariables(bloqueEditando);
      }
    }
  }
  input.hide();
  // Desactiva el cuadro de texto activo
  bloqueEditando = null;
  if (bloqueStartSeleccionado != null && bloqueStartSeleccionado != undefined && bloqueEjecutando!=bloqueStartSeleccionado) {
    alert(`Al modifcar los bloques el robot se ha reinicializado`);
    botonReiniciar();
  }
  redraw();
}

function mouseWheel(event) {
  if (!appLista) return;
  // ZOOM en modo simulación
  if (modo == 5) {
    let zoomFactor = 1.1;
    let mouseXBefore = (mouseX - windowWidth / 2) / (zoomSimulacion * escalaBase) - panSimulacionX;
    let mouseYBefore = (mouseY - windowHeight / 2) / (zoomSimulacion * escalaBase) - panSimulacionY;
    if (event.delta > 0) {
      zoomSimulacion /= zoomFactor;
    } else {
      zoomSimulacion *= zoomFactor;
    }
    zoomSimulacion = constrain(zoomSimulacion, 0.1, 3.0);
    let mouseXAfter = (mouseX - windowWidth / 2) / (zoomSimulacion * escalaBase) - panSimulacionX;
    let mouseYAfter = (mouseY - windowHeight / 2) / (zoomSimulacion * escalaBase) - panSimulacionY;
    panSimulacionX += mouseXAfter - mouseXBefore;
    panSimulacionY += mouseYAfter - mouseYBefore;
  } // ZOOM en modo edición de bloques
  else if (modo == 4) {
    let zoomFactor = 1.1;
    let mouseXBefore = (mouseX - windowWidth / 2) / (zoomCodigo * escalaBase) - panCodigoX;
    let mouseYBefore = (mouseY - windowHeight / 2) / (zoomCodigo * escalaBase) - panCodigoY;
    if (event.delta > 0) {
      zoomCodigo /= zoomFactor;
    } else {
      zoomCodigo *= zoomFactor;
    }
    zoomCodigo = constrain(zoomCodigo, 0.5, 3.0); 
    let mouseXAfter = (mouseX - windowWidth / 2) / (zoomCodigo * escalaBase) - panCodigoX;
    let mouseYAfter = (mouseY - windowHeight / 2) / (zoomCodigo * escalaBase) - panCodigoY;
    panCodigoX += mouseXAfter - mouseXBefore;
    panCodigoY += mouseYAfter - mouseYBefore;
  } // Scroll en modo selección de tapete
  else if (modo == 6) {
    offsetYBarra += event.delta * 0.5;
    let maxOffset = totalThumbnailsHeight - (windowHeight / escalaBase - 100);
    offsetYBarra = constrain(offsetYBarra, 0, maxOffset);
  }
  return false; // Prevenir scroll predeterminado
}

function zoom(inc) {
  if (modo === 3) {
    zoomConfiguracion = zoomConfiguracion + inc;
    zoomConfiguracion = constrain(zoomConfiguracion, 0.5, 1.5);      
  } else if (modo === 4) {
    zoomCodigo = zoomCodigo + inc;
    zoomCodigo = constrain(zoomCodigo, 0.5, 1.5);
  } else if (modo === 5) {
    zoomSimulacion = zoomSimulacion + inc;
    zoomSimulacion = constrain(zoomSimulacion, 0.25, 1.5);
  if (robot.ultrasonidosConectado) {
    radio = 0;
    bufferEfectos.clear();
    }
  }
}

function cargarFondo() {
  loadImage("assets/images/escenarios/" + nombreFondo,(img) => {
    anchoTapete=img.width;
    altoTapete=img.height;
    fondo = createGraphics(anchoTapete,altoTapete);
    fondo.pixelDensity(1);
    fondo.background(255);
    fondo.image(img, 0, 0, anchoTapete,altoTapete);
    Matter.Body.setPosition(laterales[0].body, { x: 0 , y: -altoTapete/2-10 });
    laterales[0].setSize(anchoTapete+40,20);
    Matter.Body.setPosition(laterales[1].body, { x: 0 , y: altoTapete/2+10 });
    laterales[1].setSize(anchoTapete+40,20);
    Matter.Body.setPosition(laterales[2].body, { x: -anchoTapete/2-10 , y: 0 });
    laterales[2].setSize(20,altoTapete);
    Matter.Body.setPosition(laterales[3].body, { x: anchoTapete/2+10 , y: 0 });
    laterales[3].setSize(20,altoTapete);
    //Si está en modo invisible, desactivar los laterales
    //Esto hay que hacerlo porque setSize borra los que había y crea nuevos y estos tienen la física activa
    laterales.forEach(obstaculo => {
      const body = obstaculo.body;
      if (!body.collisionFilter) {
        body.collisionFilter = { category: 0x0001, mask: 0xFFFFFFFF, group: 0 };
      }
      body.collisionFilter.mask = lateralesVisibles ? 0xFFFFFFFF : 0;
      body.ignoreRay = !lateralesVisibles;
    });
    //
    modo=5;
    return;
  });
}
//*******************************************************************

function botonPlay() {
  if (bloqueEjecutando!=null) {
    ejecutando = true;
    robotFisico.body.isStatic=false;
    robotFisico.xPrevio= robotFisico.body.position.x;
    robotFisico.yPrevio = robotFisico.body.position.y;
    crearMenuSuperior();
  }
}

function botonStop() {
  robotFisico.body.isStatic=true
  ejecutando = false;
  crearMenuSuperior();
}

function botonReiniciar() {
  // Pone las variables a cero
  for (let variable of codigoVariables) {
    variable.dato[0] = "0";
    variable.valorNumerico = 0;
  }
  // Establece las coordenadas y ángulo del robot iniciales
  Matter.Body.setPosition(robotFisico.body, { 
    x: robotFisico.xInicio, 
    y: robotFisico.yInicio 
  });
  robotFisico.body.angle = robotFisico.anguloInicio;
  Body.setVelocity(robotFisico.body, 0);
  Body.setAngularVelocity(robotFisico.body, 0);
  // Establece los obstáculos en su configuración inicial
  // Eliminar obstáculos existentes
  if (obstaculo != null && obstaculo != undefined) {
    for (let o of obstaculo) {
      Matter.Body.setPosition(o.body, { 
        x: o.xInicio, 
        y: o.yInicio 
      });
      o.body.angle=o.anguloInicio;
      o.setSize(o.anchoInicio,o.altoInicio);
    }
  }
  // Para que se ejecute debe haber al menos un bloque Start
  if (bloqueStartSeleccionado != null && bloqueStartSeleccionado != undefined) {
    bloqueEjecutando = bloqueStartSeleccionado;
  }
  bloqueSeleccionado=null;
  movidoDuranteEjecucion = false;
  esperarUnCiclo = false;
  saltoIfElse = false;
  miliSegundos = 0;
  Crono = 0;
  Distancia = 0;
  // Detiene los motores
  robotFisico.potMotor[0] = 0;
  robotFisico.potMotor[1] = 0;
  Body.setVelocity(robotFisico.body, { x: 0 , y: 0 });
  Body.setAngularVelocity(robotFisico.body, 0);
  // Desactiva el zumbador
  isBeeping = false;
  osc.amp(0, 0.1); // apagar sonido
  // Desactiva todos los diodos LED
  for (let i = 0; i < colorLED.length; i++) {
    colorLED[i] = null;
  }
  // Reinicio adicional de variables (repetido en tu código original)
  for (let variable of codigoVariables) {
    variable.dato[0] = "0";
  } 
  crearMenuSuperior();
}