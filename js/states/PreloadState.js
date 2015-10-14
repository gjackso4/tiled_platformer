var StartPlatformer = StartPlatformer || {}

StartPlatformer.PreloadState = {
	preload: function() {
		this.preloadbar = this.add.sprite(this.game.world.centerX, this.game.world.centerY, 'preloadbar');
		
		this.load.image('platform', 'assets/images/platform.png');
		this.load.spritesheet('player', 'assets/images/player_spritesheet.png', 28, 30, 5, 1, 1);
		this.load.image('actionButton', 'assets/images/actionButton.png');
		this.load.image('arrowButton', 'assets/images/arrowButton.png');
		this.load.image('goal', 'assets/images/goal.png');
		this.load.image('slime', 'assets/images/slime.png');


		this.load.image('gameTiles', 'assets/images/tiles_spritesheet.png');
		this.load.tilemap('level1', 'assets/level/level1.json', null, Phaser.Tilemap.TILED_JSON);
		this.load.tilemap('level2', 'assets/level/level2.json', null, Phaser.Tilemap.TILED_JSON);

		this.preloadbar.anchor.setTo(0.5);
		this.preloadbar.scale.setTo(1);

		this.load.setPreloadSprite(this.preloadbar);
		
	},
	create: function() {
		this.state.start('Game');
	}
};