var currSelectedTile = "00";
var currentRow = '0';
var indexGuessing = 0;
var guessing = ['-','-','-','-', '-'];
var guessWord = "ARBOL";
var words = [];
var wordsSet = new Set();
let mapGuessWord = new Map();
var teclado = new Map();


// Inicializa la partida
function inicializaGame()
{
    //Creamos una Tecla
    guardaPalabras();
    initKeyboard();
    selectTile(currSelectedTile);

    //Elige una palabra aleatoria del arreglo, numero entre 0 y el tamaño del arreglo
    var random = Math.floor(Math.random() * words.length);
    guessWord = words[random];

    console.log(guessWord);

    //Inicializamos el mapa con la palabra a adivinar
    for(var i = 0; i < guessWord.length; i++)
    {
        if(mapGuessWord.has(guessWord[i]))
        {
            mapGuessWord.set(guessWord[i], mapGuessWord.get(guessWord[i]) + 1);
        }
        else
        {
            mapGuessWord.set(guessWord[i], 1);
        }
    }
}

//Guardamos el set de palabras en un arreglo y en un set (desde el arvhivo txt)
function guardaPalabras()
{
    //Cargamos el archivo que está en assets/listado-general.txt
    var rawFile = new XMLHttpRequest();
    rawFile.open("GET", "../assets/listado-general.txt", false);
    rawFile.onreadystatechange = function (){
        if(rawFile.readyState === 4)
        {
            if(rawFile.status === 200 || rawFile.status == 0)
            {
                //Si la palabra tiene longitud de 5 letras se agrega al set
                var allText = rawFile.responseText;
                words = allText.split("\n");
                for(var i = 0; i < words.length; i++)
                {
                    if(words[i].length == 5)
                    {
                        wordsSet.add(eliminarAcentos(words[i]).toUpperCase());
                    }
                }
            }
        }
    }
    rawFile.send(null);

    //Vaciamos el arreglo words
    words = [];
    //Lo inicializamos con los mismos valores del set
    words = Array.from(wordsSet);
}

//Alimina los acentos de las palabras para posteriormente almacenarlas
function eliminarAcentos(cadena) {
    var mapaAcentos = {
      'á': 'a',
      'é': 'e',
      'í': 'i',
      'ó': 'o',
      'ú': 'u',
      'Á': 'A',
      'É': 'E',
      'Í': 'I',
      'Ó': 'O',
      'Ú': 'U'
    };
  
    return cadena.replace(/[áéíóúÁÉÍÓÚ]/g, function (caracter) {
      return mapaAcentos[caracter];
    });
  }
  
//Selecciona la casilla y le cambia el color del borde
function selectTile(tileId){
    if(currentRow == tileId[0]){
        indexGuessing = parseInt(tileId[1]);
        document.getElementById(currSelectedTile).style.border = "2px solid gray";
        currSelectedTile = tileId;
        document.getElementById(currSelectedTile).style.border = "2px solid blue";
    }
}

//Listens for a key
document.addEventListener('keydown', function(event) {
    var teclaPresionada = event.key;
    var letrasExpresion = /^[a-zA-Z]$/;
    if(letrasExpresion.test(teclaPresionada)){
        // console.log("Presionaste una letra " + teclaPresionada);
        agregaLetra(teclaPresionada);
    }
    else if(teclaPresionada === 'Backspace'){
        // console.log("Presionaste backspace");
        borraLetra();
    }
    else if(teclaPresionada === 'Enter'){
        // console.log("Presionaste enter");
        checkGuessing();
    }
    // console.log(guessing + " " + indexGuessing);
});


// Agrega la letra a la casilla seleccionada
function agregaLetra(letra){
    x = letra.toUpperCase();
    AddToGuessing(x[0]);
    document.getElementById(currSelectedTile).innerHTML = x;
    recorreTecla(1);
}

function borraLetra()
{
    document.getElementById(currSelectedTile).innerHTML = "";
    recorreTecla(-1);
}

//Recorre la casilla dependiendo si se agrega o se quita letra
function recorreTecla(dx){
    if(currSelectedTile[1] != '4' && dx == 1)
    {
        selectTile(currSelectedTile[0] + (parseInt(currSelectedTile[1]) + 1).toString())
    }
    else
    {
        if(indexGuessing >= 0 && dx == -1)
        {
            QuitToGuessing();
            if(indexGuessing > 0)
                selectTile(currSelectedTile[0] + (parseInt(currSelectedTile[1]) - 1).toString())
        }
    }
}

//Agrega la letra a la palabra que se está adivinando
function AddToGuessing(letra)
{
    if(indexGuessing <= 4){
        guessing[indexGuessing] = letra;
        if(indexGuessing < 4)
            indexGuessing++;
    }
}

//Quita la letra de la palabra que se está adivinando
function QuitToGuessing()
{
    if(indexGuessing >= 0){
        guessing[indexGuessing] = "-";
    }
}

