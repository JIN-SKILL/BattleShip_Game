//模型
var model = {
	boardSize:7,
	numShips:3,
	shipLength:3,
	shipsSunk:0,

	ships:[
	 	{ locations:[0, 0, 0], hits:["","",""] },
		{ locations:[0, 0, 0], hits:["","",""] },
		{ locations:[0, 0, 0], hits:["","",""] }
	],

	fire: function(guess){
		for(var i=0;i < this.numShips;i++){
			var ship = this.ships[i];
			var index = ship.locations.indexOf(guess);
			if(index>=0){
				ship.hits[index] = "hit";
				view.displayHit(guess);
				view.displayMessage("HIT!");
				if(this.isSunk(ship)){
					view.displayMessage("shut down!");
					this.shipsSunk++;
				}
				return true;
			}
		}
		view.displayMiss(guess);
		view.displayMessage("MISS!")
		return false;
	},

	isSunk: function(ship){
		for(var i=0;i<this.shipLength;i++){
			if(ship.hits[i] !== "hit"){
				return false;
			}
		}
		return true;
	},

	generateShipLocations: function(){
		var locations;
		for(var i = 0 ; i < this.numShips; i++){
			do {
				locations = this.generateShip();
			} while(this.collision(locations));
			this.ships[i].locations = locations;
		}
	},

	generateShip: function(){
		var direction = Math.floor(Math.random()*2);
		var row,col;

		if(direction === 1){
			//替水平擺放的船 產生一個起始位置
			row = Math.floor(Math.random() * this.boardSize);
			col = Math.floor(Math.random() * (this.boardSize - this.shipLength));
		}else{
			//替垂直擺放的船 產生一個起始位置
			row = Math.floor(Math.random() * (this.boardSize - this.shipLength));
			col = Math.floor(Math.random() * this.boardSize);
		}

		var newShipLocations = [];
		for(var i = 0; i < this.shipLength; i++){
			if(direction === 1){
				//為水平擺放的新船 將位置加入陣列
				newShipLocations.push(row + "" + (col + i));
			}else{
				//為垂直擺放的新船 將位置加入陣列
				newShipLocations.push((row + i) + "" + col);
			}
		}
		return newShipLocations;  //當所有位置產生 回傳陣列
	},

	collision: function(locations) {
		for( var i = 0; i < this.numShips; i++){
			var ship = model.ships[i];
			for(var j = 0; j < locations.length; j++){
				if(ship.locations.indexOf(locations[j]) >= 0){  //indexOf 沒找到的話 會回傳-1
					return true;
				}
			}
		}
		return false;
	}
}

//視圖
var view = {
    displayMessage:function(msg){
        var messageArea = document.getElementById("messageArea");
        messageArea.innerHTML = msg;
    },
    displayHit:function(location){
        var cell=document.getElementById(location);
        cell.setAttribute("class","hit");
    },
    displayMiss:function(location){
        var cell=document.getElementById(location);
        cell.setAttribute("class","miss");
    }
}

//控制器
var controller = {
	guesses: 0,
	processGuess: function(guess){
		var location = parseGuess(guess);
		if(location){
			this.guesses++;
			var hit = model.fire(location);
			if(hit && model.shipsSunk===model.numShips){
				view.displayMessage("你成功擊毀所有戰艦!,總共猜了 "+this.guesses+" 次");
			}
		}
	}
}

function parseGuess(guess){
	var alphabet = ["A","B","C","D","E","F","G"];

	if(guess===null || guess.length !==2){
		alert("oops! please enter a letter and a number on the board.");
	}else{
		firstChar = guess.charAt(0);
		turnUpper= firstChar.toUpperCase(); //小寫轉成大寫
		var row = alphabet.indexOf(turnUpper);
		var column = guess.charAt(1);

		if( isNaN(row) || isNaN(column) ){
			alert("oops! please enter a letter and a number on the board.");
		}else if(row < 0 || row >= model.boardSize || column < 0 || column >= model.boardSize){
			alert("oops! that's off the board!");
		}else{
			return row+column;
		}
	}
	return null;
}

function handleFireButton(){
	var guessInput = document.getElementById("guessInput");
	var guess = guessInput.value;
	controller.processGuess(guess);
	guessInput.value ="";
}

//enter鍵
function handleKeyPress(e){
	var fireButton = document.getElementById("fireButton");
	if(e.keyCode === 13){
		fireButton.click();
		return false;
	}
}

window.onload = init;

function init(){
	var fireButton = document.getElementById("fireButton");
	fireButton.onclick = handleFireButton;
	//enter鍵
	var guessInput = document.getElementById("guessInput");
	guessInput.onkeypress = handleKeyPress;

	model.generateShipLocations();
}
