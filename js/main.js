
enchant();   //start enchant.js

window.onload = function() {
    
    var game = new Game(340,440);         //starting point  //instance of Game class
    game.preload('res/water.png',
                'res/penguinSheet.png');

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

        var game,bg,penguin;
        
        Scene.apply(this);  //Call superclass constructor

        game = Game.instance;  //access to the game singleton instance        

        // add background
        bg = new Sprite(340,440);       //(width,height)
        bg.image = game.assets['res/water.png'];

        //add Penguin
        penguin= new Penguin;
        penguin.x = game.width/2 - penguin.width/2;                     //set penguin position
        penguin.y = 280;
        this.penguin = penguin;
        
        //adding items
        this.addChild(bg);             //addChild method means that the node you add will become one of the scene’s child nodes.
        //this variable refers to the current instance of SceneGame     
        this.addChild(penguin);
        
        this.addEventListener(Event.TOUCH_START,this.handleTouchControl);   // touch listener to move penguin on screen touch

    },

    handleTouchControl: function (evt) {
        var laneWidth, lane;
        laneWidth = 340/3;
        lane = Math.floor(evt.x/laneWidth);
        lane = Math.max(Math.min(2,lane),0);
        this.penguin.switchToLaneNumber(lane);
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
        
        if (this.animationDuration >= 0.25) {           //tells the penguin to flap his wings every 0.25 seconds.
            this.frame = (this.frame + 1) % 2;
            this.animationDuration -= 0.25;
        }
    },

    switchToLaneNumber: function(lane){     
        var targetX = 160 - this.width/2 + (lane-1)*90;
        this.x = targetX;
    }
});
