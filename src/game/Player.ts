import Phaser from 'phaser';

type InputKeys = {
    W: Phaser.Input.Keyboard.Key;
    A: Phaser.Input.Keyboard.Key;
    S: Phaser.Input.Keyboard.Key;
    D: Phaser.Input.Keyboard.Key;
};

export default class Player extends Phaser.Physics.Arcade.Sprite {
    private keys!: InputKeys;

    constructor(scene: Phaser.Scene, x: number, y: number, texture: string) {
        super(scene, x, y, texture);

        // Add to scene and enable physics
        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.setCollideWorldBounds(true);
        this.setBounce(1);
        this.setDrag(1000, 0);

        // Create custom key map
        this.keys = scene.input.keyboard!.addKeys("W,A,S,D") as InputKeys;
    }

    update() {
        const speed = 200;
        let vx = 0;
        let vy = 0;
        const input = {
            left: this.keys.A.isDown,
            right: this.keys.D.isDown,
            up: this.keys.W.isDown,
            down: this.keys.S.isDown,
        };

        if (input.left) vx -= speed;
        if (input.right) vx += speed;
        if (input.up) vy -= speed;
        if (input.down) vy += speed;

        // Normalize to prevent faster diagonal movement
        if (vx !== 0 && vy !== 0) {
            const norm = Math.sqrt(2) / 2; // ≈ 0.707
            vx *= norm;
            vy *= norm;
        }

        this.setVelocity(vx, vy);
    }
}

