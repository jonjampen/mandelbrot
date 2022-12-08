//Konstanten (bleiben immer gleich)
//Höhe und Breite des canvas resp. der Fläche der Mandelbrotmenge
const MANDELBROT_WIDTH = 675;
const MANDELBROT_HEIGHT = 450;
const WIDTH = MANDELBROT_WIDTH;
const HEIGHT = MANDELBROT_HEIGHT;
//Farben
const BLACK = "rgb(0, 0, 0)";
const RED = "rgb(255, 0, 0)";
//zoomtypes
const MOUSEWHEEL = 0;
const BUTTON = 1;


//variables
//Ausgangswerte
let max_iterations = 40;
let limit = 2; //(=Beschränktheit)
let displayAxisLabel = true;
let displayAxis = true;
//Inputfelder
let xmin_input;
let xmax_input;
let ymin_input;
let ymax_input;
let limit_input;
//Knöpfe
let zoomIn_button;
let zoomOut_button;
let center_button;
let savePNG_button;
let adjustBoundaries_button;
let updateMaxIterations_button;
let adjustLimit_button;
//checkbox
let displayAxis_checkbox;
let displayAxisLabel_checkbox;

//Achsen
//Bereich, der das Koordinatensystem beinhalten soll
let xmin = -2;
let xmax = 1;
let ymin = -1;
let ymax = 1;
//Totale Breite/Höhe in komplexen Zahlen
let complexWidth;
let complexHeight;
//länge einer Einheit in Pixel
let lengthOfOneXUnit;
let lengthOfOneYUnit;
//Achsenbeschriftung
let tempWidth;
let tempHeight;
let unitX;
let unitY;

//Zoom
let rectangleZoom_state = 0;
let startDrag, endDrag;
let shift_pressed = 0;
let xmin_adjusted,xmax_adjusted, ymin_adjusted, ymax_adjusted;
let adjusted = false;
let limit_adjusted;
let maxiterations_input;
let threshold_adjusted;



//Funktionen

/*
setup():
	erstellt canvas und stellt UI-Elemente dar
*/
function setup() {
	//erstelle ein canvas
  let canvas = createCanvas(WIDTH, HEIGHT);
  
  
  //Checkbox um Achsen anzuzeigen resp. auszublenden
  displayAxis_checkbox = createCheckbox('show axis', true);
  displayAxis_checkbox.changed(changeDisplayAxisState);
  displayAxis_checkbox.position(0, 460);
  
  //Checkbox um Achsenbeschriftung anzuzeigen resp. auszublenden
  displayAxisLabel_checkbox = createCheckbox('show axis labels', true);
  displayAxisLabel_checkbox.changed(changeDisplayAxisLabelState);
  displayAxisLabel_checkbox.position(0, 480);
	
  
  //Knöpfe zum herein resp. heraus zoomen
  label_zoom_button = createP("zoom buttons:");
  label_zoom_button.position(5, 500);
  zoomIn_button = createButton('+');
  zoomIn_button.position(110, 515);
  zoomIn_button.mousePressed(buttonZoomIn);
 	
  zoomOut_button = createButton('-');
  zoomOut_button.position(150, 515);
  zoomOut_button.mousePressed(buttonZoomOut);
  
	
  label_canvas = createP("canvas:");
  label_canvas.position(5, 530);
  
  //Knopf zum zentrieren
  center_button = createButton('center');
  center_button.mousePressed(centerImage);
  center_button.position(70, 545);
  
  //Knopf um ein PNG vom Canvas zu speichern
  savePNG_button = createButton('save');
  savePNG_button.mousePressed(saveToPNG);
  savePNG_button.position(140, 545);
  
  
  //Slider für die Farben der 1. resp letzten Iteration
  label_first_slider = createP("color (outside):");
  label_first_slider.position(270, 445);
  first_iteration_hue_slider = createSlider(0, 360, 0);
  first_iteration_hue_slider.position(270, 485);
  first_iteration_hue_slider.style('width', '80px');
  
  label_last_slider = createP("color (inside):");
  label_last_slider.position(450, 445);
  last_iteration_hue_slider = createSlider(0, 360, 180);
  last_iteration_hue_slider.position(450, 485);
  last_iteration_hue_slider.style('width', '80px');
  
  
  //Input Felder: User kann xmin,... selbst setzten; Funktion adjustBoundary wird aufgerufen
  label_xmin = createP("xmin");
  label_xmin.position(270, 505);
  xmin_input = createInput(xmin);
  xmin_input.position(270, 540);
  xmin_input.size(50);
  xmin_input.input(adjustBoundaryXmin);

  label_xmax = createP("xmax");
  label_xmax.position(330, 505);
  xmax_input = createInput(xmax);
  xmax_input.position(330, 540);
  xmax_input.size(50);
  xmax_input.input(adjustBoundaryXmax);
  
  label_ymin = createP("ymin");
  label_ymin.position(270, 550);
  ymin_input = createInput(ymin);
  ymin_input.position(270, 585);
  ymin_input.size(50);
  ymin_input.input(adjustBoundaryYmin);
  
  label_ymax = createP("ymax");
  label_ymax.position(330, 550);
  ymax_input = createInput(ymax);
  ymax_input.position(330, 585);
  ymax_input.size(50);
  ymax_input.input(adjustBoundaryYmax);
  
  //Knopf um die Input-Werte von xmin,... zu aktualisieren
  adjustBoundaries_button = createButton('set');
  adjustBoundaries_button.position(400, 550)
  adjustBoundaries_button.mousePressed(adjustBoundaries);
  
  //Knopf um die Inputfelder von xmin,... auf aktuelle Situation vom Canvas zu setzen
  getBoundaries_button = createButton('get from canvas');
  getBoundaries_button.position(400, 575)
  getBoundaries_button.mousePressed(getBoundaries);
  
  
  //Input Feld für limit (Beschränktheit)
  label_limit = createP("limit:");
  label_limit.position(5, 600);
  limit_input = createInput(limit);
  limit_input.position(110, 615);
  limit_input.size(50);
  limit_input.input(adjustLimit);
  
  //Knopf um die Beschränktheit zu verändern
  adjustLimit_button = createButton('set');
  adjustLimit_button.position(180, 615)
  adjustLimit_button.mousePressed(updateLimit);
  
   
  //Input Feld für max iterations (Schwellenwert)
  label_max_iterations = createP("max iterations:");
  label_max_iterations.position(5, 570);
  maxiterations_input = createInput(max_iterations);
  maxiterations_input.position(110, 585);
  maxiterations_input.size(50);
  maxiterations_input.input(adjustMaxIterations);
  
  //Knopf um den Schwellenwert zu verändern
  updateMaxIterations_button = createButton('set');
  updateMaxIterations_button.position(180, 585)
  updateMaxIterations_button.mousePressed(updateMaxIterations);
}


