import {TILE_TYPE, COAST_VARIATION, MOUNTAIN_VARIATION, GRASS_VARIATION} from '@/model/tile.model'
import { Vector2 } from '@/model/vector-two.model';

export interface ITileLoader {
    tileSheet: HTMLImageElement;
    tileSheetWidth: number;
    tileSheetHeight: number;
    tileWidth: number;
    tileHeight: number;
    tileTypePositionMap: Map<number, Vector2>

    tilePosToImgPos(pos: Vector2): Vector2
    getTile(tileType: number): ImageData | undefined
}