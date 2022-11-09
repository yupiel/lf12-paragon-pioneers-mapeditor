import mapString from '@/Insel0231.txt?raw'

export const basicCoastMapping = (mapData: MapData): MapData => {
    for (let rowIndex = 0; rowIndex < mapData.tiles.length; rowIndex++) {
        const row = mapData.tiles[rowIndex]
        for (let columnnIndex = 0; columnnIndex < row.length; columnnIndex++) {
            const tile = row[columnnIndex];
            if (tile.tileType !== TILE_TYPE.COAST) continue

            mapData.tiles[rowIndex][columnnIndex].coastVariation = getVariation(mapData.tiles, rowIndex, columnnIndex)
        }
    }

    return mapData
}

const getVariation = (tiles: Tile[][], rowNum: number, tileNum: number): COAST_VARIATION => {
    let topTile = '!', rightTile = '!', bottomTile = '!', leftTile = '!'

    if (rowNum != 0 && tiles[rowNum - 1][tileNum].tileType == TILE_TYPE.WATER) topTile = 'W'
    if (tileNum != tiles[rowNum].length - 1 && tiles[rowNum][tileNum + 1].tileType == TILE_TYPE.WATER) rightTile = 'W'
    if (rowNum != tiles.length - 1 && tiles[rowNum + 1][tileNum].tileType == TILE_TYPE.WATER) bottomTile = 'W'
    if (tileNum != 0 && tiles[rowNum][tileNum - 1].tileType == TILE_TYPE.WATER) leftTile = 'W'

    return basicCoastVariations.get(topTile + rightTile + bottomTile + leftTile) as COAST_VARIATION
}

export const advancedCoastMapping = (mapData: MapData): MapData => {
    for (let rowIndex = 0; rowIndex < mapData.tiles.length; rowIndex++) {
        const row = mapData.tiles[rowIndex]
        for (let columnnIndex = 0; columnnIndex < row.length; columnnIndex++) {
            const tile = row[columnnIndex];
            if (tile.tileType !== TILE_TYPE.COAST && tile.coastVariation !== undefined) continue
            console.log(tile)

            if (rowIndex !== 0
                && mapData.tiles[rowIndex - 1][columnnIndex].tileType === TILE_TYPE.COAST
                && mapData.tiles[rowIndex - 1][columnnIndex].coastVariation !== undefined) {
                mapData.tiles[rowIndex][columnnIndex].coastVariation = compareConnections(mapData.tiles[rowIndex - 1][columnnIndex].coastVariation!, 'top')
            }
            else if (columnnIndex !== mapData.tiles[columnnIndex].length - 1
                && mapData.tiles[rowIndex][columnnIndex + 1].tileType === TILE_TYPE.COAST
                && mapData.tiles[rowIndex][columnnIndex + 1].coastVariation !== undefined) {
                mapData.tiles[rowIndex][columnnIndex].coastVariation = compareConnections(mapData.tiles[rowIndex][columnnIndex + 1].coastVariation!, 'right')
            }
            else if (rowIndex !== mapData.tiles.length - 1
                && mapData.tiles[rowIndex + 1][columnnIndex].tileType === TILE_TYPE.COAST
                && mapData.tiles[rowIndex + 1][columnnIndex].coastVariation !== undefined) {
                mapData.tiles[rowIndex][columnnIndex].coastVariation = compareConnections(mapData.tiles[rowIndex + 1][columnnIndex].coastVariation!, 'bottom')
            }
            else if (columnnIndex !== 0
                && mapData.tiles[rowIndex][columnnIndex - 1].tileType === TILE_TYPE.COAST
                && mapData.tiles[rowIndex][columnnIndex - 1].coastVariation !== undefined) {
                mapData.tiles[rowIndex][columnnIndex].coastVariation = compareConnections(mapData.tiles[rowIndex][columnnIndex - 1].coastVariation!, 'left')
            }
        }
    }

    return mapData
}

const compareConnections = (connector: COAST_VARIATION, direction: 'top' | 'right' | 'bottom' | 'left'): COAST_VARIATION | undefined => {
    switch (direction) {
        case ('top'):
            if (connector === COAST_VARIATION.STRAIGHT_RIGHT || connector === COAST_VARIATION.J_REVERSE_SMALL)
                return COAST_VARIATION.L
            else if (connector === COAST_VARIATION.STRAIGHT_LEFT || connector === COAST_VARIATION.L_REVERSE_SMALL)
                return COAST_VARIATION.J
            break
        case ('right'):
            if (connector === COAST_VARIATION.STRAIGHT_TOP || connector === COAST_VARIATION.J_REVERSE_SMALL)
                return COAST_VARIATION.L
            else if (connector === COAST_VARIATION.STRAIGHT_BOTTOM || connector === COAST_VARIATION.J_SMALL)
                return COAST_VARIATION.L_REVERSE
            break
        case ('bottom'):
            if (connector === COAST_VARIATION.STRAIGHT_RIGHT || connector === COAST_VARIATION.J_SMALL)
                return COAST_VARIATION.L_REVERSE
            else if (connector === COAST_VARIATION.STRAIGHT_LEFT || connector === COAST_VARIATION.L_SMALL)
                return COAST_VARIATION.J_REVERSE
            break
        case ('left'):
            if (connector === COAST_VARIATION.STRAIGHT_TOP || connector === COAST_VARIATION.J_SMALL)
                return COAST_VARIATION.J
            else if (connector === COAST_VARIATION.STRAIGHT_BOTTOM || connector === COAST_VARIATION.J_REVERSE_SMALL)
                return COAST_VARIATION.J_REVERSE
            break
    }
}