/*
pixelToComplexNumber:
	wandelt jede Pixelkoordinate zu einer Komplexen Zahl um
  @xPixel: x der Pixelkoordinate
  @yPixel: y der Pixelkoordinate
  @return: komplexe Zahl
*/
function pixelToComplexNumber(xPixel, yPixel) {
  //re und im setzen und als komplexe Zahl zurückgeben
	let re = xmin + xPixel/lengthOfOneXUnit;
  let im = ymax - (yPixel/lengthOfOneYUnit);
  
 	return new ComplexNumber(re, im);
}


/* 
ComplexNumberTpPixel:
	wandelt jede komplexe Zahle der Klasse ComplexNumber zu einer Pixelkoordinate um
  @complexNumber: Komplexe Zahl, welche umgerechnet werden soll
  @return: Pixelkoordinate als Array mit [x,y]
*/
function complexNumberToPixel(complexNumber) {
	let x = (complexNumber.re - xmin) * lengthOfOneXUnit;
  let y = (ymax - complexNumber.im) * lengthOfOneYUnit;
  
  let pixel = [x, y]
 	return pixel;
}


/*
calculateAxis()
	berechnet die Variablen complexHeight/Width und lengthOfOneX/YUnit neu
*/
function calculateAxis() {
  //Totale Brerite/Höhe des Canvas in komplexen Zahlen
  complexWidth = xmax - xmin;
  complexHeight = ymax - ymin;
  //länge einer Einheit auf der x resp. y Achse
  lengthOfOneXUnit = MANDELBROT_WIDTH/complexWidth;
  lengthOfOneYUnit = MANDELBROT_HEIGHT/complexHeight;
  
  //Breite des Canvas
	tempWidth = complexWidth;
  //Einheit, für die Beschriftung der Achsen
  unitX = 1;
  
  //Unit verändert sich, damit man die Einheit der Werte herausfindet (Multiplikator)
  while(tempWidth >= 10 || tempWidth < 1) {
    if (tempWidth >= 10) {
      tempWidth = tempWidth/10;
      unitX = unitX*10;
    } else if (tempWidth < 1) {
    	tempWidth = tempWidth * 10;
      unitX = unitX / 10;
    }
  }
  
  tempHeight = complexHeight;
  unitY = 1;
  while(tempHeight >= 10 || tempHeight < 1) {
    if (tempHeight >= 10) {
      tempHeight = tempHeight/10;
      unitY = unitY*10;
    } else if (tempHeight < 1) {
    	tempHeight = tempHeight * 10;
      unitY = unitY / 10;
    }
  }
}


