import Phaser from 'phaser';

type InputKeys = {
    W: Phaser.Input.Keyboard.Key;
    A: Phaser.Input.Keyboard.Key;
    S: Phaser.Input.Keyboard.Key;
    D: Phaser.Input.Keyboard.Key;
};

export default class Player extends Phaser.Physics.Arcade.Sprite {
    private keys!: InputKeys;
    public hp: number;
    public maxHp: number;
    private healthBar: Phaser.GameObjects.Graphics;

    private isImmune: boolean = false;
    private immunityDuration: number = 500;

    constructor(scene: Phaser.Scene, x: number, y: number, texture: string) {
        super(scene, x, y, texture);

        // Add to scene and enable physics
        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.setCollideWorldBounds(true);
        this.setDrag(1000, 0);
        this.setImmovable(true)
        this.setDepth(5);

        // Player properties
        this.keys = scene.input.keyboard!.addKeys("W,A,S,D") as InputKeys;
        this.hp = 10;
        this.maxHp = 10;
        this.healthBar = scene.add.graphics();

        this.updateHealthBar();
        console.log('Player depth', this.depth, 'Health bar depth', this.healthBar.depth);
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
        this.updateHealthBar();
    }

    private updateHealthBar() {
        const barWidth = 40;
        const barHeight = 6;
        const offsetY = -this.height / 2 - 10;

        this.healthBar.setDepth(10);
        this.healthBar.clear();

        // Background (grey)
        this.healthBar.fillStyle(0x555555);
        this.healthBar.fillRect(this.x - barWidth / 2, this.y + offsetY, barWidth, barHeight);

        // Health (red -> green)
        const healthRatio = Phaser.Math.Clamp(this.hp / this.maxHp, 0, 1);
        const color = Phaser.Display.Color.Interpolate.ColorWithColor(
            new Phaser.Display.Color(255, 0, 0), // red
            new Phaser.Display.Color(0, 255, 0), // green
            100,
            healthRatio * 100
        );
        const fillColor = Phaser.Display.Color.GetColor(color.r, color.g, color.b);

        this.healthBar.fillStyle(fillColor);
        this.healthBar.fillRect(this.x - barWidth / 2, this.y + offsetY, barWidth * healthRatio, barHeight);
    }
    destroy(fromScene?: boolean): void {
        this.healthBar.destroy();
        super.destroy(fromScene);
    }

    takeDamage(amount: number) {
        if (this.isImmune) return;

        this.hp -= amount;
        this.isImmune = true;

        // Optional: add a flicker effect to show immunity
        this.setAlpha(0.5); // semi-transparent during immunity

        this.scene.time.delayedCall(this.immunityDuration, () => {
            this.isImmune = false;
            this.setAlpha(1); // reset to normal visibility
        });
    }

}

