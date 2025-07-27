import Phaser from 'phaser';

export type StatusEffectType = 'bleed' | 'burn' | 'slow' | 'freeze';

export interface StatusEffect {
    type: StatusEffectType;
    strength: number;
    duration: number; // In milliseconds
    elapsed?: number;
};

export interface ItemStats {
    damage: number;
    knockback: number;
    effects?: StatusEffect[];
}

export abstract class Item extends Phaser.GameObjects.GameObject {
    stats: ItemStats;

    constructor(scene: Phaser.Scene, stats: ItemStats) {
        super(scene, 'Item');
        this.stats = stats;
    }

    abstract activate(): void;
}

