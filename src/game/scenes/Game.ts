import { Scene } from 'phaser';
import Player from '../Player';
import Enemy from '../Enemy';

export class Game extends Scene {
    camera: Phaser.Cameras.Scene2D.Camera;
    background: Phaser.GameObjects.Image;

    private player!: Player;
    private enemy!: Enemy;

    constructor() {
        super('Game');
    }

    preload() {
        this.load.image('player', 'assets/player.png');
        this.load.image('enemy', 'assets/enemy.png');
    }

    create() {
        // this.camera = this.cameras.main;
        // this.camera.setBackgroundColor(0x00ff00);
        //
        // this.background = this.add.image(512, 384, 'background');
        // this.background.setAlpha(0.5);

        this.player = new Player(this, 100, 100, 'player');
        this.enemy = new Enemy(this, 400, 400, 'enemy', this.player);

        // const ground = this.physics.add.staticGroup();
        // ground.create(400, 568, 'ground').setScale(2).refreshBody();
        //
        // this.physics.add.collider(this.player, ground);

        // this.input.once('pointerdown', () => {
        //
        //     this.scene.start('GameOver');
        //
        // });
    }

    update() {
        this.player.update();
        this.enemy.update();
    }
}
