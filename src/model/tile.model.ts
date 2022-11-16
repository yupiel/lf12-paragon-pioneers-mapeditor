import { Vector2 } from './vector-two.model'

export interface Tile {
    tileType: TILE_TYPE,
    tileVariation: COAST_VARIATION | MOUNTAIN_VARIATION | GRASS_VARIATION | undefined,
    position: Vector2,
    image: ImageData | undefined
}

export enum TILE_TYPE {
    WATER,
    COAST,
    MOUNTAIN,
    GRASS_FIELD,
}

export enum COAST_VARIATION {
    //small landmass
    L_SMALL = 100,
    L_REVERSE_SMALL,
    J_REVERSE_SMALL,
    J_SMALL,

    //big landmass
    L,
    L_REVERSE,
    J_REVERSE,
    J,

    STRAIGHT_TOP,
    STRAIGHT_RIGHT,
    STRAIGHT_BOTTOM,
    STRAIGHT_LEFT,
}

export enum MOUNTAIN_VARIATION {
    FLAT_END = 200,

    L,
    L_REVERSE,
    J_REVERSE,
    J,

    STRAIGHT_TOP,
    STRAIGHT_RIGHT,
    STRAIGHT_BOTTOM,
    STRAIGHT_LEFT,

    L_REVERSE_END,
    J_REVERSE_END,
}

export enum GRASS_VARIATION {
    NO_TREES = 300,
    ONE_TREE,
    TWO_TREES,
    THREE_TREES
}
