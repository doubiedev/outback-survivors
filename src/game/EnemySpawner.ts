import { GameScene } from './types/GameScene';
import Enemy from './Enemy';

export default class EnemySpawner {
    private scene: GameScene;
    private enemies: Enemy[];

    constructor(scene: GameScene) {
        this.scene = scene;
        this.enemies = [];
    }

    spawnEnemy() {
        const [x, y] = this.getSpawnLocation();
        const enemy = new Enemy(this.scene, x, y, 'enemy');
        this.scene.add.existing(enemy);
        this.scene.physics.add.existing(enemy);

        this.enemies.push(enemy);
    }

    getSpawnLocation(): [number, number] {
        const player = this.scene.player;
        const minDistance = 150;
        let x = 0;
        let y = 0;

        do {
            x = Phaser.Math.Between(0, this.scene.scale.width);
            y = Phaser.Math.Between(0, this.scene.scale.height);
        } while (Phaser.Math.Distance.Between(x, y, player.x, player.y) < minDistance);

        return [x, y];
    }

    update() {
        if (this.enemies.length < 5) {
            this.spawnEnemy();
        }

        for (const enemy of this.enemies) {
            enemy.update();
        }
    }
}