/*
changeDisplayAxisState()
	setzt Variable auf true/false je nach Checkbox state
*/
function changeDisplayAxisState() {
  if (this.checked()) {
    displayAxis = true;
  } else {
    displayAxis = false;
  }
}


/*
changeDisplayAxisLabelState()
	setzt Variable auf true/false je nach Checkbox state
*/
function changeDisplayAxisLabelState() {
  if (this.checked()) {
    displayAxisLabel = true;
  } else {
    displayAxisLabel = false;
  }
}


/*
drawAxis():
 	Zeichnet Achsen und Achsenabschnitte auf das Canvas
*/
function drawAxis() {
  //setzt Farbe
  stroke(RED);

  //Zeichne Achsen
  line(0, lengthOfOneYUnit * ymax, MANDELBROT_WIDTH, lengthOfOneYUnit * ymax);
  line(lengthOfOneXUnit  * (-xmin), 0, lengthOfOneXUnit  * (-xmin), MANDELBROT_HEIGHT);
  
  
  
  //Zeichne Achsenabschnitte X-Achse, aber nur wenn Checkbox angekreuzt ist
  if(displayAxisLabel == true){
  	//wo der erste Abschnitt gezeichnet werden muss
    let startX = round(xmin / unitX) * unitX;
    //Anzahl Nachkommastellen
    let decimalPlacesX;

    if(unitX < 1) {
      decimalPlacesX = unitX.toString().length;
    } else {
   		//keine Nachkommastellen
      decimalPlacesX = 0;
    }
		
    //für die ganze Breite
    while(startX <= xmax) {
    	//berechne die Pixelkoordinate
      xAxisPoint = complexNumberToPixel(new ComplexNumber(startX, 0));
      //und zeichne dor die Linie
      line(xAxisPoint[0], xAxisPoint[1] + 5, xAxisPoint[0], xAxisPoint[1] - 5);

			//Beschrifte die Linie
      if(round(startX, decimalPlacesX) != 0) {
        text(round(startX, decimalPlacesX), xAxisPoint[0] - 5, xAxisPoint[1] + 20);
      } else {
      	//Ursprung beschriften
        text("0|0", xAxisPoint[0] + 10, xAxisPoint[1] + 20);
      }

      startX += unitX;
    }


    //Zeichne Achsenabschnitte Y-Achse
    //wo der erste Abschnitt gezeichnet werden muss
    let startY = round(ymin / unitY) * unitY;
    //Anzahl Nachkommastellen
    let decimalPlacesY;

    if(unitY < 1) {
      decimalPlacesY = unitY.toString().length;
    } else {
      //keine Nachkommastellen
      decimalPlacesY = 0;
    }
    
    //für die ganze Breite
    while(startY <= ymax) {
      //berechne die Pixelkoordinate
      yAxisPoint = complexNumberToPixel(new ComplexNumber(0, startY));
      //und zeichne dor die Linie
      line(yAxisPoint[0] + 5, yAxisPoint[1], yAxisPoint[0] - 5, yAxisPoint[1]);
      
			//Beschrifte die Linie      
      if(round(startY, decimalPlacesY) != 0) {
      	//Ursprung beschriften      
        text(round(startY, decimalPlacesY), yAxisPoint[0] + 15, yAxisPoint[1] + 4);
      }

      startY += unitY;
    }
    
    //Beschrifte Achsen mit Re(z), Im(z)
    let reLabel = complexNumberToPixel(new ComplexNumber(xmax, 0));
    text("Re(z)", reLabel[0] - 30, reLabel[1] - 10);
    let imLabel = complexNumberToPixel(new ComplexNumber(0, ymax));
    text("Im(z)", imLabel[0] - 30, imLabel[1] + 15);
  }
}


