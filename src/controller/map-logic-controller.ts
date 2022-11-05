export const basicCoastMapping = (tiles: Tile[][]): Tile[][] => {
    for (let rowIndex = 0; rowIndex < tiles.length; rowIndex++) {
        const row = tiles[rowIndex]
        for (let columnnIndex = 0; columnnIndex < row.length; columnnIndex++) {
            const tile = row[columnnIndex];
            if(tile.tileType !== TILE_TYPE.COAST) continue
            
            let topTile = '!', rightTile = '!', bottomTile = '!', leftTile = '!'

            if (rowIndex !== 0 && tiles[rowIndex - 1][rowIndex].tileType === TILE_TYPE.WATER) topTile = 'W'
            if (rowIndex !== tiles[rowIndex].length - 1 && tiles[rowIndex][rowIndex + 1].tileType === TILE_TYPE.WATER) rightTile = 'W'
            if (rowIndex !== tiles.length - 1 && tiles[rowIndex + 1][rowIndex].tileType === TILE_TYPE.WATER) bottomTile = 'W'
            if (rowIndex !== 0 && tiles[rowIndex][rowIndex - 1].tileType === TILE_TYPE.WATER) leftTile = 'W'

            tiles[rowIndex][columnnIndex].coastVariation = basicCoastVariations.get(topTile + rightTile + bottomTile + leftTile)
        }
    }

    return tiles
}

export const advancedCoastMapping = (tiles: Tile[][]): Tile[][] => {
    for (let rowIndex = 0; rowIndex < tiles.length; rowIndex++) {
        const row = tiles[rowIndex]
        for (let columnnIndex = 0; columnnIndex < row.length; columnnIndex++) {
            const tile = row[columnnIndex];
            if(tile.tileType !== TILE_TYPE.COAST && tile.coastVariation !== COAST_VARIATION.DEFAULT) continue

            const coastConnections = getCoastOrientation(tiles, rowIndex, columnnIndex)

            
        }
    }
}

const getCoastOrientation = (tiles: Tile[][], rowIndex: number, columnnIndex: number): CoastConnections => {
    if (rowIndex !== 0 && tiles[rowIndex - 1][rowIndex].tileType === TILE_TYPE.COAST) 
        return coastConnectionMapper.get(tiles[rowIndex - 1][rowIndex].coastVariation as COAST_VARIATION) as CoastConnections

    if (rowIndex !== tiles[rowIndex].length - 1 && tiles[rowIndex][rowIndex + 1].tileType === TILE_TYPE.COAST) 
        return coastConnectionMapper.get(tiles[rowIndex][rowIndex + 1].coastVariation as COAST_VARIATION) as CoastConnections

    if (rowIndex !== tiles.length - 1 && tiles[rowIndex + 1][rowIndex].tileType === TILE_TYPE.COAST) 
        return coastConnectionMapper.get(tiles[rowIndex + 1][rowIndex].coastVariation as COAST_VARIATION) as CoastConnections

    if (rowIndex !== 0 && tiles[rowIndex][rowIndex - 1].tileType === TILE_TYPE.COAST) 
        return coastConnectionMapper.get(tiles[rowIndex][rowIndex - 1].coastVariation as COAST_VARIATION) as CoastConnections

    return coastConnectionMapper.get(COAST_VARIATION.DEFAULT) as CoastConnections
}

interface Tile {
    tileType: TILE_TYPE,
    coastVariation: COAST_VARIATION | undefined,
    position: Vector2,
    image: ImageData
}

interface Vector2 {
    x: number,
    y: number
}

enum TILE_TYPE {
    WATER,
    COAST,
    MOUNTAIN,
    GRASS_FIELD,
    FIELD_ONE_TREE,
    FIELD_TWO_TREES,
    FIELD_THREE_TREES
}

enum COAST_VARIATION {
    DEFAULT,

    //Landmasse klein
    L_SMALL,
    L_REVERSE_SMALL,
    J_REVERSE_SMALL,
    J_SMALL,

    //Landmasse Groß
    L,
    L_REVERSE,
    J_REVERSE,
    J,