/*
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
}*/

export interface Tile {
    tileType: TILE_TYPE,
    coastVariation: COAST_VARIATION | undefined,
    position: Vector2,
    image: ImageData | undefined
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
    //small landmass
    L_SMALL,
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

const basicCoastVariations = new Map<string, COAST_VARIATION | undefined>([
    ['!!!!', undefined],
    ['WWWW', undefined],

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
    TOP_RIGHT,
    BOTTOM_RIGHT,
    BOTTOM_LEFT,
    TOP_LEFT
}

/*
const coastConnectionMapper = new Map<COAST_VARIATION, CoastConnections>([
    [COAST_VARIATION.L_SMALL, { connectionDirection: { top: true, right: true, bottom: false, left: false }, anchor: [AnchorPoint.TOP_RIGHT] }],
    [COAST_VARIATION.L_REVERSE_SMALL, { connectionDirection: { top: false, right: true, bottom: true, left: false }, anchor: [AnchorPoint.BOTTOM_RIGHT] }],
    [COAST_VARIATION.J_REVERSE_SMALL, { connectionDirection: { top: false, right: false, bottom: true, left: true }, anchor: [AnchorPoint.BOTTOM_LEFT] }],
    [COAST_VARIATION.J_SMALL, { connectionDirection: { top: true, right: false, bottom: false, left: true }, anchor: [AnchorPoint.TOP_LEFT] }],

    [COAST_VARIATION.L, { connectionDirection: { top: true, right: true, bottom: false, left: false }, anchor: [AnchorPoint.BOTTOM_LEFT] }],
    [COAST_VARIATION.L_REVERSE, { connectionDirection: { top: false, right: true, bottom: true, left: false }, anchor: [AnchorPoint.TOP_LEFT] }],
    [COAST_VARIATION.J_REVERSE, { connectionDirection: { top: false, right: false, bottom: true, left: true }, anchor: [AnchorPoint.TOP_RIGHT] }],
    [COAST_VARIATION.J, { connectionDirection: { top: true, right: false, bottom: false, left: true }, anchor: [AnchorPoint.BOTTOM_RIGHT] }],

    [COAST_VARIATION.STRAIGHT_TOP, { connectionDirection: { top: false, right: true, bottom: false, left: true }, anchor: [AnchorPoint.BOTTOM_LEFT, AnchorPoint.BOTTOM_RIGHT] }],
    [COAST_VARIATION.STRAIGHT_RIGHT, { connectionDirection: { top: true, right: false, bottom: true, left: false }, anchor: [AnchorPoint.TOP_LEFT, AnchorPoint.BOTTOM_LEFT] }],
    [COAST_VARIATION.STRAIGHT_LEFT, { connectionDirection: { top: true, right: false, bottom: true, left: false }, anchor: [AnchorPoint.TOP_RIGHT, AnchorPoint.BOTTOM_RIGHT] }],
    [COAST_VARIATION.STRAIGHT_BOTTOM, { connectionDirection: { top: false, right: true, bottom: false, left: true }, anchor: [AnchorPoint.TOP_LEFT, AnchorPoint.TOP_RIGHT] }],
])*/

//////////////////////////////////////////////
export interface MapData {
    name: string
    dimensions: Dimensions
    tiles: Array<Array<Tile>>
}

export interface Dimensions {
    x: number
    y: number
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

export const getIslandMapping = () => {
    return advancedCoastMapping(basicCoastMapping(parseMapFile(mapString)))
    //return basicCoastMapping(parseMapFile(mapString))
}

const parseMapFile = (fileContent: string): MapData => {
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

        for (const [index, value] of [...line].map((value, index) => [index, value])) {
            lineTiles.push({ tileType: tileTypes.get(value as string)!, coastVariation: undefined, position: { x: index as number, y: lineIndex - 2 }, image: undefined })
        }
        mapData.tiles.push(lineTiles)
    }

    return mapData
}

export const visualizeCoast = new Map<number|undefined, string>([
    [undefined, '⬜'],

    [0, '╚'],
    [1, '╔'],
    [2, '╗'],
    [3, '╝'],

    [4, 'b╚'],
    [5, 'b╔'],
    [6, 'b╗'],
    [7, 'b╝'],

    [8, '═'],
    [9, '║'],
    [10, '═'],
    [11, '║'],
])
