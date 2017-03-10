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
	//alert("Random Removal: POSITION = "+String(pos)+" VALUE = "+String(val));
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

// [ - - Alarms - - ]
// Initialize Alarms
var alarm = [[NONE, valid, NONE], [NONE, valid, NONE]];
// Alarm Methods
function alarm_update(){
	for(var i = 0; i < alarm.length; i++){
		var time = alarm[i][0];
		var ticking = (time > 0);
		alarm[i][0] = time - 1;
		if(ticking){
			//alert("Alarm ticking:"+String(i));
			continue;
		}
		if(time != 0)continue;
		// Alarm Alert
		var func = alarm[i][1], param = alarm[i][2];
		//alert("Alarm Function: "+String(i)+"\nParameter: "+param);
		if(param == NONE){
			//alert("Alarm Function. No Parameter\n"+func);
			func();
		}else{
			//alert("Alarm "+String(i)+" Function. With Parameter");
			func(param);
		}
		// Reset Alarm
		alarm_set(i, NONE, valid, NONE);
	}
}

function alarm_add(time, func, param){
	// Check Alarms for an Empty Slot
	var open = NONE;
	for(var i = 0; i < alarm.length; i++){
		var tt = alarm[i][0];
		//alert(String(alarm[i][1]));
		//alert("Alarm Check "+String(i)+": "+String(tt));
		//alert("Time: "+time+" / NONE: "+NONE);
		if(tt < 0){
			open = i;
			break;
		}
	}

	alarm_set(open, time, func, param);
	//alert("Alarm Added "+String(open));
}

function alarm_set(aID, time, func, param){
	alarm[aID][0] = time;
	alarm[aID][1] = func;
	alarm[aID][2] = param;
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
    //alarm: [[NONE, valid, NONE], [NONE, valid, NONE]],
    cards : [[NONE, NONE, NONE, NONE], [NONE, NONE, NONE, NONE], [NONE, NONE, NONE, NONE], [NONE, NONE, NONE, NONE]],
    // Deck of 16 Cards, 2 of Each
    deck : [0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7],
    card_lst : NONE,
    match : function() {
    	//alert("Card Match!");
    },
    miss : function() {
    	//alert("Oh No! Those cards don't match!");
    }
}

// Game Methods
function play(){
	GAME.start();
	
	//alert("Cards 0,0 = "+String(GAME.cards[0][0]));
	//alert("RandomNumber of 16 = "+String(random_int(16)));
}

function update(){
	alarm_update();
	switch(STATE){
		case 0: // INITIALIZATION
			cards_wipe();
			
			STATE = 1;
			break;
		case 1: // WAIT FOR PLAYER START
			var next = true;// Push Start
			// Game Setup
			if(next){
				cards_refresh();
				STATE = 2;
			}
			break;
		case 2: // Player Turn

			break;
		case 3: // Check Card Status
			// All Cards Used
			if(deck_remaining == 0){
				alert("End Game");
				STATE = 5;
			}
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
	if(STATE != 2)return;
	var cc = $('#card'+String(cID));
	if(cc.hasClass('card_flipped'))return;
	// Check Card Status

	// Flip Card
	//$("#card0").attr("src", "assets/pizza.png");
	card_flip(cID);
	// Check Deck Status
	if(GAME.card_lst != NONE){
		// Compare to Held Card
		var c2ID = GAME.card_lst;
		var c1 = card_get(cp_x(cID), cp_y(cID));
		var c2 = card_get(cp_x(c2ID), cp_y(c2ID));
		if(c1 == c2){ // Match
			GAME.match();
			$('#card'+cID).toggleClass('card_final');
			$('#card'+c2ID).toggleClass('card_final');
		}else{ // Not a Match
			GAME.miss();
			// Re-Flip both Cards
			STATE = 3;
			card_flip_delay(cID, 12);
			card_flip_delay(c2ID, 12);
		}
		// Set Held Card to NONE
		//alert("Reseting Held Card!");
		GAME.card_lst = NONE;
		
	}else{
		// Hold this card
		GAME.card_lst = cID;
		//alert("Now Holding: "+String(cID));
	}
}

// Flip Card
function card_flip(cID){
	var cc = $('#card'+String(cID));
	cc.toggleClass("card");
	cc.toggleClass("card_flipped");
	var cvID = card_get(cp_x(cID), cp_y(cID));
	//alert("cvID="+cvID);
	var ext = String(cvID);
	if(cc.hasClass('card'))ext = "";
	cc.attr("src", "assets/card"+ext+".png");
}

function card_flip_ex(cID){
	card_flip(cID);
	STATE = 2;
}

// Flip Card, after Delay 
function card_flip_delay(cID, time){
	alarm_add(time, card_flip_ex, cID);
}

// Refresh Card Values
function cards_refresh(){
	// Each Card selects a random value from the Deck
	// Duplicate Deck
	var deck = GAME.deck.slice(0);
	for(var i = 0; i < 4; i++){
		for(var j = 0; j < 4; j++)card_set(i, j, array_random_removal(deck));
	}
	//alert("Card Selection:\n"+array_write2D(GAME.cards));
}

function cards_wipe(){
	for(var i = 0; i < 4; i++){
		for(var j = 0; j < 4; j++)card_set(i, j, NONE);
	}
	// Reset Image Sources + Classes
	for(var k = 0; k < 16; k++){
			var cc = $('#card'+String(k));
			cc.attr('src', 'assets/card.png');
			if(cc.hasClass('card_flipped')){
				cc.toggleClass('card');
				cc.toggleClass('card_flipped');
			}
			if(cc.hasClass('card_final'))cc.toggleClass('card_final');
		}
}

function card_get(cx, cy){
	//alert("Card Get : "+cx+" "+cy);
	return GAME.cards[cx][cy];
}

function card_set(cx, cy, cv){
	return GAME.cards[cx][cy] = cv;
}

function cp_x(cID){
	//alert("cp_x:"+cID+" = "+(cID%4));
	return (cID%4);
}

function cp_y(cID){
	return Math.floor(cID/4);
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

// Player Control Buttons
function btn_reset(){
	STATE = 0;
}

/*
TO-DO List:
- Finsh Game States {
	- Hold Last Flipped Card
	- Compare recent flip to new flip
}
- Display Game Over Pop-Up
- Style Buttons
- New Card Art
- Card Flip Animation
*/
