import Phaser from 'phaser';
import Player from '../player/Player';
import { GameScene } from '../types/GameScene';

export default class Enemy extends Phaser.Physics.Arcade.Sprite {
    private player!: Player;
    public dmg: number;
    public speed: number;

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
        this.speed = 100;
    }

    update() {
        // if (distance < 24) {
        //     this.setVelocity(0, 0);
        //     return;
        // }

        // const dx = this.player.x - this.x;
        // const dy = this.player.y - this.y;
        // const distance = Math.sqrt(dx * dx + dy * dy);
        // const vx = (dx / distance) * this.speed;
        // const vy = (dy / distance) * this.speed;
        // this.setVelocity(vx, vy);

        // NOTE: not sure if below or above is more performant
        const angle = Phaser.Math.Angle.Between(this.x, this.y, this.player.x, this.player.y);
        this.scene.physics.velocityFromRotation(angle, this.speed, this.body!.velocity);
    }
}


