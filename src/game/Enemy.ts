import Phaser from 'phaser';
import Player from './Player';
import { GameScene } from './types/GameScene';

export default class Enemy extends Phaser.Physics.Arcade.Sprite {
    private player!: Player;
    public dmg: number;

    constructor(scene: Phaser.Scene, x: number, y: number, texture: string) {
        super(scene, x, y, texture);

        // Add to scene and enable physics
        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.setCollideWorldBounds(false);
        this.setBounce(1);

        // Cast the scene to GameScene and access the player
        this.player = (scene as GameScene).player;

        this.dmg = 1;
    }

    update() {
        const speed = 100;
        const dx = this.player.x - this.x;
        const dy = this.player.y - this.y;

        const distance = Math.sqrt(dx * dx + dy * dy);
        // if (distance < 24) {
        //     this.setVelocity(0, 0);
        //     return;
        // }

        const vx = (dx / distance) * speed;
        const vy = (dy / distance) * speed;

        this.setVelocity(vx, vy);
    }
}


