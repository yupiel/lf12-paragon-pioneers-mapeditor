import tileSheetUrl from '@/assets/Background_Tiles.png?url'
import { ITileLoader } from '@/model/tile-loader.model';
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
        [COAST_VARIATION.L_SMALL, { x: 3, y: 3 }],
        [COAST_VARIATION.L_REVERSE_SMALL, { x: 3, y: 2 }],
        [COAST_VARIATION.J_SMALL, { x: 4, y: 3 }],
        [COAST_VARIATION.J_REVERSE_SMALL, { x: 4, y: 2 }],
        //big landmass
        [COAST_VARIATION.L, { x: 0, y: 4 }],
        [COAST_VARIATION.L_REVERSE, { x: 0, y: 2 }],
        [COAST_VARIATION.J, { x: 2, y: 4 }],
        [COAST_VARIATION.J_REVERSE, { x: 2, y: 2 }],
        [COAST_VARIATION.STRAIGHT_TOP, { x: 1, y: 4 }],
        [COAST_VARIATION.STRAIGHT_RIGHT, { x: 0, y: 3 }],
        [COAST_VARIATION.STRAIGHT_BOTTOM, { x: 1, y: 2 }],
        [COAST_VARIATION.STRAIGHT_LEFT, { x: 2, y: 3 }],
        // mountain
        [MOUNTAIN_VARIATION.L, { x: 0, y: 11 }],
        [MOUNTAIN_VARIATION.L_REVERSE, { x: 2, y: 9 }],
        [MOUNTAIN_VARIATION.J, { x: 2, y: 11 }],
        [MOUNTAIN_VARIATION.J_REVERSE, { x: 3, y: 9 }],
        [MOUNTAIN_VARIATION.STRAIGHT_TOP, { x: 1, y: 9 }],
        [MOUNTAIN_VARIATION.STRAIGHT_RIGHT, { x: 2, y: 10 }],
        [MOUNTAIN_VARIATION.STRAIGHT_BOTTOM, { x: 1, y: 11 }],
        [MOUNTAIN_VARIATION.STRAIGHT_LEFT, { x: 0, y: 10 }],
        [MOUNTAIN_VARIATION.L_REVERSE_END, { x: 0, y: 9 }],
        [MOUNTAIN_VARIATION.J_REVERSE_END, { x: 2, y: 9 }],
        // Grass
        [GRASS_VARIATION.NO_TREES, { x: 0, y: 0 }],
        [GRASS_VARIATION.ONE_TREE, { x: 0, y: 0 }],
        [GRASS_VARIATION.TWO_TREES, { x: 0, y: 0 }],
        [GRASS_VARIATION.THREE_TREES, { x: 0, y: 0 }],
        [TILE_TYPE.WATER, { x: 3, y: 5 }],
        [TILE_TYPE.MOUNTAIN, { x: 1, y: 11 }],
        [TILE_TYPE.COAST, { x: 2, y: 2 }],
        [TILE_TYPE.GRASS_FIELD, { x: 0, y: 1 }],
    ]);
    coastTileWaterMap: Map<number, Vector2> = new Map<number, Vector2>([
        //small coast water
        [COAST_VARIATION.L_SMALL, { x: 4, y: 7 }],
        [COAST_VARIATION.L_REVERSE_SMALL, { x: 4, y: 6 }],
        [COAST_VARIATION.J_SMALL, { x: 5, y: 7 }],
        [COAST_VARIATION.J_REVERSE_SMALL, { x: 5, y: 6 }],
        // big coast water
        [COAST_VARIATION.L, { x: 0, y: 7 }],
        [COAST_VARIATION.L_REVERSE, { x: 0, y: 5 }],
        [COAST_VARIATION.J, { x: 2, y: 7 }],
        [COAST_VARIATION.J_REVERSE, { x: 2, y: 5 }],
        [COAST_VARIATION.STRAIGHT_TOP, { x: 1, y: 7 }],
        [COAST_VARIATION.STRAIGHT_RIGHT, { x: 0, y: 6 }],
        [COAST_VARIATION.STRAIGHT_BOTTOM, { x: 1, y: 5 }],
        [COAST_VARIATION.STRAIGHT_LEFT, { x: 2, y: 6 }],
    ]);

    initialized = false
    typeTileMapping = new Map<number, string>()

    constructor() {
        this.tileSheet = new Image();
        this.tileSheet.src = new URL(tileSheetUrl, import.meta.url).href
        this.tileSheetWidth = this.tileSheet.width;
        this.tileSheetHeight = this.tileSheet.height;

        this.tileSheet.onload = () => {
            for (let tileType of this.tileTypePositionMap.keys()) {
                this.typeTileMapping.set(tileType, this.getTile(tileType) as string)
            }

            this.initialized = true
        }
    }

    async waitForInitialized(callback: (loaded: boolean) => void) {
        const poll = () => {
            if(this.initialized) callback(true)
            else setTimeout(() => poll(), 200)
        }
        poll()
    }

    private getTile(tileType: number): string | ImageData | undefined {
        let canvas = document.createElement('canvas');
        canvas.width = 50;
        canvas.height = 50;
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
            if (this.coastTileWaterMap.has(tileType)) {
                let tilePos = this.coastTileWaterMap.get(tileType);
                if (tilePos) {
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

                }
            }
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