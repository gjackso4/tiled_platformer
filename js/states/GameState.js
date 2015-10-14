var StartPlatformer = StartPlatformer || {}

StartPlatformer.GameState = {
	init: function(level) {

		this.currentLevel = level || 'level1';

		//enable keyboard
		this.cursors = this.game.input.keyboard.createCursorKeys();
		this.RUNNING_SPEED = 180;
		this.JUMPING_SPEED = 550;
		this.BOUNCING_SPEED = 150;

		this.game.world.setBounds(0,0,980,360);

		//adding gravity
		this.game.physics.arcade.gravity.y = 1000;

	},

	create: function(){

		//create background
		this.loadlevel();

		this.createOnscreenControls();

	},

	update: function(){

		//physics stuff
		this.game.physics.arcade.collide(this.player, this.collisionLayer);
		this.game.physics.arcade.collide(this.enemies, this.collisionLayer);
		this.game.physics.arcade.collide(this.player, this.enemies, this.hitEnemy, null, this);

		this.player.body.velocity.x = 0;
		this.player.body.collideWorldBounds = true;

		//overlap of player and goal.
		this.game.physics.arcade.overlap(this.player, this.goal, this.changelevel);

		//check if keys are pressed

	    if(this.cursors.left.isDown || this.player.customParams.isMovingLeft) {
	      this.player.body.velocity.x = -this.RUNNING_SPEED;
	      this.player.scale.setTo(1, 1);
	      this.player.play('walking');
	    }
	    else if(this.cursors.right.isDown || this.player.customParams.isMovingRight) {
	      this.player.body.velocity.x = this.RUNNING_SPEED;
	      this.player.scale.setTo(-1, 1);
	      this.player.play('walking');
	    }
	    else {
	      this.player.animations.stop();
	      this.player.frame = 3;
	    }

	    if((this.cursors.up.isDown || this.player.customParams.mustJump) && (this.player.body.blocked.down || this.player.body.touching.down)) {
	      this.player.body.velocity.y = -this.JUMPING_SPEED;
	      this.player.customParams.mustJump = false;
	    }

	    if(this.player.bottom == this.game.world.height ) {
	    	this.gameOver();
	    }

	},

	loadlevel: function() {

		this.map = this.add.tilemap(this.currentLevel);
		this.map.addTilesetImage('tiles_spritesheet', 'gameTiles');

		//create layers
		this.backgroundLayer = this.map.createLayer('background_layer');
		this.collisionLayer = this.map.createLayer('collision_layer');

		this.collisionLayer.resizeWorld();

		this.game.world.sendToBack(this.backgroundLayer);


		this.map.setCollisionBetween(1, 160, true, 'collision_layer');

		//find goal
		var goalArr = this.findObjectsByType('goal', this.map, 'object_layer'); // find in tilemap
		this.goal = this.add.sprite(goalArr[0].x, goalArr[0].y, 'goal');

		this.game.physics.arcade.enable(this.goal);
		this.goal.body.allowGravity = false;
		this.goal.nextLevel = goalArr[0].properties.next_level;

		//create player
		var playerArr = this.findObjectsByType('player', this.map, 'object_layer'); // find in tilemap

		this.player = this.add.sprite(playerArr[0].x, playerArr[0].y , 'player', 3);
		this.player.anchor.setTo(0.5);
		this.player.animations.add('walking', [0, 1, 2, 1], 6, true);
		this.game.physics.arcade.enable(this.player);
		this.player.customParams = {};

		this.game.camera.follow(this.player);

		//create enemys 

		this.enemies = this.add.group();

		this.createEnemies();
	},

	createOnscreenControls: function() {
	    this.leftArrow = this.add.button(20, this.game.height - 60, 'arrowButton');
	    this.rightArrow = this.add.button(110, this.game.height - 60, 'arrowButton');
	    this.actionButton = this.add.button(this.game.width - 100, this.game.height - 60, 'actionButton');

	    this.leftArrow.alpha = 0.5;
	    this.rightArrow.alpha = 0.5;
	    this.actionButton.alpha = 0.5;

	    this.leftArrow.fixedToCamera = true;
	    this.rightArrow.fixedToCamera = true;
	    this.actionButton.fixedToCamera = true;

	    this.actionButton.events.onInputDown.add(function(){
	      this.player.customParams.mustJump = true;
	    }, this);

	    this.actionButton.events.onInputUp.add(function(){
	      this.player.customParams.mustJump = false;
	    }, this);

	    //left
	    this.leftArrow.events.onInputDown.add(function(){
	      this.player.customParams.isMovingLeft = true;
	    }, this);

	    this.leftArrow.events.onInputUp.add(function(){
	      this.player.customParams.isMovingLeft = false;
	    }, this);

	    this.leftArrow.events.onInputOver.add(function(){
	      this.player.customParams.isMovingLeft = true;
	    }, this);

	    this.leftArrow.events.onInputOut.add(function(){
	      this.player.customParams.isMovingLeft = false;
	    }, this);

	    //right
	    this.rightArrow.events.onInputDown.add(function(){
	      this.player.customParams.isMovingRight = true;
	    }, this);

	    this.rightArrow.events.onInputUp.add(function(){
	      this.player.customParams.isMovingRight = false;
	    }, this);

	    this.rightArrow.events.onInputOver.add(function(){
	      this.player.customParams.isMovingRight = true;
	    }, this);

	    this.rightArrow.events.onInputOut.add(function(){
	      this.player.customParams.isMovingRight = false;
	    }, this);		
	},

	findObjectsByType: function(targetType, tilemap, layer) {
		var result = [];

		tilemap.objects[layer].forEach(function(element){
			if(element.properties.type == targetType) { // new version of tiled json doesn't require "properties use - element.type"
				element.y -= tilemap.tileHeight; // because phaser uses top left while tiled uses bottom left
				result.push(element);
			}
		}, this);

		return result;
	},

	changelevel: function(player, goal) {
		console.log('go to ' + goal.nextLevel);
		StartPlatformer.game.state.start('Game', true, false, goal.nextLevel);
		
	}, 

	createEnemies: function() {
		var enemyArr = this.findObjectsByType('enemy', this.map, 'object_layer');
		var enemy;

		enemyArr.forEach( function(element) {
			enemy = new StartPlatformer.Enemy(this.game, element.x, element.y, 'slime', +element.properties.velocity, this.map);
			this.enemies.add(enemy);
		},this);
	},

	hitEnemy: function(player, enemy) {
		if(enemy.body.touching.up) {
			enemy.kill();
			player.body.velocity.y = -this.BOUNCING_SPEED;
		} else {
			this.gameOver();
		}
	},

	gameOver: function(){
		this.game.state.start('Game', true, false, this.currentLevel);
	}
	
};