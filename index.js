/*
Armando Campos
3/6/17
*/
// Constants
const NONE = -1;

// General Methods
function getByID(name){
	return document.getElementById(name);
}

// Random Integer
function random_int(max){
	return Math.floor(Math.random()*max);
}

// Valid
function valid(value){
	return (value != NONE);
}

// Array: Remove Random
// (Warning, it does not check if there is no
// value left to remove)
function array_random_removal(array){
	var length = array.length;
	var pos = random_int(length);
	var val = array[pos];
	while(val == NONE){
		pos = random_int(length);
		val = array[pos];
	}
	array[pos] = NONE;
	alert("Random Removal: POSITION = "+String(pos)+" VALUE = "+String(val));
	return val;
}

// Array: Write
function array_write(array){
	var str = "[";
	for(var i = 0; i < array.length; i++){
		var ext = ", ";
		if(i == array.length-1)ext = "]";
		str+=String(array[i])+ext;
	}
	return str;
}
function array_write2D(array){
	var str = "[";
	for(var i = 0; i < array.length; i++){
		var ext = ", ";
		if(i == array.length-1)ext = "]";
		str+=array_write(array[i])+ext;
	}
	return str;
}

/*
Details:
Card Matching Game
4x4 Grid
*/

/*
GAME STATES:
0 - INITIALIZATION
1 - WAIT FOR PLAYER START
[Within Game Loop]
2 - CHECK CARD STATUS [LOSE / WIN -> 5]
3 - SETUP CARDS
4 - WAIT FOR PLAYER INPUT
5 - END [-> 1]
*/
var STATE = 0;
var GAME = {
    start : function() {
        this.interval = setInterval(update, 60);
        },
    cards : [[NONE, NONE, NONE, NONE], [NONE, NONE, NONE, NONE], [NONE, NONE, NONE, NONE], [NONE, NONE, NONE, NONE]],
    // Deck of 16 Cards, 2 of Each
    deck : [0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7],
}

// Game Methods
function play(){
	GAME.start();
	//alert("Cards 0,0 = "+String(GAME.cards[0][0]));
	//alert("RandomNumber of 16 = "+String(random_int(16)));
}

function update(){
	switch(STATE){
		case 0: // INITIALIZATION
			cards_wipe();
			
			STATE = 1;
			break;
		case 1: // WAIT FOR PLAYER START
			var next = false;// Push Start
			// Game Setup
			if(next){
				cards_refresh();
				STATE = 2;
			}
			break;
		case 2: // Check Card Status
			// All Cards Used
			if(deck_remaining == 0){
				alert("End Game");
				STATE = 5;
			}
			break;
		case 3:

			break;
		case 4:

			break;
		case 5: // Win
			alert("You Win!");
			break;
	}
}

// [ - - Cards - - ]
// Main Card Function
function card(cID){
	if(STATE != 1)return;
	// Check Card Status

	// Flip Card
	card_flip(cID);
	alert("hi");
	// Check Deck Status

}

// Flip Card
function card_flip(cID){
	var card = ecard_get(cID);
	alert("got card");
	card.toggleClass("card");
	card.toggleClass("card_flipped");
}

// Refresh Card Values
function cards_refresh(){
	// Each Card selects a random value from the Deck
	// Duplicate Deck
	var deck = GAME.deck.slice(0);
	for(var i = 0; i < 4; i++){
		for(var j = 0; j < 4; j++)card_set(i, j, array_random_removal(deck));
	}
	alert("Card Selection:\n"+array_write2D(GAME.cards));
}

function cards_wipe(){
	for(var i = 0; i < 4; i++){
		for(var j = 0; j < 4; j++)card_set(i, j, NONE);
	}
}

function card_get(cx, cy){
	return GAME.cards[cx][cy];
}

function card_set(cx, cy, cv){
	return GAME.cards[cx][cy] = cv;
}

// Element Card Get
function ecard_get(cID){
	return $('#card'+cID);
}

// Deck
function deck_remaining(){
	var num = 0;
	for(var i = 0; i < 4; i++){
		for(var j = 0; j < 4; j++){
			if(valid(card_get(i, j)))num++;
		}
	}
	return num;
}
