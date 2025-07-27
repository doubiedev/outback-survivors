import { GameScene } from '../types/GameScene';
import Enemy from './Enemy';

export default class EnemySpawner {
    private scene: GameScene;
    private enemiesList: Enemy[];
    public enemyGroup: Phaser.Physics.Arcade.Group;

    constructor(scene: GameScene) {
        this.scene = scene;
        this.enemiesList = [];

        this.enemyGroup = this.scene.physics.add.group({
            runChildUpdate: true,
            collideWorldBounds: true,
        });

    }

    update() {
        if (this.enemiesList.length < 5) {
            this.spawnEnemy();
        }
    }

    spawnEnemy() {
        const [x, y] = this.getSpawnLocation();
        const enemy = new Enemy(this.scene, x, y, 'enemy');
        this.enemyGroup.add(enemy);
        this.enemiesList.push(enemy);
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
}