/*
numberOfMandelbrotIterations()
	gibt die Anzahl Folgeglieder (=iterations) für einen bestimmten Punkt zurück
  @z: komplexe Zahl
  @return: Anzahl Folgeglieder (amountOfSuccessors) der komplexen Zahl z
*/
function numberOfMandelbrotIterations(z){
  let successor = new ComplexNumber(z.re, z.im);
  
  //berechne immer wieder das Folgeglied des Folgegliedes bis zu einem gewissen Schwellwert
  for (let amountOfSuccessors = 1; amountOfSuccessors <= max_iterations; amountOfSuccessors++) {
  	//Wenn ein Folgeglied eine grössere Distanz als "limit" (standardmässig 2) hat wird die Anzahl der Folgeglieder zurückgegeben (limit = Beschränktheit)
    if (successor.abs() > limit) {
      return amountOfSuccessors;
    }
		//ansonsten wird ein weiteres Folgeglied berechnet
    successor = successor.square().add(z);
  }
  //falls bis zum Schwellwert (max_iterations) nicht abgebrochen wird, dann wird der Schwellwert ausgegeben -> es gehört also zur Mandelbrotmenge
  return max_iterations;
}


/*
colorMandelbrotIterations()
	gibt jedem Pixel eine Farbe
  @iterations: Anzahl Iterationen
  @return: gibt den Hue Wert der Iteration zurück
*/
function colorMandelbrotIterations(iterations) {
	//setze erste und letzte Farbe auf Userinput
  let last_iteration_hue = last_iteration_hue_slider.value();
  let first_iteration_hue = first_iteration_hue_slider.value();
  let step;
  
  //wenn last_iteration kleiner als first_iteration
  if(last_iteration_hue < first_iteration_hue) {
  	last_iteration_hue += 360;
  }
  
  //setze ein Step, so dass es gleichmässig wird
  let hue = first_iteration_hue;
  step = floor((last_iteration_hue-first_iteration_hue) / max_iterations);
  
  //falls zu viele Iterationen wird step = 0
  if (step == 0) {
  	step = 1;
  }
  
  //immer ein Schritt addieren
  for(let i=0; i < iterations; i++) {
    hue = hue + step;
  }

	//wenn es grösser als 360 ist, -360
	if(hue > 360) {
    hue -= 360;
  }
  
  //gib den Hue-Wert zurück
  return hue;
}


/*
drawMandelbrot()
	zeichnet die Mandelbrotmenge
*/
function drawMandelbrot() {
  //für jedes Pixel
  for (let y = 0; y <= MANDELBROT_HEIGHT; y++) {
    for (let x = 0; x <= MANDELBROT_WIDTH; x++) {

      //rechnet die Koordinate in komplexer Form aus und berechnet, wie viele Iterationen es braucht -> iterations
      let iterations = numberOfMandelbrotIterations(pixelToComplexNumber(x, y));

      //wenn es zur Mandelbrotmenge gehört, färbe es schwarz
      if (iterations == max_iterations) {
        set(x, y, color(BLACK));
      }
      //ansonsten Farbig
      else {
        //iteration_color wird in der Funktion colorMandelbrotIterations berechnet
        let iteration_color = colorMandelbrotIterations(iterations);
        //verwende HSB-Farbmodell
        colorMode(HSB);
        //setze HSB Werte
				let c = color(iteration_color, 100, 100);
        //färbe das Pixel
        set(x, y, c);
      }
    }
  }
  //Pixel updaten
  updatePixels();
}


//Zoom Funktionen
/*
mouseWheel()
	wenn das Mausrad gedreht wird, rufe die Funktion zoom(faktor, typ) auf
*/
function mouseWheel(event){
	//nur wenn auf dem Canvas gescrollt wird
	if(mouseX <= WIDTH && mouseY <= HEIGHT) {
    zoom(event.delta, MOUSEWHEEL);
  }
}


/*
buttonZoomIn/Out()
	wenn der +/- Button gedrückt wird, rufe die Funktion zoom(faktor, typ) auf
*/
function buttonZoomIn(){
	zoom(0, BUTTON);
}
function buttonZoomOut(){
	zoom(2, BUTTON);
}


