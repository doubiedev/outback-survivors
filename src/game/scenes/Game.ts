import { Scene } from 'phaser';
import { GameScene } from '../types/GameScene';
import Player from '../Player';
import Enemy from '../Enemy';
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

        // Collision Enemy to Enemy
        // BUG: Enemies can overlap into each other
        this.physics.add.collider(
            this.enemySpawner.enemyGroup,
            this.enemySpawner.enemyGroup,
        );

        // Collision Player to Enemy
        // BUG: When enemies colliding with player, they get stuck to the player
        this.physics.add.collider(
            this.player,
            this.enemySpawner.enemyGroup,
            this.handlePlayerEnemyCollision,
            undefined,
            this
        );
    }

    update() {
        this.player.update();
        this.enemySpawner.update();
    }

    private handlePlayerEnemyCollision(obj1: any, obj2: any) {
        const player = obj1 as Player;
        const enemy = obj2 as Enemy;

        player.takeDamage(enemy.dmg);
    }
}
