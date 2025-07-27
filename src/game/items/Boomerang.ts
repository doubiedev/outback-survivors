import Phaser from 'phaser';
import Enemy from '../enemies/Enemy';
import { Item, ItemStats } from './Item';
import { Game } from '../scenes/Game';

export default class Boomerang extends Item {
    private sprite: Phaser.Physics.Arcade.Sprite;
    private returning = false;
    private player: Phaser.GameObjects.Sprite;
    private hitEnemies = new Set<Enemy>();

    constructor(scene: Game, stats: ItemStats, player: Phaser.GameObjects.Sprite) {
        super(scene, stats);
        this.player = player;

        this.sprite = scene.physics.add.sprite(player.x, player.y, 'boomerang');
        scene.add.existing(this.sprite);

        // Optional: ensure it's not affected by gravity
        // this.sprite.body.setAllowGravity(false);

        this.sprite.setDepth(5); // Above enemies
    }

    activate() {
        const scene = this.scene as Game;
        const target = this.findClosestEnemy(scene);

        if (!target) {
            this.sprite.destroy();
            return;
        }

        const angle = Phaser.Math.Angle.Between(this.sprite.x, this.sprite.y, target.x, target.y);
        const velocity = scene.physics.velocityFromRotation(angle, 300);

        this.sprite.setVelocity(velocity.x, velocity.y);

        // On overlap with enemy
        scene.physics.add.overlap(this.sprite, scene.enemySpawner.enemyGroup, (boomerangSprite, enemyObj) => {
            const enemy = enemyObj as Enemy;

            if (!this.hitEnemies.has(enemy)) {
                this.hitEnemies.add(enemy);
                enemy.onHit(this.stats);
            }
        });


        // In update loop
        scene.events.on('update', () => {
            if (this.returning) {
                const angleBack = Phaser.Math.Angle.Between(this.sprite.x, this.sprite.y, this.player.x, this.player.y);
                const velocityBack = scene.physics.velocityFromRotation(angleBack, 250);
                this.sprite.setVelocity(velocityBack.x, velocityBack.y);

                // Check for arrival
                if (Phaser.Math.Distance.Between(this.sprite.x, this.sprite.y, this.player.x, this.player.y) < 10) {
                    this.sprite.destroy();
                }
            }
        });
    }

    private findClosestEnemy(scene: Game): Enemy | null {
        let closest: Enemy | null = null;
        let minDist = Number.MAX_VALUE;

        scene.enemySpawner.enemyGroup.children.iterate(child => {
            const enemy = child as Enemy;
            const dist = Phaser.Math.Distance.Between(this.sprite.x, this.sprite.y, enemy.x, enemy.y);
            if (dist < minDist) {
                minDist = dist;
                closest = enemy;
            }
            return null;
        });

        return closest;
    }
}

