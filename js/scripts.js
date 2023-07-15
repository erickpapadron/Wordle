var currSelectedTile = "00";
var currentRow = '0';
var indexGuessing = 0;
var guessing = ['-','-','-','-', '-'];
var guessWord = "ARBOL";
var words = [];
var wordsSet = new Set();

function inicializaGame()
{
    guardaPalabras();
    selectTile(currSelectedTile);

    //Elige una palabra aleatoria del arreglo, numero entre 0 y el tamaño del arreglo
    var random = Math.floor(Math.random() * words.length);
    guessWord = words[random];
    console.log(guessWord);
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
        console.log("Presionaste una letra " + teclaPresionada);
        agregaLetra(teclaPresionada);
    }
    else if(teclaPresionada === 'Backspace'){
        console.log("Presionaste backspace");
        document.getElementById(currSelectedTile).innerHTML = "";
        console.log(indexGuessing);
        recorreTecla(-1);
    }
    else if(teclaPresionada === 'Enter'){
        console.log("Presionaste enter");
        checkGuessing();
    }
    console.log(guessing + " " + indexGuessing);
});


function agregaLetra(letra){
    x = letra.toUpperCase();
    AddToGuessing(x[0]);
    document.getElementById(currSelectedTile).innerHTML = x;
    recorreTecla(1);
}

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

function AddToGuessing(letra)
{
    if(indexGuessing <= 4){
        guessing[indexGuessing] = letra;
        if(indexGuessing < 4)
            indexGuessing++;
    }
}

function QuitToGuessing()
{
    if(indexGuessing >= 0){
        guessing[indexGuessing] = "-";
    }
}


function checkGuessing()
{
    //Verifica si la longitud de la palabra es la correcta además verifica que la palabra exista en el
    if(indexGuessing >= 4 && guessing.includes("-") == false && wordsSet.has(guessing.join("")) == true)
    {
        //Do someting
        console.log("Verificando palabra");
        //Recorremos cada una de las letras de la palabra
        var classTile = "row" + currentRow;
        var elements = document.getElementsByClassName(classTile);
        //Mapa donde almacenamos la cantidad de veces que se repite cada letra
        var tempMap = new Map();
        //Primero colocamos las verdes
        for(var i = 0; i<=4; i++)
        {
            //Ya tiene agregada esta letra
            if(tempMap.has(guessing[i]))
            {
                //Le sumamos uno a la cantidad de veces que se repite
                tempMap.set(guessing[i], tempMap.get(guessing[i]) + 1);
            }
            else{
                //Agregamos la letra al mapa
                tempMap.set(guessing[i], 1);
            }
            if(guessing[i] == guessWord[i])
            {
                //Si la letra es correcta la pintamos de verde
                elements[i].style.backgroundColor = "green";
            }
            else{
                //Si la letra es incorrecta, pero existe en la palabra y no sobrepasa la cantidad de veces que se repite la pintamos de amarillo
                if(guessWord.includes(guessing[i]) && tempMap.get(guessing[i]) <= guessWord.split(guessing[i]).length - 1)
                {
                    elements[i].style.backgroundColor = "yellow";
                }
                else{
                    //Si la letra no existe en la palabra la pintamos de gris
                    elements[i].style.backgroundColor = "gray";
                }
            }
        }
        tempMap.clear();
        //Recorrido inverso
        for(var i = 4; i>=0; i--)
        {
            //Ya tiene agregada esta letra
            if(tempMap.has(guessing[i]))
            {
                //Le sumamos uno a la cantidad de veces que se repite
                tempMap.set(guessing[i], tempMap.get(guessing[i]) + 1);
            }
            else{
                //Agregamos la letra al mapa
                tempMap.set(guessing[i], 1);
            }
            if(guessing[i] == guessWord[i])
            {
                //Si la letra es correcta la pintamos de verde
                elements[i].style.backgroundColor = "green";
            }
            else{
                //Si la letra es incorrecta, pero existe en la palabra y no sobrepasa la cantidad de veces que se repite la pintamos de amarillo
                if(guessWord.includes(guessing[i]) && tempMap.get(guessing[i]) <= guessWord.split(guessing[i]).length - 1)
                {
                    elements[i].style.backgroundColor = "yellow";
                }
                else{
                    //Si la letra no existe en la palabra la pintamos de gris
                    elements[i].style.backgroundColor = "gray";
                }
            }
        }
        //Verificamos si ya se termino el juego
        //Adivinó la palabra
        if(guessWord == guessing.join(""))
        {
            alert("Ganaste");
        }else{
            //Si es a 4 y además no adivinó la palabra, entonces pierde
            if(currentRow == 5)
            {
                alert("Perdiste");
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
