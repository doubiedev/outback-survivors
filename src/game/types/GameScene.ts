import Phaser from "phaser";
import Player from "../Player";

export interface GameScene extends Phaser.Scene {
    player: Player;
}
