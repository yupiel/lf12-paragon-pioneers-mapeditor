import tileSheetUrl from '@/assets/Background_Tiles.png?url'
import { ITileLoader } from '@/model/ITileLoader.model';
import { TILE_TYPE, COAST_VARIATION, GRASS_VARIATION, MOUNTAIN_VARIATION } from '@/model/tile.model'
import { Vector2 } from '@/model/vector-two.model';

export class VariationTileLoader implements ITileLoader {

    tileSheet: HTMLImageElement;
    tileSheetWidth: number;
    tileSheetHeight: number;
    tileWidth: number = 128;
    tileHeight: number = 128;
    tileTypePositionMap: Map<number, Vector2> = new Map<number, Vector2>([
        //small landmass
        [COAST_VARIATION.L_SMALL, {x: 3, y: 3}],
        [COAST_VARIATION.L_REVERSE_SMALL, {x: 3, y: 2}],
        [COAST_VARIATION.J_SMALL, {x: 4, y: 3}],
        [COAST_VARIATION.J_REVERSE_SMALL, {x: 4, y: 2}],
        //big landmass
        [COAST_VARIATION.L, {x: 0, y: 4}],
        [COAST_VARIATION.L_REVERSE, {x: 0, y: 2}],
        [COAST_VARIATION.J, {x: 2, y: 4}],
        [COAST_VARIATION.J_REVERSE, {x: 2, y: 2}],
        [COAST_VARIATION.STRAIGHT_TOP, {x: 1, y: 2}],
        [COAST_VARIATION.STRAIGHT_RIGHT, {x: 2, y: 3}],
        [COAST_VARIATION.STRAIGHT_BOTTOM, {x: 1, y: 4}],
        [COAST_VARIATION.STRAIGHT_LEFT, {x: 0, y: 3}],
        // mountain
        [MOUNTAIN_VARIATION.L, {x: 0, y: 11}],
        [MOUNTAIN_VARIATION.L_REVERSE, {x: 2, y: 9}],
        [MOUNTAIN_VARIATION.J, {x: 2, y: 11}],
        [MOUNTAIN_VARIATION.J_REVERSE, {x: 3, y: 9}],
        [MOUNTAIN_VARIATION.STRAIGHT_TOP, {x: 1, y: 9}],
        [MOUNTAIN_VARIATION.STRAIGHT_RIGHT, {x: 2, y: 10}],
        [MOUNTAIN_VARIATION.STRAIGHT_BOTTOM, {x: 1, y: 11}],
        [MOUNTAIN_VARIATION.STRAIGHT_LEFT, {x: 0, y: 10}],
        [MOUNTAIN_VARIATION.L_REVERSE_END, {x: 0, y: 9}],
        [MOUNTAIN_VARIATION.J_REVERSE_END, {x: 2, y: 9}],
        // Grass
        [GRASS_VARIATION.NO_TREES, {x: 0, y: 0}],
        [GRASS_VARIATION.ONE_TREE, {x: 0, y: 0}],
        [GRASS_VARIATION.TWO_TREES, {x: 0, y: 0}],
        [GRASS_VARIATION.THREE_TREES, {x: 0, y: 0}],
        [TILE_TYPE.WATER, { x: 3, y: 0 }],
        [TILE_TYPE.MOUNTAIN, { x: 1, y: 0 }],
        [TILE_TYPE.COAST, { x: 2, y: 0 }],
        [TILE_TYPE.GRASS_FIELD, { x: 0, y: 1 }],
    ]);

    private typeTileMapping = new Map<number, string>()

    constructor() {
        this.tileSheet = new Image();
        this.tileSheet.src = new URL(tileSheetUrl, import.meta.url).href
        this.tileSheetWidth = this.tileSheet.width;
        this.tileSheetHeight = this.tileSheet.height;
    }

    initialize(callback: (loaded: boolean) => void) {
        this.tileSheet.onload = () => {
            for (let tileType of Object.keys(TILE_TYPE).filter((v) => !isNaN(Number(v)))) {
                this.typeTileMapping.set(Number(tileType), this.getTile(Number(tileType)) as string)
            }
            for (let coastVar of Object.keys(COAST_VARIATION).filter((v) => !isNaN(Number(v)))) {
                this.typeTileMapping.set(Number(coastVar), this.getTile(Number(coastVar)) as string)
            }
            for (let mountainVar of Object.keys(MOUNTAIN_VARIATION).filter((v) => !isNaN(Number(v)))) {
                this.typeTileMapping.set(Number(mountainVar), this.getTile(Number(mountainVar)) as string)
            }
            for (let grassVar of Object.keys(GRASS_VARIATION).filter((v) => !isNaN(Number(v)))) {
                this.typeTileMapping.set(Number(grassVar), this.getTile(Number(grassVar)) as string)
            }

            callback(true)
        }
    }

    private getTile(tileType: number): string | ImageData | undefined {
        let canvas = document.createElement('canvas');
        canvas.width = 128;
        canvas.height = 128;
        const context = canvas.getContext('2d');
        let tilePos = this.tileTypePositionMap.get(tileType);
        if (tilePos && context) {
            let imgPos: Vector2 = this.tilePosToImgPos(tilePos);
            context.drawImage(this.tileSheet,
                imgPos.x,
                imgPos.y,
                this.tileWidth,
                this.tileHeight,
                0,
                0,
                50,//this.tileWidth,
                50);//this.tileHeight);

            return canvas.toDataURL()
        }
        return undefined;
    }

    getSpriteForTile(tileType: number): string | undefined {
        return this.typeTileMapping.get(tileType)
    }

    tilePosToImgPos(pos: Vector2): Vector2 {
        let xi: number = pos.x * this.tileWidth;
        let yi: number = pos.y * this.tileHeight;

        return { x: xi, y: yi };
    }

}