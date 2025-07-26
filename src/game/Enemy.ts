import Phaser from 'phaser';
import Player from './Player';

export default class Enemy extends Phaser.Physics.Arcade.Sprite {
    private player: Player;

    constructor(scene: Phaser.Scene, x: number, y: number, texture: string, player: Player) {
        super(scene, x, y, texture);
        this.player = player;

        // Add to scene and enable physics
        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.setCollideWorldBounds(true);
        this.setBounce(1);
    }

    update() {
        const speed = 100;
        const dx = this.player.x - this.x;
        const dy = this.player.y - this.y;

        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance === 0) {
            this.setVelocity(0, 0);
            return;
        }

        const vx = (dx / distance) * speed;
        const vy = (dy / distance) * speed;

        this.setVelocity(vx, vy);
    }
}


