var StartPlatformer = StartPlatformer || {};

StartPlatformer.din = StartPlatformer.getLandscapeDimensions(700,350);
console.log(StartPlatformer.din);
//Start the FrameWork
StartPlatformer.game = new Phaser.Game(StartPlatformer.din.w, StartPlatformer.din.h, Phaser.AUTO);

StartPlatformer.game.state.add('Boot', StartPlatformer.BootState);
StartPlatformer.game.state.add('Preload', StartPlatformer.PreloadState);
StartPlatformer.game.state.add('Game', StartPlatformer.GameState);

StartPlatformer.game.state.start('Boot');