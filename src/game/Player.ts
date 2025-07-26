import Phaser from 'phaser';

export default class Player extends Phaser.Physics.Arcade.Sprite {
    private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;

    constructor(scene: Phaser.Scene, x: number, y: number, texture: string) {
        super(scene, x, y, texture);

        // Add to scene and enable physics
        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.setCollideWorldBounds(true);
        this.setBounce(0.1);
        this.setDrag(1000, 0);

        // Create cursor keys
        this.cursors = scene.input.keyboard!.createCursorKeys();

    }

    update() {
        const speed = 200;
        const input = {
            left: this.cursors.left?.isDown,
            right: this.cursors.right?.isDown,
            up: this.cursors.up?.isDown,
            down: this.cursors.down?.isDown,
        };

        let vx = 0;
        let vy = 0;

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

