launchSnakeGame = function (windowId, isMaster) {
	//Canvas stuff
	var data = {"masterPosition": infos.position};
    	var canvas = createCanvas(windowId, "SNAKE", 400, 300, "gameSnake", isMaster, false, data);
    	var w = canvas.width;
    	var h = canvas.height;
    	var ctx = canvas.getContext("2d");
    	if (isMaster) {
        	shareMediaDisplay(windowId, "snake", "SNAKE", false, data);
    	}
		/*Inutile car elle permet dupliquer la fenetre avec un autre joueur.
		Dans le snake c'est inutile. 	
		*/

	//Lets save the cell width in a variable for easy control

var game = {

	cw : 10,
	d : "",
	food : {},
	score :0,
	canvas : canvas,
    W : canvas.width, // Window's width
    H : canvas.height, // Window's height
	
	
	//Lets create the snake now
	snake_array : [], //an array of cells to make up the snake
	
	init : function(){
		ctx = this.canvas.getContext("2d");
		console.log("W:"+this.W);
		console.log("H:"+this.H);

		
		d = "right"; //default direction
		this.create_snake();
		this.create_food(); //Now we can see the food particle
		//finally lets display the score
		score = 0;
		//Lets move the snake now using a timer which will trigger the paint function
		//every 60ms

		var that=this;
		if(typeof game_loop != "undefined") clearInterval(game_loop);
		game_loop = setInterval(this.paint, 60,this.snake_array,that);
	},


	
	
	create_snake : function ()
	{
		var length = 5; //Length of the snake
		this.snake_array = []; //Empty array to start with
		for(var i = length-1; i>=0; i--)
		{
			//This will create a horizontal snake starting from the top left
			this.snake_array.push({x: i, y:0});
		}
		
	},
	
	//Lets create the food now
	create_food :function ()
	{
		food = {
//			x: Math.round(Math.random()*(w-this.cw)/this.cw), 
//			y: Math.round(Math.random()*(h-this.cw)/this.cw), 
			x: Math.round(Math.random()*(this.W-this.cw)/this.cw), 
			y: Math.round(Math.random()*(this.H-this.cw)/this.cw), 

		};
		
		//This will create a cell with x/y between 0-44
		//Because there are 45(450/10) positions accross the rows and columns
	},
	
	//Lets paint the snake now
	paint : function (s,that)
	{
		console.log("dans game paint snake");	
		//To avoid the snake trail we need to paint the BG on every frame
		//Lets paint the canvas now
		ctx.fillStyle = "white";
//		ctx.fillRect(0, 0, w, h);
		ctx.fillRect(0, 0, that.W, that.H);
		ctx.strokeStyle = "black";
//		ctx.strokeRect(0, 0, w, h);
		ctx.strokeRect(0, 0, that.W, that.H);
		
		//The movement code for the snake to come here.
		//The logic is simple
		//Pop out the tail cell and place it infront of the head cell
		var nx = s[0].x;
		var ny =s[0].y;
		//These were the position of the head cell.
		//We will increment it to get the new head position
		//Lets add proper direction based movement now

		if(that.d == "right"){nx++;}
		else if(that.d == "left") nx--;
		else if(that.d == "up") ny--;
		else if(that.d == "down") ny++;

		//Lets add the game over clauses now
		//This will restart the game if the snake hits the wall
		//Lets add the code for body collision
		//Now if the head of the snake bumps into its body, the game will restart

		if(nx == -1 || nx == that.W/that.cw || ny == -1 || ny == that.H/that.cw || that.check_collision(nx, ny, s))
		{

			//restart game
			that.init();
			//Lets organize the code a bit now.
			return;
		}
		
		//Lets write the code to make the snake eat the food
		//The logic is simple
		//If the new head position matches with that of the food,
		//Create a new head instead of moving the tail
		if(nx == food.x && ny == food.y)
		{

			var tail = {x: nx, y: ny};
			score++;
			//Create new food
			that.create_food();
		}
		else
		{

			var tail = s.pop(); //pops out the last cell
		
			tail.x = nx; tail.y = ny;
		
		}
		//The snake can now eat the food.
		
		s.unshift(tail); //puts back the tail as the first cell
		
		for(var i = 0; i < s.length; i++)
		{
		
			var c = s[i];
			//Lets paint 10px wide cells
			that.paint_cell(c.x, c.y);
		}
		
		//Lets paint the food
		that.paint_cell(food.x, food.y);
		//Lets paint the score
		var score_text = "Score: " + score;
		ctx.fillText(score_text, 5, that.H-5);
	},
	
	//Lets first create a generic function to paint cells
	paint_cell : function (x, y)
	{
		
		ctx.fillStyle = "blue";
		ctx.fillRect(x*this.cw, y*this.cw, this.cw, this.cw);
		ctx.strokeStyle = "white";
		ctx.strokeRect(x*this.cw, y*this.cw, this.cw, this.cw);
	},
	
	check_collision : function (x, y, array)
	{
		//This function will check if the provided x/y coordinates exist
		//in an array of cells or not
		for(var i = 0; i < array.length; i++)
		{
			if(array[i].x == x && array[i].y == y)
			 return true;
		}
		return false;
	},
	
//tal,//	//Lets add the keyboard controls now
//	$(document).keydown(function(e){
//		var key = e.which;
//		//We will add another clause to prevent reverse gear
//		if(key == "37" && d != "right") d = "left";
//		else if(key == "38" && d != "down") d = "up";
//		else if(key == "39" && d != "left") d = "right";
//		else if(key == "40" && d != "up") d = "down";
//		//The snake is now keyboard controllable
//	})


	

	
	//ligne 296 PINGPONG
	launchFullScreen: function () {
		console.log("launchFullScreen");
        fullWindowSnake();
   }
}
//game.init();


$(document).keydown(function(e){
		var key = e.which;
		//We will add another clause to prevent reverse gear
		if(key == "37" && game.d != "right") game.d = "left";
		else if(key == "38" && game.d != "down") game.d = "up";
		else if(key == "39" && game.d != "left") game.d = "right";
		else if(key == "40" && game.d != "up") game.d = "down";
		//The snake is now keyboard controllable
	});


function fullWindowSnake() {
	console.log("fullWindowSnake");        

	
	if (!fullWindowState) {
        fullWindowState = true;
        var windowId = canvas.id.split('canvas')[1];
        console.log("windowId: "+windowId);

        // Canvas goes full window
        var canvasFullscreen = document.getElementById('canvasFullscreen');
        console.log("canvasFullscreen: "+canvasFullscreen);
        launchFullScreen(document.documentElement);
        
        saveLeft = canvas.parentElement.parentElement.offsetLeft;
        saveTop = canvas.parentElement.parentElement.offsetTop;
        saveDisplay = canvas.style.display;
        canvas.style.display = "none";
        
        canvasFullscreen.width = window.innerWidth;
        canvasFullscreen.height = window.innerHeight;
//        canvasFullscreen.width = 1024;
//        canvasFullscreen.height = 800;

        canvasFullscreen.style.display = "block";

        game.canvas = canvasFullscreen;        
		game.W = canvasFullscreen.width;
        game.H = canvasFullscreen.height;

		console.log("game.H: "+game.H);
		console.log("game.W: "+game.W);

		

                    
//        var endFullscreen = function (e) {
//            cancelFullScreen(document.documentElement);
//            canvas.style.display = saveDisplay;
//            game.canvas = canvas;
//            game.W = canvas.width;
//            game.H = canvas.height;
//            canvas.parentElement.parentElement.style.top = saveTop + "px";
//            canvas.parentElement.parentElement.style.left = saveLeft + "px";
//            
//            
//            canvasFullscreen.style.display = "none";
//            fullWindowState = false;
//            
////            canvasFullscreen.removeEventListener("mousemove", trackPosition, false);
////            canvasFullscreen.removeEventListener("touchmove", trackPosition, false);
////            canvasFullscreen.removeEventListener("mousedown", btnClick, false);
////            canvas.removeEventListener("endfullscreen", endFullscreen, false);
//			game.init();
//            
////            cancelPingPong();
////            startPingPong();
//        }
//        var askEndFullscreen = function (e) {
//            askRemoteSnakeGameControl(windowId, "snake", "endfullscreen", "", "all");
//        }
        
//        canvasFullscreen.addEventListener("mousemove", trackPosition, false);
//        canvasFullscreen.addEventListener("touchmove", trackPosition, false);
//        canvasFullscreen.addEventListener("mousedown", btnClick, false);
//        canvas.addEventListener('endfullscreen', endFullscreen , false);
        //fullscreenButton.addEventListener('mousedown', askEndFullscreen , false);
//        cancelPingPong();
//        startPingPong();
		game.init();

    }



}

windowList[windowId].data = { "game": game }

}