/*
fixedPointZoom()
	Funktion, welcher reinzoomt und einen bestimmten Punkt an der selben Stelle lässt
  @factor: Faktor, wie stark reingezoomt wird
  @fixX/Y: welcher Punkt an der selben Stelle bleibt
*/
function fixedPointZoom(factor, fixX, fixY) {
	//komplexe Zahl aus fixX und fixY
	let fixC = pixelToComplexNumber(fixX, fixY);
  //Bereich links resp. oberhalb des Fixpunktes in Prozent
  let px = fixX/MANDELBROT_WIDTH;
  let py = fixY/MANDELBROT_HEIGHT;
  //alte Werte speichern
  let old_xmin = xmin;
  let old_xmax = xmax;
  let old_ymin = ymin;
  let old_ymax = ymax;
	//berechne xmin...
	xmin = fixC.re - ((px*(old_xmax-old_xmin))*factor);
  xmax = fixC.re + (((1-px)*(old_xmax-old_xmin))*factor);
  ymin = fixC.im - (((1-py)*(old_ymax-old_ymin))*factor);
  ymax = fixC.im + (((py)*(old_ymax-old_ymin))*factor);
}


/*
zoom()
	organisiert 2 Zoommethoden
  @factor: faktor, wie stark reingezoomt wird
  @type: zoom-type
*/
function zoom(factor, type){
		//rein oder rauszoomen
    if (factor > 0) {
      factor = 1.1;
    } else {
      factor = 0.9;
    }
  
  //mousewheel Zoom
  if(type == MOUSEWHEEL) {
  	fixedPointZoom(factor, mouseX, mouseY);
  }
  //button Zoom
  else if (type == BUTTON) {
  	fixedPointZoom(factor, WIDTH/2, HEIGHT/2);
  }
}


/*
mousePressed/Released()
	erkennt, wenn Maus gedrückt wird
*/
function mousePressed() {
	//wenn shift auch gedrückt wird, dann bereite Rechteckzoom vor
  if (shift_pressed == 1) {
  	//speichere Startkoordinaten
    startDrag = [mouseX, mouseY];
    rectangleZoom_state = 1;
   }
}
function mouseReleased() {
	//wenn Maus losgelassen wird, dann bereite weiter den RectangleZoom aus
	if (rectangleZoom_state == 1) {
  	//speichere Endkoordinaten
    endDrag = [mouseX, mouseY];
    rectangleZoom();
    rectangleZoom_state = 0;
  }
}


/*
rectangleZoom()
	setzt xmin,... auf neue Werte vom Drag
*/
function rectangleZoom() {
	//Start/EndDrag Koordinate zu komplexer Zahl
	let start = pixelToComplexNumber(startDrag[0], startDrag[1]);
  let end = pixelToComplexNumber(endDrag[0], endDrag[1]);
  
  //Diese Bedingung erlaubt auch das ziehen eines Rechteckes in eine andere richtung als von rechts Oben nach links unten
  //setze Werte xmin... neu
  if (start.re < end.re) {
  	xmin = start.re;
  	xmax = end.re;
  } else {
  	xmin = end.re;
    xmax = start.re;
  }
  
  if (start.im < end.im) {
  	ymin = start.im;
  	ymax = end.im;
  } else {
    ymin = end.im;
    ymax = start.im;
  }
}


/*
getBoundaries()
	nimmt Werte von Bild und aktualisiert die Werte in den Inputfeldern
*/
function getBoundaries() {
  xmin_input.value(xmin);
  xmax_input.value(xmax);
  ymin_input.value(ymin);
  ymax_input.value(ymax);
      
 	xmin_adjusted = xmin;
  xmax_adjusted = xmax;
  ymin_adjusted = ymin;
  ymax_adjusted = ymax;
  
  adjusted = false;
}
/*
adjustBoundaries()
	aktualiesiert xmin... mit dem Wert, welcher eignetippt wurde
*/
function adjustBoundaries() {
	xmin = parseFloat(xmin_adjusted);
  xmax = parseFloat(xmax_adjusted);
  ymin = parseFloat(ymin_adjusted);
  ymax = parseFloat(ymax_adjusted);
  adjusted = false;
}
/*
adjustBoundary...()
	nimmt die Inputwerte und updated ..._adjusted Variable
*/
function adjustBoundaryXmin() {
	adjusted = true;
  xmin_adjusted = this.value();
}
function adjustBoundaryXmax() {
	adjusted = true;
	xmax_adjusted = this.value();
}
function adjustBoundaryYmin() {
	adjusted = true;
	ymin_adjusted = this.value();
}
function adjustBoundaryYmax() {
	adjusted = true;
	ymax_adjusted = this.value();
}


/*
adjustLimit() und updateLimit
	verändert die Beschränkung gemäss Input Wert; zuerst wird eine Zwischenvariable gesetzt und erst auf Knopfdruck den Wert verändert
*/
function adjustLimit() {
	limit_adjusted = this.value();
}
function updateLimit() {
	limit = parseFloat(limit_adjusted);
}


