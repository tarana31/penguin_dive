
enchant();   //start enchant.js

window.onload = function() {
    
    var game = new Game(340,440);         //starting point  //instance of Game class
    game.preload('res/water.png',
                'res/penguinSheet.png',
                'res/Ice.png');

    //game settings
    game.fps= 30;                //frames per sec
    game.scale= 1;
    game.onload= function() {
        console.log("lets play! Penguin Penguin");
        var scene = new SceneGame();        
        
        //starting scene
        game.pushScene(scene);
    }
    game.start();
};


var SceneGame = Class.create(Scene,{
    initialize: function(){

        var game,bg,penguin,iceGroup,label;
        
        Scene.apply(this);  //Call superclass constructor

        game = Game.instance;  //access to the game singleton instance        

        // Label
        label = new Label('SCORE<br>0');
        label.x = 9;
        label.y = 32;        
        label.color = 'black';
        label.font = '16px strong';
        label.textAlign = 'center';
        label._style.textShadow ="-1px 0 black, 0 1px black, 1px 0 black, 0 -1px black";
        this.scoreLabel = label;


        // add background
        bg = new Sprite(340,440);       //(width,height)
        bg.image = game.assets['res/water.png'];

        //add Penguin
        penguin= new Penguin();
        penguin.x = game.width/2 - penguin.width/2;                     //set penguin position
        penguin.y = 280;
        this.penguin = penguin;
        
        // add Ice group
        iceGroup = new Group();
        this.iceGroup = iceGroup;
        
        //adding items
        this.addChild(bg);             //addChild method means that the node you add will become one of the scene’s child nodes.
        //this variable refers to the current instance of SceneGame  
        this.addChild(iceGroup);   
        this.addChild(penguin);
        this.addChild(label);

        this.addEventListener(Event.TOUCH_START,this.handleTouchControl);   // touch listener to move penguin on screen touch
        this.addEventListener(Event.ENTER_FRAME, this.update);      //update

        //instance variables
        this.generateIceTimer = 0;
        this.scoreTimer = 0;        //timer to increase the game score as time passes
        this.score = 0;             //score variable contains the game score

    },

    handleTouchControl: function (evt) {
        var laneWidth, lane;
        laneWidth = 340/3;
        lane = Math.floor(evt.x/laneWidth);
        lane = Math.max(Math.min(2,lane),0);
        this.penguin.switchToLaneNumber(lane);
    },

    update: function(evt) {

        // Score increase as time passes
        this.scoreTimer += evt.elapsed * 0.001;
        if (this.scoreTimer >= 0.5) 
        {
            this.setScore(this.score + 1);
            this.scoreTimer -= 0.5;
        }

        // Check if it's time to create a new set of obstacles
        this.generateIceTimer += evt.elapsed * 0.001;
        if (this.generateIceTimer >= 0.5) 
        {
            var ice;
            this.generateIceTimer -= 0.5;
            ice = new Ice(Math.floor(Math.random()*3));
            this.iceGroup.addChild(ice);
        }

        // Check collision
        // Group node has a childNodes array that keeps track of all of its children. 
        //This block of code iterates through each child and checks if it collides with the penguin.
        for (var i = this.iceGroup.childNodes.length - 1; i >= 0; i--) {
            var ice;
            ice = this.iceGroup.childNodes[i];
            if (ice.intersect(this.penguin)){
                var game;
                game = Game.instance;
                this.iceGroup.removeChild(ice);        
                // this.bgm.stop();
	            game.replaceScene(new SceneGameOver(this.score));        
                break;
            }
        }
    },

    setScore: function (value) {
        this.score = value;
        this.scoreLabel.text = 'SCORE<br>' + this.score;
    }
});


 // Penguin
 var Penguin = Class.create(Sprite, {    
    initialize: function() {
        
        Sprite.apply(this,[30, 43]);        // Call superclass constructor
        this.image = Game.instance.assets['res/penguinSheet.png'];
        // Animation
        this.animationDuration = 0;
        this.addEventListener(Event.ENTER_FRAME, this.updateAnimation); //ENTER_FRAME is an event that is fired every frame
    },

    updateAnimation: function (evt) {        
        this.animationDuration += evt.elapsed * 0.001;     //The elapsed property stores time in milliseconds. 
        //  You can convert it to seconds by multiplying by 0.001. You’ll use the animationDuration variable to keep track of how much time has passed in seconds.  
        
        if (this.animationDuration >= 0.25) 
        {                                               //tells the penguin to flap his wings every 0.25 seconds.
            this.frame = (this.frame + 1) % 2;
            this.animationDuration -= 0.25;
        }
    },

    switchToLaneNumber: function(lane){     
        var targetX = 160 - this.width/2 + (lane-1)*90;
        this.x = targetX;
    }
});

// Ice
var Ice = Class.create(Sprite, {
    // The obstacle that the penguin must avoid
    initialize: function(lane) {
        
        Sprite.apply(this,[48, 49]);    // Call superclass constructor
        this.image  = Game.instance.assets['res/Ice.png'];      
        this.rotationSpeed = 0;
        this.setLane(lane);
        this.addEventListener(Event.ENTER_FRAME, this.update);
    },

    setLane: function(lane) {
        var game, distance;
        game = Game.instance;        
        distance = 90;
    
        this.rotationSpeed = Math.random() * 100 - 50;
    
        this.x = game.width/2 - this.width/2 + (lane - 1) * distance;
        this.y = -this.height;    
        this.rotation = Math.floor( Math.random() * 360 );    
    },

    update: function(evt) { 
        var ySpeed, game;
    
        game = Game.instance;
        ySpeed = 300;
        
        this.y += ySpeed * evt.elapsed * 0.001;
        this.rotation += this.rotationSpeed * evt.elapsed * 0.001;           
        if (this.y > game.height) 
        {
            this.parentNode.removeChild(this);        
        }
    }    
});

// SceneGameOver  
var SceneGameOver = Class.create(Scene, {
    initialize: function(score) {
        var gameOverLabel, scoreLabel;
        Scene.apply(this);
        this.backgroundColor = 'red';

        gameOverLabel = new Label("GAME OVER<br>Tap to Restart");
        gameOverLabel.x = 8;
        gameOverLabel.y = 128;
        gameOverLabel.color = 'white';
        gameOverLabel.font = '32px strong';
        gameOverLabel.textAlign = 'center';

        // Score label
        scoreLabel = new Label('SCORE<br>' + score);
        scoreLabel.x = 9;
        scoreLabel.y = 32;        
        scoreLabel.color = 'white';
        scoreLabel.font = '16px strong';
        scoreLabel.textAlign = 'center';        

        // Adding labels
        this.addChild(gameOverLabel);
        this.addChild(scoreLabel);

        this.addEventListener(Event.TOUCH_START, this.touchToRestart);

    },

    touchToRestart: function(evt) {
        var game = Game.instance;
        game.replaceScene(new SceneGame());
    }
    
});