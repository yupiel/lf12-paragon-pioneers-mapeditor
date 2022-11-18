import tileSheetUrl from '@/assets/simple_tiles.png?url'
import { ITileLoader } from '@/model/tile-loader.model';
import { TILE_TYPE } from '@/model/tile.model'
import { Vector2 } from '@/model/vector-two.model';

export class SimpleTileLoader implements ITileLoader {

    tileSheet: HTMLImageElement;
    tileSheetWidth: number;
    tileSheetHeight: number;
    tileWidth: number = 128;
    tileHeight: number = 128;
    tileTypePositionMap: Map<number, Vector2> = new Map<number, Vector2>([
        [TILE_TYPE.WATER, { x: 0, y: 0 }],
        [TILE_TYPE.MOUNTAIN, { x: 1, y: 0 }],
        [TILE_TYPE.COAST, { x: 2, y: 0 }],
        [TILE_TYPE.GRASS_FIELD, { x: 0, y: 1 }],
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
                this.tileWidth,
                this.tileHeight);

            //return context.getImageData(0, 0, canvas.width, canvas.height);
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