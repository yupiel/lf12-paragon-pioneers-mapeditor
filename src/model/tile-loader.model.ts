import { Vector2 } from '@/model/vector-two.model';

export interface ITileLoader {
    tileSheet: HTMLImageElement;
    tileSheetWidth: number;
    tileSheetHeight: number;
    tileWidth: number;
    tileHeight: number;
    tileTypePositionMap: Map<number, Vector2>
    typeTileMapping: Map<number, string>
    initialized: boolean

    tilePosToImgPos(pos: Vector2): Vector2
    waitForInitialized(callback: (loaded: boolean) => void): void
    getSpriteForTile(tileType: number): string | undefined
}