/*
adjustMaxIterations() und updateMaxIterations
	verändert den Schwellenwert gemäss Input Wert; zuerst wird eine Zwischenvariable gesetzt und erst auf Knopfdruck den Wert verändert
*/
function adjustMaxIterations() {
	threshold_adjusted = this.value();
}
function updateMaxIterations() {
	max_iterations = parseFloat(threshold_adjusted);
}


/*
keyPressed()
	erkennt, ob eine Taste gedrückt wird
*/
function keyPressed() {
	//bewege das Bild mit Pfeiltasten
	let factor = 0.10;
  if (keyCode === LEFT_ARROW) {
    xmin += 1 * factor;
    xmax += 1 * factor;
  }
  else if (keyCode === RIGHT_ARROW) {
    xmin -= 1 * factor;
    xmax -= 1 * factor;
  }
  else if (keyCode === UP_ARROW) {
    ymin -= 1 * factor;
    ymax -= 1 * factor;
  }
  else if (keyCode === DOWN_ARROW) {
    ymin += 1 * factor;
    ymax += 1 * factor;
  }
  
  //wenn Shift gedrückt wird (für Rechteckzoom)
  if (keyCode == SHIFT) {
  	shift_pressed = 1;
  }
}


/*
keyReleased()
	erkennt, ob eine Taste losgelassen wird (shift für Rechteckzoom)
*/
function keyReleased () {
  if (keyCode == SHIFT) {
  	shift_pressed = 0;
  }
}


/*
centerImage()
	Zentriert das Bild neu
*/
function centerImage() {
	xmin = -2;
	xmax = 1;
	ymin = -1;
	ymax = 1;
}


/*
saveToPNG()
	speichert das Canvas als PNG
*/
function saveToPNG() {
	saveCanvas(canvas, 'mandelbrot_jonjampen', 'png');
}



/*
draw()
	wird immer wieder ausgeführt
*/
function draw() {
	// Werte in Inputfeldern werden hier zwischengespeichert
  if(adjusted == false) {
    xmin_input.value(xmin);
    xmax_input.value(xmax);
    ymin_input.value(ymin);
    ymax_input.value(ymax);
    
    xmin_adjusted = xmin;
    xmax_adjusted = xmax;
    ymin_adjusted = ymin;
    ymax_adjusted = ymax;
  }

  //Mandelbrot zeichnen und Werte berechnen
  calculateAxis();
  drawMandelbrot();
  
  //Achsen zeichnen, falls Checkbox ist angekreuzt
  if(displayAxis == true) {
  	drawAxis();
  }  
    
  //Zeichne ein Rechteck, wenn der User den Rechteckzoom verwendet  
  if(rectangleZoom_state == 1) {    
  	//setze Farbe
    stroke("green");
    //zeichne Rechteck
    line(startDrag[0],startDrag[1],startDrag[0],mouseY);
    line(startDrag[0],startDrag[1],mouseX, startDrag[1]);
    line(mouseX,mouseY, mouseX, startDrag[1]);
    line(startDrag[0],mouseY, mouseX, mouseY);
  }
}


//Klassen
/*
class ComplexNumber:
	beinhaltet Methoden für das Rechnen mit Komplexen Zahlen
*/
class ComplexNumber {
  
  constructor(re, im){
      this.re = re;
      this.im = im;
  }
  
  //absolute value
  abs(){
  	return Math.sqrt(this.re**2 + this.im**2);
  }
  
  //addition
  add(z){
    this.re = this.re + z.re;
    this.im = this.im + z.im;
    return this;
  }
  
  conjugate(){
    this.re = this.re;
    this.im = this.im * (-1);
    return this;
  }
  
  multiply(z){
    let im_neu, re_neu;
    re_neu = this.re * z.re + this.im * z.im * (-1);
    im_neu = this.re * z.im + this.im * z.re;
    this.re = re_neu;
    this.im = im_neu;
    return this;
  }
  
  negate(){
    this.re = this.re * (-1);
    this.im = this.im * (-1);
    return this;
  }
  
  square(){
    let im_neu, re_neu;
    re_neu = this.re * this.re + this.im * this.im * (-1);
    im_neu = 2 * (this.re * this.im);
    this.re = re_neu;
    this.im = im_neu;
		return this;
  }
  
  subtract(z){
    return this.add(z.negate());
  	//this.re = this.re - z.re;
    //this.im = this.im - z.im;
    //return this;
  }
}