    STRAIGHT_TOP,
    STRAIGHT_RIGHT,
    STRAIGHT_BOTTOM,
    STRAIGHT_LEFT,
}

const basicCoastVariations = new Map<string, COAST_VARIATION>([
    ['!!!!', COAST_VARIATION.DEFAULT],
    ['WWWW', COAST_VARIATION.DEFAULT],

    ['!!WW', COAST_VARIATION.L_SMALL],
    ['W!!W', COAST_VARIATION.L_REVERSE_SMALL],
    ['WW!!', COAST_VARIATION.J_REVERSE_SMALL],
    ['!WW!', COAST_VARIATION.J_SMALL],

    ['W!!!', COAST_VARIATION.STRAIGHT_TOP],
    ['!W!!', COAST_VARIATION.STRAIGHT_RIGHT],
    ['!!W!', COAST_VARIATION.STRAIGHT_BOTTOM],
    ['!!!W', COAST_VARIATION.STRAIGHT_LEFT],
])



interface CoastConnections {
    connectionDirection: ConnectionDirections,
    anchor: AnchorPoint[]
}
interface ConnectionDirections {
    top: boolean,
    right: boolean,
    bottom: boolean,
    left: boolean
}
enum AnchorPoint {
    TOP_RIGHT = 5,
    BOTTOM_RIGHT = 13,
    BOTTOM_LEFT = 8,
    TOP_LEFT = 21
}

const coastConnectionMapper = new Map<COAST_VARIATION, CoastConnections>([
    [COAST_VARIATION.DEFAULT, {connectionDirection: {top: true, right: true, bottom: true, left: true}, anchor: []}],

    [COAST_VARIATION.L_SMALL, {connectionDirection: {top: true, right: true, bottom: false, left: false}, anchor: [AnchorPoint.TOP_RIGHT]}],
    [COAST_VARIATION.L_REVERSE_SMALL, {connectionDirection: {top: false, right: true, bottom: true, left: false}, anchor: [AnchorPoint.BOTTOM_RIGHT]}],
    [COAST_VARIATION.J_REVERSE_SMALL, {connectionDirection: {top: false, right: false, bottom: true, left: true}, anchor: [AnchorPoint.TOP_LEFT]}],
    [COAST_VARIATION.J_SMALL, {connectionDirection: {top: true, right: false, bottom: false, left: true}, anchor: [AnchorPoint.TOP_LEFT]}],

    [COAST_VARIATION.L, {connectionDirection: {top: true, right: true, bottom: false, left: false}, anchor: [AnchorPoint.BOTTOM_LEFT]}],
    [COAST_VARIATION.L_REVERSE, {connectionDirection: {top: false, right: true, bottom: true, left: false}, anchor: [AnchorPoint.TOP_LEFT]}],
    [COAST_VARIATION.J_REVERSE, {connectionDirection: {top: false, right: false, bottom: true, left: true}, anchor: [AnchorPoint.BOTTOM_RIGHT]}],
    [COAST_VARIATION.J, {connectionDirection: {top: true, right: false, bottom: false, left: true}, anchor: [AnchorPoint.BOTTOM_RIGHT]}],

    [COAST_VARIATION.STRAIGHT_TOP, {connectionDirection: {top: false, right: true, bottom: false, left: true}, anchor: [AnchorPoint.BOTTOM_LEFT, AnchorPoint.BOTTOM_RIGHT]}],
    [COAST_VARIATION.STRAIGHT_RIGHT, {connectionDirection: {top: true, right: false, bottom: true, left: false}, anchor: [AnchorPoint.TOP_LEFT, AnchorPoint.BOTTOM_LEFT]}],
    [COAST_VARIATION.STRAIGHT_LEFT, {connectionDirection: {top: true, right: false, bottom: true, left: false}, anchor: [AnchorPoint.TOP_RIGHT, AnchorPoint.BOTTOM_RIGHT]}],
    [COAST_VARIATION.STRAIGHT_BOTTOM, {connectionDirection: {top: false, right: true, bottom: false, left: true}, anchor: [AnchorPoint.TOP_LEFT, AnchorPoint.TOP_RIGHT]}],
])
