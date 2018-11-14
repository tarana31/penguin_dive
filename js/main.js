
enchant();   //start enchant.js

window.onload = function() {
    
    var game = new Game(500,440);         //starting point  //instance of Game class
    game.preload('res/water.png');

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

        var scene,bg,label;
        
        Scene.apply(this);  //Call superclass constructor

        game = Game.instance;  //access to the game singleton instance        

        // add background
        bg = new Sprite(500,440);       //(width,height)
        bg.image = game.assets['res/water.png'];

        //adding items
        this.addChild(bg);             //addChild method means that the node you add will become one of the scene’s child nodes.
        //this variable refers to the current instance of SceneGame     

        
    }
});
