import Phaser from 'phaser';
import Player from '../player/Player';
import { ItemStats, StatusEffect } from '../items/Item';
import { Game } from '../scenes/Game';

export default class Enemy extends Phaser.Physics.Arcade.Sprite {
    private player!: Player;
    public damage: number;
    public speed: number;
    public hp: number = 5;
    private activeEffects: StatusEffect[] = [];

    constructor(scene: Phaser.Scene, x: number, y: number, texture: string) {
        super(scene, x, y, texture);

        // Add to scene and enable physics
        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.setCollideWorldBounds(false);
        this.setBounce(1);

        // Cast the scene to GameScene and access the player
        this.player = (scene as Game).player;

        this.damage = 1;
        this.speed = 100;
    }

    update(delta: number) {
        this.updateEffects(delta)

        if (!this.isFrozen()) {
            const angle = Phaser.Math.Angle.Between(this.x, this.y, this.player.x, this.player.y);
            const finalSpeed = this.getModifiedSpeed();
            this.scene.physics.velocityFromRotation(angle, finalSpeed, this.body!.velocity);
        } else {
            this.setVelocity(0, 0);
        }
    }

    public onHit(stats: ItemStats) {
        this.takeDamage(stats.damage);
        this.applyKnockback(stats.knockback);
        this.addStatusEffects(stats.effects);
    }

    takeDamage(damage: number) {
        this.hp -= damage;

        if (this.hp <= 0) this.destroy();
    }

    applyKnockback(knockback: number) {
        if (knockback > 0) {
            const angle = Phaser.Math.Angle.Between(this.x, this.y, this.player.x, this.player.y);
            this.scene.physics.velocityFromRotation(angle + Math.PI, knockback, this.body!.velocity);
        }
    }

    addStatusEffects(effects: StatusEffect[] | undefined) {
        if (!effects) {
            return
        }

        const newEffects = effects.map(effect => ({
            ...effect,
            elapsed: 0,
        }));

        this.activeEffects.push(...newEffects);
    }

    updateEffects(delta: number) {
        const toKeep: StatusEffect[] = [];

        for (const effect of this.activeEffects) {
            effect.elapsed = (effect.elapsed ?? 0) + delta;

            switch (effect.type) {
                case 'burn':
                    if (effect.elapsed % 500 < delta) {
                        this.takeDamage(effect.strength);
                    }
                    break;

                case 'freeze':
                    // handled in isFrozen
                    break;

                case 'slow':
                    // handled in getModifiedSpeed
                    break;
            }

            if (effect.elapsed < effect.duration) {
                toKeep.push(effect);
            }
        }

        this.activeEffects = toKeep;
    }

    isFrozen(): boolean {
        return this.activeEffects.some(e => e.type === 'freeze');
    }

    getModifiedSpeed(): number {
        const slow = this.activeEffects.find(e => e.type === 'slow');
        return slow ? this.speed * (1 - slow.strength) : this.speed;
    }
}
