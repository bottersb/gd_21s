# Gang,
wir werden für die Umsetzung des Spiels [p5.js](https://p5js.org/) nutzen, super.
p5.js ist eine Weiterführung des [Processing](https://processing.org/overview/) Projekts, welches am MIT Media Lab für den Einsatz im Bereich Kunst, (IT) Bildung und Pädagogik entwickelt wurde. Es handelt sich um ein Programmierwerkzeug, das die komplexen Vorgänge des zugrundeliegenden Systems vor dem Benutzer verbirgt. Man kann mit generativen Methoden, in diesem Fall imperativen Code, Visualisierungen erzeugen, z.B. ein Pie Chart. Eine Visualisierung in Abhängigkeit vom Ausführungszeitpunkt und einer möglichen Eingabe ist eine Animation.

## Simulation
Unser Spiel wird eine Simulation zum Thema "Schlaf" werden. Eine Simulation zeichnet sich durch den Einsatz verschieden gewichteter Parameter aus, die das Geschehen konstant beeinflussen. Bei gleichen Parametern wird die Simulation stets gleich ablaufen, durch menschliche Eingaben oder zufällige Events wird es fast nie zu zwei identen Simulationen kommen. Wenn die Simulation der Hauptbestandteil eines Spiels ist, so ist es häufig das Ziel bestimmte Werte zu optimieren. Im Bezug auf die Wirtschaft werden Simulation genutzt um Kosten zu optimieren und gleichzeitig andere Werte stabil zu halten, wie bspw. Mitarbeiterzufriedenheit, Sicherheitsniveaus oder die öffentliche Wahrnehmung. Das Justieren der möglichen Parameter eines Systems zur Erreichung eines Optimums kann eine herausfordernde und zugleich belohnende Aufgabe sein, besonders wenn die Parameter sich nicht nur linear auswirken. Man denke hier an die Dusche oder den Ofen, deren Hitze man aufgrund der Verzögerung man beim Starten häufig absichtlich übersteuert, um sie anschließend auf die gewünschte Temperatur zurückzudrehen. Manche Parameter können sich exponentiell auswirken; eine Tendenz, die Menschen häufig unterschätzen. 

## Spiel
Eine Simulation kann ein bierernstes wissenschaftliches Werkzeug sein, Arbeit, mit der richtigen Visualisierung jedoch wird es zum [Spiel](https://en.wikipedia.org/wiki/Simulation_video_game). Hier gibt es viele Erfolgsgeschichten, jedes Spiel mit dem Wort "Tycoon" oder "Manager" im Namen fällt in diese Kategorie. Ich persönlich bin ein großer Fan von einem Zeitfresser namen "Europa Universalis 4", eine Geschichtssimulation der Welt von 1444 bis 1821, die mir viel Neugierde auf vorher verschmähte Themen des Mittelalters gemacht hat wie Reformation oder Habsburger. 

### Elemente
Mit der richtigen Visualisierung kann hier pädagogisch viel geleistet werden. Die richtige Animation schafft es die Parameter und die Auswirkungen des eigenen Handeln klar zu verdeutlichen. 
Schlaf ist typischerweise eine Indoor-Activity, meistens findet sie im Schlafzimmer einer Person statt. Es bietet sich als Szene also ein Zimmer an.
Welche Einrichtungsgegenstände kann es geben:
• Stuhl
• Tisch + Zeug
• Schrank + Zeug 
• Tür
• Regal + Zeug
• Nachtisch + Zeug
• Pflanze
• Spiel/Sport/Hobby Gerät
• Kunst/Poster/Figuren
• Teppich
• Müll

Welche externen (auf die Spielfigur wirkend) und internen (Zustände der Spielfigur) Parameter kann es im Bezug auf Schlaf geben:
• Helligkeit
• Stress
• Lautstärke
• Müdigkeit
• Energie
• Ernährung
• Körpertemperatur
• Lebenserwartung
• Neuroplastizität
• Hormonspiegel
• Sauerstoff
• Schlafdauer
• Schlafintervall

Spiele zeichnen sich durch Interaktivität aus. Irgendwie muss man diese Parameter beeinflussen können. Welche Objekte kann es geben, die die genannten Parameter beeinflussen oder davon beeinflusst werden:
• Betten (Qualität)
• Kalender (Schedule)
• Uhren
• Fenster (Offen/Geschlossen, Vorhänge)
• Lampen (Decken-, Steh-, Nachtisch-, Leuchtreklame, Nachtlampe, Lämpchen an elekt. Geräten)
• Bildschirmgeräte (Computer, Tablet, Smartphone, Fernseher)

## Task
Es gibt einiges zu tun. Ich werde mich um die Hauptlogik des Spiels kümmern, alleine werde ich es aber nicht schaffen die Szene mit all den genannten Objekten zu füllen. Hier seid ihr gefragt, bitte helft mir beim zeitintensiven Unterfangen Objekte zu erstellen. Bitte seid so gut und **erstellt je ein Objekt und je eine Statusanzeige mittels p5.js**. 

Zur Verdeutlichung was ich mir vorstelle und wie eine animierte Statusanzeige aussehen kann, habe ich hier ein **Beispiel** vorbereitet:

**[p5.js Objekte und Leisten](https://editor.p5js.org/bottersb/sketches/7wmbXPdPj)**


## Mathe
Wenn ihr euch den Code com Sketch anseht, werdet ihr einiges an Mathe finden, namentlich Geometrie und Trigonometrie. Das kann abschreckend wirken aber nicht einschüchtern lassen. Aufgrund des zyklischen Verhaltens verschiedener Parameter wie Sonnenstand und Helligkeit, lässt dies hervorragend mit Sinus und Cosinus abbilden. Zur Erinnerung, der Einheitskreis (r=1) hat einen Umfang von 2*PI im Bogenmaß. Das bedeuted eine 90° Drehung in normalen Winkel, ein Viertel, ist dementsprechend mit PI/2 erreicht. Der Cosinus liefert für Vielfache von 2*PI den Wert 1 (beim Sinus 0) und oszilliert für andere Werte zwischen -1 und 1. Wenn man sich vor Augen führt, dass 2*PI quasi 100% eines Zyklus entsprechen, kann man daraus andere Werte berechnen. Beispielsweise hat eine Stunde, also (2*PI) / 24, eine Länge von ~0.2617 auf dem Einheitskreis. Der Rest ist "schnöde" Geometrie und der Dreisatz. Auch wenn das nicht jedem liegt, ich habe großes Vertrauen in euch, dass ihr diese Herausforderung spielend meistern werdet. Solltet ihr Probleme haben, dann stehe ich gerne zur Verfügung.
![Bogenmaß](https://upload.wikimedia.org/wikipedia/commons/4/4e/Circle_radians.gif)
## Programmieren

Nachfolgend einige Grundlagen:
```javascript
// Kommentare stehen rechts von doppelten Anführungszeichen
// Wichtig: 
// - Verarbeitet wird von oben nach unten
// - Bei Zuweisungen (x = y + z) wird zunächst die rechte Seite ausgeführt und der Wert dann der linken Variable zugewiesen
// - Code ist Case-Sensitive, dh Groß- und Kleinschreibung spielt eine Rolle
// - es gibt reservierte Begriffe, die farbig hervorgehoben werden, wie bspw. PI, arc, var

var variable // eine variable namens variable ohne wert, erzeugt dank 'var'
variable = 0 // für eine zuweisung muss die variable links vom gleich stehen
variable = variable + 1 // rechts vom gleich wird der dereferenziert, links wird der berechnete Wert zugewiesen

var strichpunkt = "toller text"; // neue variable mit text wert
// befehle sollten ';' abgeschlossen werden, muss aber nicht

// funktion 'color' liefert ein objekt zurück, das der dem Parameter 'red' entspricht. 
var col = color("red"); 

// 'function' sind zusammengefasste Blöcke von Code
// p5.js besitzt ein paar besondere funktionen wie setup: 
function setup(){
// setup wird nur einmal ausgeführt
	// die nachfolgende Funktion akzeptiert Parameter
	createCanvas(400, 400);
}

// draw wird jeden loop aufgerufen
function draw(){
	// ich kann auch eigene funktionen aufrufen
	meineEigeneFunktion();
	// text kann mit werten mittels '+' mit anderen Werten zu einem neuem text verbunden werden 
	var neueVariable = "Der neue Wert lautet: " + variable + "!";
	// mittels console.log() können werte in die tetausgabe geschrieben werden
	console.log(neueVariable);
}

function meineEigeneFunktion(){
	variable = variable + 2;
}

```
Leider kann ich euch nur einen grundlegenden Abriss geben, bei Fragen können Dominik und ich bestimmt jederzeit weiterhelfen. 

Nachfolgend noch einige Resourcen zu p5.js selbst:

[p5.js Web Editor](https://editor.p5js.org) (installieren nicht zwingend notwendig, man kann einfach das hier benutzen)

[Get Started](https://p5js.org/get-started/)
 
[Coordinate System and Shapes](https://p5js.org/learn/coordinate-system-and-shapes.html)

[Color](https://p5js.org/learn/color.html)

[Curves](https://p5js.org/learn/curves.html)

[Program Flow](https://p5js.org/learn/program-flow.html)

[Reference (alle Funktionen)](https://p5js.org/reference/)

[p5.js Beispiele I](https://p5js.org/examples/)

[p5.js Beispiele II](https://editor.p5js.org/p5/sketches)

[p5.js Beispiel "Simple Shapes"](https://p5js.org/examples/hello-p5-simple-shapes.html)

[p5.js Beispiel "Pie Chart"](https://p5js.org/examples/form-pie-chart.html)

[p5.js Beispiel "Lerp Color"](https://p5js.org/examples/color-lerp-color.html)

[p5.js Beispiel "Arcs"](https://happycoding.io/examples/p5js/calling-functions/arcs)

[p5.js Beispiel "Modulating Shapes"](https://gorillasun.de/blog/Modulating-Shapes-and-Creating-Patterns-in-P5JS-with-Sines-and-Cosines) (ziemlich cool)

[p5.js Subreddit](https://www.reddit.com/r/p5js/)

p5.js und das Procesing Projekt gehören zusammen, viele Beispiele für Processing (Processing 2 oder Processing 3 auf Google suchen) funktionieren 1 zu 1 in p5. Anders als Processing nutzt p5 die JavaScript Programmiersprache. Allgemeine Hilfen für JavaScript können für die Grundlagen ebenfalls empfohlen werden.