//Verifica si la palabra es correcta
function checkGuessing()
{
    var tempGuessWordMap = new Map();
    //Copiamos el mapa de la palabra a adivinar
    for(var [key, value] of mapGuessWord)
    {
        tempGuessWordMap.set(key, value);
    }

    //Verifica si la longitud de la palabra es la correcta además verifica que la palabra exista en el
    if(guessing.includes("-") == false && wordsSet.has(guessing.join("")) == true)
    {
        //Do someting
        // console.log("Verificando palabra");
        //Recorremos vevecada una de las letras de la palabra
        var classTile = "row" + currentRow;
        var elements = document.getElementsByClassName(classTile);
        //Mapa donde almacenamos la cantidad de veces que se repite cada letra
        //Primero colocamos las verdes
        //Almacenams los colores para después aplicarlos y cambiarlos según corresponda
        var colores = ["gray", "gray", "gray", "gray", "gray"];

        //Verificamos los verdes (aciertos)
        for(var i = 0; i<=4; i++)
        {
            if(guessing[i] == guessWord[i])
            {
                //Si la letra es correcta la pintamos de verde
                colores[i] = "green";
                //Le quitamosuno a la cantidad de veces que se repite
                tempGuessWordMap.set(guessing[i], tempGuessWordMap.get(guessing[i]) - 1);
                //Cambiamos el color de la letra en el mapa
                teclado.set(guessing[i], "green");
                document.getElementById(guessing[i]).style.backgroundColor = "green";
            }
        }

        //Verificamos los amarillos (casi aciertos)
        for(var i = 0; i<=4; i++)
        {
            //Si la letra no es correcta, pero existe en la palabra y no sobrepasa la cantidad de veces que se repite
            if(guessing[i] != guessWord[i] && tempGuessWordMap.has(guessing[i]) && tempGuessWordMap.get(guessing[i]) > 0)
            {
                //Pintamos la letra de amarillo
                colores[i] = "yellow";
                //Le quitamos uno a la cantidad de veces que se repite
                tempGuessWordMap.set(guessing[i], tempGuessWordMap.get(guessing[i]) - 1);
                if(teclado.get(guessing[i]) != "green"){
                    teclado.set(guessing[i], "yellow");
                    document.getElementById(guessing[i]).style.backgroundColor = "yellow";
                }
            }
            else{
                //Cambiamos el color de la letra del teclado a negro
                if(teclado.get(guessing[i]) != "green" && teclado.get(guessing[i]) != "yellow"){
                    teclado.set(guessing[i], "black");
                    document.getElementById(guessing[i]).style.backgroundColor = "black";
                }
            }
        }

        //Pintamos cada una de las celdas según el color que corresponda en el arreglo
        for (var i = 0; i <= 4; i++) {
            (function (index) {
              // Timeout para que se ejecute cada animación y se aplique
              setTimeout(function () {
                elements[index].style.animation = "revela 0.5s linear";
                //Esperamos un momento para aplicar el color
                setTimeout(function () {
                    elements[index].style.backgroundColor = colores[index];
                    elements[index].style.color = "white";
                },400);
                
              },i* 500); // Multiplica i por 1000 para obtener segundos de espera crecientes
            })(i);
          }
          
          

        //Adivinó la palabra
        if(guessWord == guessing.join(""))
        {
            console.log("Ganaste");
        }else{
            //Si es a 4 y además no adivinó la palabra, entonces pierde
            if(currentRow == 5)
            {
                console.log("Perdiste");
            }
        }
        //Saltamos a la siguiente fila
        currentRow++;
        //Deseleccionamos la ultima tile
        document.getElementById(currSelectedTile).style.border = "2px solid gray";
        //Reiniciamos el arreglo de letras
        guessing = ['-','-','-','-', '-'];
        //Reiniciamos el indice de la letra
        indexGuessing = 0;
        //Reiniciamos el tile seleccionado
        currSelectedTile = currentRow + "0";
        //Seleccionamos el primer tile de la siguiente fila
        selectTile(currSelectedTile);
        
    }
    else
    {
        //Obtenemos la fila actual con su calsename
        var classTile = "row" + currentRow;
        var elements = document.getElementsByClassName(classTile);
        //Recorremos cada uno de los elementos y le aplicamos la animación
        for(var i = 0; i < elements.length; i++){
            elements[i].style.animation="move 0.1s ease-in-out 0s 3 alternate";
        }
        // Esperamos a que la animaxión termine y se la quitamos
        setTimeout(function(){
            for(var i = 0; i < elements.length; i++){
                elements[i].style.animation="";
            }
        },300);
    }
}


//Teclado
//Inicializa teclado
function initKeyboard(){
    //Agrega cada tecla en el mapa
    for(var i = 0; i < 26; i++)
    {
        var letra = String.fromCharCode(65 + i);
        teclado.set(letra, 'gray');
    }
}