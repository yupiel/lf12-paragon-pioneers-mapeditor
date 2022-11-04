export const formatMap = (mapData: MapData): MapData => {
    for (let rowNum = 0; rowNum < mapData.tiles.length; rowNum++) {
        const row = mapData.tiles[rowNum];
        for (let tileNum = 0; tileNum < row.length; tileNum++) {
            const tile = row[tileNum];
            if (tile.type !== TILE_TYPE.COAST) continue

            mapData.tiles[rowNum][tileNum].variation = getVariation(mapData.tiles, rowNum, tileNum)
        }
    }

    return mapData
}

const getVariation = (tiles: Tile[][], rowNum: number, tileNum: number): TILE_VARIATION => {
    let topTile = '!', rightTile = '!', bottomTile = '!', leftTile = '!'

    if (rowNum != 0 && tiles[rowNum - 1][tileNum].type == TILE_TYPE.WATER) topTile = 'W'
    if (tileNum != tiles[rowNum].length - 1 && tiles[rowNum][tileNum + 1].type == TILE_TYPE.WATER) rightTile = 'W'
    if (rowNum != tiles.length - 1 && tiles[rowNum + 1][tileNum].type == TILE_TYPE.WATER) bottomTile = 'W'
    if (tileNum != 0 && tiles[rowNum][tileNum - 1].type == TILE_TYPE.WATER) leftTile = 'W'

    return coastVariation.get(topTile + rightTile + bottomTile + leftTile) as TILE_VARIATION
}

export enum TILE_VARIATION {
    DEFAULT,

    L,
    L_REVERSE,
    J_REVERSE,
    J,

    STRAIGHT_TOP,
    STRAIGHT_RIGHT,
    STRAIGHT_BOTTOM,
    STRAIGHT_LEFT,

    ISLAND_TOP,
    ISLAND_RIGHT,
    ISLAND_BOTTOM,
    ISLAND_LEFT,

    BRIDGE_VERTICAL,
    BRIDGE_HORIZONTAL,
}

const coastVariation = new Map<string, TILE_VARIATION>([
    ['!!!!', TILE_VARIATION.DEFAULT],
    ['WWWW', TILE_VARIATION.DEFAULT],

    ['!!WW', TILE_VARIATION.L],
    ['W!!W', TILE_VARIATION.L_REVERSE],
    ['WW!!', TILE_VARIATION.J_REVERSE],
    ['!WW!', TILE_VARIATION.J],

    ['W!!!', TILE_VARIATION.STRAIGHT_TOP],
    ['!W!!', TILE_VARIATION.STRAIGHT_RIGHT],
    ['!!W!', TILE_VARIATION.STRAIGHT_BOTTOM],
    ['!!!W', TILE_VARIATION.STRAIGHT_LEFT],

    ['!WWW', TILE_VARIATION.ISLAND_TOP],
    ['W!WW', TILE_VARIATION.ISLAND_RIGHT],
    ['WW!W', TILE_VARIATION.ISLAND_BOTTOM],
    ['WWW!', TILE_VARIATION.ISLAND_LEFT],
    
    ['W!W!', TILE_VARIATION.BRIDGE_VERTICAL],
    ['!W!W', TILE_VARIATION.BRIDGE_HORIZONTAL],
])

export const visualizeCoast = new Map<number, string>([
    [0, '⬜'],

    [1, '╚'],
    [2, '╔'],
    [3, '╗'],
    [4, '╝'],

    [5, '═'],
    [6, '║'],
    [7, '═'],
    [8, '║'],

    [9, '╨'],
    [10, '╞'],
    [11, '╥'],
    [12, '╡'],

    [13, '═'],
    [14, '═'],
])

const serialize = () => {

}

export const parseMapFile = (fileContent: string): MapData => {
    const contentInLines = fileContent.split(/\r?\n/)
    const sanitizedLines = contentInLines.filter(item => {
        return !item.startsWith('*')
    })

    const dimensionsLine = sanitizedLines[1].split(' ')

    const mapData: MapData = {
        name: sanitizedLines[0],
        dimensions: {
            x: parseInt(dimensionsLine[1]),
            y: parseInt(dimensionsLine[dimensionsLine.length - 1])
        },
        tiles: []
    }

    for (let lineIndex = 2; lineIndex < sanitizedLines.length; lineIndex++) {
        const line = sanitizedLines[lineIndex];
        const lineTiles: Tile[] = []

        for (let letter of line) {
            lineTiles.push({ type: tileTypes.get(letter)!, variation: TILE_VARIATION.DEFAULT, imageUrl: '' })
        }
        mapData.tiles.push(lineTiles)
    }

    return mapData
}

export interface MapData {
    name: string
    dimensions: Dimensions
    tiles: Array<Array<Tile>>
}

export interface Dimensions {
    x: number
    y: number
}

export interface Tile {
    type: TILE_TYPE,
    variation: TILE_VARIATION,
    imageUrl: string
}

export enum TILE_TYPE {
    WATER,
    COAST,
    MOUNTAIN,
    GRASS_FIELD,
    FIELD_ONE_TREE,
    FIELD_TWO_TREES,
    FIELD_THREE_TREES
}

const tileTypes = new Map<string, TILE_TYPE>([
    ['W', TILE_TYPE.WATER],
    ['K', TILE_TYPE.COAST],
    ['G', TILE_TYPE.MOUNTAIN],
    ['0', TILE_TYPE.GRASS_FIELD],
    ['1', TILE_TYPE.FIELD_ONE_TREE],
    ['2', TILE_TYPE.FIELD_TWO_TREES],
    ['3', TILE_TYPE.FIELD_THREE_TREES]
])