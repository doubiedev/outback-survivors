import { Scene } from 'phaser';
import { GameScene } from '../types/GameScene';
import Player from '../Player';
import EnemySpawner from '../EnemySpawner';

export class Game extends Scene {
    camera: Phaser.Cameras.Scene2D.Camera;
    background: Phaser.GameObjects.Image;

    public player!: Player;
    private enemySpawner!: EnemySpawner;

    constructor() {
        super('Game');
    }

    preload() {
        this.load.image('player', 'assets/player.png');
        this.load.image('enemy', 'assets/enemy.png');
    }

    create() {
        this.camera = this.cameras.main;
        this.camera.setBackgroundColor(0x00ff00);
        this.background = this.add.image(512, 384, 'background');
        this.background.setAlpha(0.5);

        this.player = new Player(this, 100, 100, 'player');
        this.add.existing(this.player);
        this.physics.add.existing(this.player);

        this.enemySpawner = new EnemySpawner(this as GameScene);
    }

    update() {
        this.player.update();
        this.enemySpawner.update();
    }
}
