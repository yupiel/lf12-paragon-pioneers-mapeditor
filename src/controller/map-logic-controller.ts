import mapString from '@/Insel0231.txt?raw'

export interface Tile {
    tileType: TILE_TYPE,
    tileVariation: COAST_VARIATION | MOUNTAIN_VARIATION | GRASS_VARIATION | undefined,
    position: Vector2,
    image: ImageData | undefined
}

interface Vector2 {
    x: number,
    y: number
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
    ['1', TILE_TYPE.GRASS_FIELD],
    ['2', TILE_TYPE.GRASS_FIELD],
    ['3', TILE_TYPE.GRASS_FIELD]
])

const tileVariationInitial = new Map<string, GRASS_VARIATION>([
    ['0', GRASS_VARIATION.NO_TREES],
    ['1', GRASS_VARIATION.ONE_TREE],
    ['2', GRASS_VARIATION.TWO_TREES],
    ['3', GRASS_VARIATION.THREE_TREES]
])

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
            lineTiles.push({
                tileType: tileTypes.get(value as string)!,
                tileVariation: tileVariationInitial.get(value as string),
                position: { x: index as number, y: lineIndex - 2 },
                image: undefined
            })
        }
        mapData.tiles.push(lineTiles)
    }

    return mapData
}

export const visualizeCoast = new Map<COAST_VARIATION | undefined, string>([
    [undefined, '⬜'],

    [COAST_VARIATION.L_SMALL, '╚'],
    [COAST_VARIATION.L_REVERSE_SMALL, '╔'],
    [COAST_VARIATION.J_REVERSE_SMALL, '╗'],
    [COAST_VARIATION.J_SMALL, '╝'],

    [COAST_VARIATION.L, 'b╚'],
    [COAST_VARIATION.L_REVERSE, 'b╔'],
    [COAST_VARIATION.J_REVERSE, 'b╗'],
    [COAST_VARIATION.J, 'b╝'],

    [COAST_VARIATION.STRAIGHT_TOP, '═'],
    [COAST_VARIATION.STRAIGHT_RIGHT, '║'],
    [COAST_VARIATION.STRAIGHT_BOTTOM, '═'],
    [COAST_VARIATION.STRAIGHT_LEFT, '║'],
])

export const visualizeMountains = new Map<MOUNTAIN_VARIATION | undefined, string>([
    [undefined, '⬜'],

    [MOUNTAIN_VARIATION.STRAIGHT_TOP, '■'],

    [MOUNTAIN_VARIATION.STRAIGHT_RIGHT, '\\'],
    [MOUNTAIN_VARIATION.J_REVERSE_END, '\\e'],
    [MOUNTAIN_VARIATION.STRAIGHT_LEFT, '/'],
    [MOUNTAIN_VARIATION.L_REVERSE_END, 'e/'],
    [MOUNTAIN_VARIATION.STRAIGHT_BOTTOM, '┬'],

    [MOUNTAIN_VARIATION.L, '╰'],
    [MOUNTAIN_VARIATION.J, '╯'],

    [MOUNTAIN_VARIATION.L_REVERSE, '╭'],
    [MOUNTAIN_VARIATION.J_REVERSE, '╮'],
])

/*
const matchTilePatternReducer = (
    previousValue: ((COAST_VARIATION | TILE_TYPE[])[] | (MOUNTAIN_VARIATION | TILE_TYPE[])[])[],
    currentValue: ((COAST_VARIATION | TILE_TYPE[][])[] | (MOUNTAIN_VARIATION | TILE_TYPE[][])[]),
    currentIndex: number,
    array: ((COAST_VARIATION | TILE_TYPE[][])[] | (MOUNTAIN_VARIATION | TILE_TYPE[][])[])[]
): ((COAST_VARIATION | TILE_TYPE[])[] | (MOUNTAIN_VARIATION | TILE_TYPE[])[])[] => {
    return [
        ...previousValue,
        ...[...(currentValue[0] as TILE_TYPE[][]).map((key: TILE_TYPE[]) => [key, currentValue[1]])]
    ] as ((COAST_VARIATION | TILE_TYPE[])[] | (MOUNTAIN_VARIATION | TILE_TYPE[])[])[]
}

const matchTilePatternMapping = new Map<(TILE_TYPE[] | undefined)[], COAST_VARIATION | MOUNTAIN_VARIATION>(
    //@ts-ignore
    [
        //Small landmass coast matchers
        [
            [
                [TILE_TYPE.COAST, TILE_TYPE.COAST, TILE_TYPE.WATER, TILE_TYPE.WATER],
            ],
            COAST_VARIATION.L_SMALL
        ],
        [
            [
                [undefined, TILE_TYPE.COAST + COAST_VARIATION.STRAIGHT_TOP, TILE_TYPE.COAST + COAST_VARIATION.STRAIGHT_LEFT, undefined],
                [undefined, TILE_TYPE.COAST + COAST_VARIATION.J, TILE_TYPE.COAST + COAST_VARIATION.STRAIGHT_LEFT, undefined],
                [undefined, TILE_TYPE.COAST + COAST_VARIATION.STRAIGHT_TOP, TILE_TYPE.COAST + COAST_VARIATION.STRAIGHT_LEFT, undefined],
            ],
            COAST_VARIATION.L_REVERSE_SMALL
        ],
        [
            [
                [undefined, undefined, TILE_TYPE.COAST + COAST_VARIATION.STRAIGHT_RIGHT, TILE_TYPE.COAST + COAST_VARIATION.STRAIGHT_TOP],
                [undefined, undefined, TILE_TYPE.COAST + COAST_VARIATION.J, TILE_TYPE.COAST + COAST_VARIATION.STRAIGHT_TOP],
                [undefined, undefined, TILE_TYPE.COAST + COAST_VARIATION.STRAIGHT_RIGHT, TILE_TYPE.COAST + COAST_VARIATION.J],
            ],
            COAST_VARIATION.J_REVERSE_SMALL
        ],
        [
            [
                [TILE_TYPE.COAST + COAST_VARIATION.STRAIGHT_RIGHT, undefined, undefined, TILE_TYPE.COAST + COAST_VARIATION.STRAIGHT_BOTTOM],
                [TILE_TYPE.COAST + COAST_VARIATION.L_REVERSE, undefined, undefined, TILE_TYPE.COAST + COAST_VARIATION.STRAIGHT_BOTTOM],
                [TILE_TYPE.COAST + COAST_VARIATION.STRAIGHT_RIGHT, undefined, undefined, TILE_TYPE.COAST + COAST_VARIATION.L_REVERSE],
            ],
            COAST_VARIATION.J_SMALL
        ],
        [
            [
                [undefined, TILE_TYPE.COAST + COAST_VARIATION.STRAIGHT_TOP, undefined, TILE_TYPE.COAST + COAST_VARIATION.L],
                [undefined, TILE_TYPE.COAST + COAST_VARIATION.STRAIGHT_TOP, undefined, TILE_TYPE.COAST + COAST_VARIATION.STRAIGHT_TOP],
                [undefined, TILE_TYPE.COAST + COAST_VARIATION.STRAIGHT_TOP, undefined, TILE_TYPE.COAST + COAST_VARIATION.J_REVERSE_SMALL],
                [undefined, TILE_TYPE.COAST + COAST_VARIATION.J, undefined, TILE_TYPE.COAST + COAST_VARIATION.L],
                [undefined, TILE_TYPE.COAST + COAST_VARIATION.J, undefined, TILE_TYPE.COAST + COAST_VARIATION.STRAIGHT_TOP],
                [undefined, TILE_TYPE.COAST + COAST_VARIATION.J, undefined, TILE_TYPE.COAST + COAST_VARIATION.J_REVERSE_SMALL],
                [undefined, TILE_TYPE.COAST + COAST_VARIATION.L_REVERSE_SMALL, undefined, TILE_TYPE.COAST + COAST_VARIATION.L],
                [undefined, TILE_TYPE.COAST + COAST_VARIATION.L_REVERSE_SMALL, undefined, TILE_TYPE.COAST + COAST_VARIATION.STRAIGHT_TOP],
                [undefined, TILE_TYPE.COAST + COAST_VARIATION.L_REVERSE_SMALL, undefined, TILE_TYPE.COAST + COAST_VARIATION.J_REVERSE_SMALL],

            ],
            COAST_VARIATION.STRAIGHT_TOP
        ],
        [
            [
                [TILE_TYPE.COAST + COAST_VARIATION.STRAIGHT_RIGHT, undefined, TILE_TYPE.COAST + COAST_VARIATION.L, undefined],
                [TILE_TYPE.COAST + COAST_VARIATION.STRAIGHT_RIGHT, undefined, TILE_TYPE.COAST + COAST_VARIATION.J_SMALL, undefined],
                [TILE_TYPE.COAST + COAST_VARIATION.STRAIGHT_RIGHT, undefined, TILE_TYPE.COAST + COAST_VARIATION.STRAIGHT_RIGHT, undefined],
                [TILE_TYPE.COAST + COAST_VARIATION.J_REVERSE_SMALL, undefined, TILE_TYPE.COAST + COAST_VARIATION.L, undefined],
                [TILE_TYPE.COAST + COAST_VARIATION.J_REVERSE_SMALL, undefined, TILE_TYPE.COAST + COAST_VARIATION.J_SMALL, undefined],
                [TILE_TYPE.COAST + COAST_VARIATION.J_REVERSE_SMALL, undefined, TILE_TYPE.COAST + COAST_VARIATION.STRAIGHT_RIGHT, undefined],
                [TILE_TYPE.COAST + COAST_VARIATION.L_REVERSE, undefined, TILE_TYPE.COAST + COAST_VARIATION.L, undefined],
                [TILE_TYPE.COAST + COAST_VARIATION.L_REVERSE, undefined, TILE_TYPE.COAST + COAST_VARIATION.J_SMALL, undefined],
                [TILE_TYPE.COAST + COAST_VARIATION.L_REVERSE, undefined, TILE_TYPE.COAST + COAST_VARIATION.STRAIGHT_RIGHT, undefined],
            ],
            COAST_VARIATION.STRAIGHT_RIGHT
        ],
        [
            [
                [undefined, TILE_TYPE.COAST + COAST_VARIATION.STRAIGHT_BOTTOM, undefined, TILE_TYPE.COAST + COAST_VARIATION.L_SMALL],
                [undefined, TILE_TYPE.COAST + COAST_VARIATION.STRAIGHT_BOTTOM, undefined, TILE_TYPE.COAST + COAST_VARIATION.L_REVERSE],
                [undefined, TILE_TYPE.COAST + COAST_VARIATION.STRAIGHT_BOTTOM, undefined, TILE_TYPE.COAST + COAST_VARIATION.STRAIGHT_BOTTOM],
                [undefined, TILE_TYPE.COAST + COAST_VARIATION.J_REVERSE, undefined, TILE_TYPE.COAST + COAST_VARIATION.J_SMALL],
                [undefined, TILE_TYPE.COAST + COAST_VARIATION.J_REVERSE, undefined, TILE_TYPE.COAST + COAST_VARIATION.L_REVERSE],
                [undefined, TILE_TYPE.COAST + COAST_VARIATION.J_REVERSE, undefined, TILE_TYPE.COAST + COAST_VARIATION.STRAIGHT_BOTTOM],
                [undefined, TILE_TYPE.COAST + COAST_VARIATION.J_SMALL, undefined, TILE_TYPE.COAST + COAST_VARIATION.J_SMALL],
                [undefined, TILE_TYPE.COAST + COAST_VARIATION.J_SMALL, undefined, TILE_TYPE.COAST + COAST_VARIATION.L_REVERSE],
                [undefined, TILE_TYPE.COAST + COAST_VARIATION.J_SMALL, undefined, TILE_TYPE.COAST + COAST_VARIATION.STRAIGHT_BOTTOM],
            ],
            COAST_VARIATION.STRAIGHT_BOTTOM
        ],
        [
            [
                [TILE_TYPE.COAST + COAST_VARIATION.STRAIGHT_LEFT, undefined, TILE_TYPE.COAST + COAST_VARIATION.J, undefined],
                [TILE_TYPE.COAST + COAST_VARIATION.STRAIGHT_LEFT, undefined, TILE_TYPE.COAST + COAST_VARIATION.L_SMALL, undefined],
                [TILE_TYPE.COAST + COAST_VARIATION.STRAIGHT_LEFT, undefined, TILE_TYPE.COAST + COAST_VARIATION.STRAIGHT_LEFT, undefined],
                [TILE_TYPE.COAST + COAST_VARIATION.J_REVERSE, undefined, TILE_TYPE.COAST + COAST_VARIATION.J, undefined],
                [TILE_TYPE.COAST + COAST_VARIATION.J_REVERSE, undefined, TILE_TYPE.COAST + COAST_VARIATION.L_SMALL, undefined],
                [TILE_TYPE.COAST + COAST_VARIATION.J_REVERSE, undefined, TILE_TYPE.COAST + COAST_VARIATION.STRAIGHT_LEFT, undefined],
                [TILE_TYPE.COAST + COAST_VARIATION.L_REVERSE_SMALL, undefined, TILE_TYPE.COAST + COAST_VARIATION.J, undefined],
                [TILE_TYPE.COAST + COAST_VARIATION.L_REVERSE_SMALL, undefined, TILE_TYPE.COAST + COAST_VARIATION.L_SMALL, undefined],
                [TILE_TYPE.COAST + COAST_VARIATION.L_REVERSE_SMALL, undefined, TILE_TYPE.COAST + COAST_VARIATION.STRAIGHT_LEFT, undefined],
            ],
            COAST_VARIATION.STRAIGHT_LEFT
        ],

        //Big landmass coast matchers
        [
            [
                [TILE_TYPE.GRASS_FIELD, TILE_TYPE.MOUNTAIN, TILE_TYPE.GRASS_FIELD, TILE_TYPE.MOUNTAIN],
                [TILE_TYPE.COAST, TILE_TYPE.MOUNTAIN, TILE_TYPE.GRASS_FIELD, TILE_TYPE.MOUNTAIN],
            ],
            MOUNTAIN_VARIATION.FLAT_END
        ],
        [
            [
                [TILE_TYPE.MOUNTAIN, TILE_TYPE.GRASS_FIELD, TILE_TYPE.MOUNTAIN, TILE_TYPE.GRASS_FIELD],
                [TILE_TYPE.MOUNTAIN, TILE_TYPE.GRASS_FIELD, TILE_TYPE.MOUNTAIN, TILE_TYPE.COAST],
                [TILE_TYPE.MOUNTAIN, TILE_TYPE.COAST, TILE_TYPE.MOUNTAIN, TILE_TYPE.COAST],
                [TILE_TYPE.MOUNTAIN, TILE_TYPE.COAST, TILE_TYPE.MOUNTAIN, TILE_TYPE.GRASS_FIELD],
            ],
            MOUNTAIN_VARIATION.LEFT
        ],
        [
            [
                [TILE_TYPE.GRASS_FIELD, TILE_TYPE.GRASS_FIELD, TILE_TYPE.MOUNTAIN, TILE_TYPE.MOUNTAIN],
                [TILE_TYPE.GRASS_FIELD, TILE_TYPE.COAST, TILE_TYPE.MOUNTAIN, TILE_TYPE.MOUNTAIN],
                [TILE_TYPE.COAST, TILE_TYPE.COAST, TILE_TYPE.MOUNTAIN, TILE_TYPE.MOUNTAIN],
                [TILE_TYPE.COAST, TILE_TYPE.GRASS_FIELD, TILE_TYPE.MOUNTAIN, TILE_TYPE.MOUNTAIN],
            ],
            MOUNTAIN_VARIATION.LEFT_END
        ],
        [
            [
                [TILE_TYPE.MOUNTAIN, TILE_TYPE.GRASS_FIELD, TILE_TYPE.MOUNTAIN, TILE_TYPE.GRASS_FIELD],
                [TILE_TYPE.MOUNTAIN, TILE_TYPE.GRASS_FIELD, TILE_TYPE.MOUNTAIN, TILE_TYPE.COAST],
                [TILE_TYPE.MOUNTAIN, TILE_TYPE.COAST, TILE_TYPE.MOUNTAIN, TILE_TYPE.COAST],
                [TILE_TYPE.MOUNTAIN, TILE_TYPE.COAST, TILE_TYPE.MOUNTAIN, TILE_TYPE.GRASS_FIELD],
            ],
            MOUNTAIN_VARIATION.RIGHT
        ],
        [
            [
                [TILE_TYPE.GRASS_FIELD, TILE_TYPE.MOUNTAIN, TILE_TYPE.MOUNTAIN, TILE_TYPE.GRASS_FIELD],
                [TILE_TYPE.GRASS_FIELD, TILE_TYPE.MOUNTAIN, TILE_TYPE.MOUNTAIN, TILE_TYPE.COAST],
                [TILE_TYPE.COAST, TILE_TYPE.MOUNTAIN, TILE_TYPE.MOUNTAIN, TILE_TYPE.COAST],
                [TILE_TYPE.COAST, TILE_TYPE.MOUNTAIN, TILE_TYPE.MOUNTAIN, TILE_TYPE.GRASS_FIELD],
            ],
            MOUNTAIN_VARIATION.RIGHT_END
        ],
        [
            [
                [TILE_TYPE.GRASS_FIELD, TILE_TYPE.MOUNTAIN, TILE_TYPE.GRASS_FIELD, TILE_TYPE.MOUNTAIN],
                [TILE_TYPE.COAST, TILE_TYPE.MOUNTAIN, TILE_TYPE.GRASS_FIELD, TILE_TYPE.MOUNTAIN],
            ],
            MOUNTAIN_VARIATION.UPWARD
        ],
        [
            [
                [TILE_TYPE.MOUNTAIN, TILE_TYPE.MOUNTAIN, TILE_TYPE.GRASS_FIELD, TILE_TYPE.GRASS_FIELD],
                [TILE_TYPE.MOUNTAIN, TILE_TYPE.MOUNTAIN, TILE_TYPE.GRASS_FIELD, TILE_TYPE.COAST],
                [TILE_TYPE.MOUNTAIN, TILE_TYPE.MOUNTAIN, TILE_TYPE.COAST, TILE_TYPE.COAST],
                [TILE_TYPE.MOUNTAIN, TILE_TYPE.MOUNTAIN, TILE_TYPE.COAST, TILE_TYPE.GRASS_FIELD],
            ],
            MOUNTAIN_VARIATION.OUTWARD_RIGHT
        ],
        [
            [
                [TILE_TYPE.MOUNTAIN, TILE_TYPE.GRASS_FIELD, TILE_TYPE.GRASS_FIELD, TILE_TYPE.MOUNTAIN],
                [TILE_TYPE.MOUNTAIN, TILE_TYPE.GRASS_FIELD, TILE_TYPE.COAST, TILE_TYPE.MOUNTAIN],
                [TILE_TYPE.MOUNTAIN, TILE_TYPE.COAST, TILE_TYPE.COAST, TILE_TYPE.MOUNTAIN],
                [TILE_TYPE.MOUNTAIN, TILE_TYPE.COAST, TILE_TYPE.GRASS_FIELD, TILE_TYPE.MOUNTAIN],
            ],
            MOUNTAIN_VARIATION.OUTWARD_LEFT
        ],
        [
            [
                [TILE_TYPE.GRASS_FIELD, TILE_TYPE.GRASS_FIELD, TILE_TYPE.MOUNTAIN, TILE_TYPE.MOUNTAIN],
                [TILE_TYPE.GRASS_FIELD, TILE_TYPE.COAST, TILE_TYPE.MOUNTAIN, TILE_TYPE.MOUNTAIN],
                [TILE_TYPE.COAST, TILE_TYPE.COAST, TILE_TYPE.MOUNTAIN, TILE_TYPE.MOUNTAIN],
                [TILE_TYPE.COAST, TILE_TYPE.GRASS_FIELD, TILE_TYPE.MOUNTAIN, TILE_TYPE.MOUNTAIN],
            ],
            MOUNTAIN_VARIATION.INWARD_RIGHT
        ],
        [
            [
                [TILE_TYPE.GRASS_FIELD, TILE_TYPE.MOUNTAIN, TILE_TYPE.MOUNTAIN, TILE_TYPE.GRASS_FIELD],
                [TILE_TYPE.GRASS_FIELD, TILE_TYPE.MOUNTAIN, TILE_TYPE.MOUNTAIN, TILE_TYPE.COAST],
                [TILE_TYPE.COAST, TILE_TYPE.MOUNTAIN, TILE_TYPE.MOUNTAIN, TILE_TYPE.COAST],
                [TILE_TYPE.COAST, TILE_TYPE.MOUNTAIN, TILE_TYPE.MOUNTAIN, TILE_TYPE.GRASS_FIELD],
            ],
            MOUNTAIN_VARIATION.INWARD_LEFT
        ],
        //@ts-ignore
    ].reduce(matchTilePatternReducer, [])
)

const matchTilePattern = (types: TILE_TYPE[]): COAST_VARIATION | MOUNTAIN_VARIATION | undefined => {
    for (let entry of [...matchTilePatternMapping.entries()]) {
        const intersection = (entry[0] as (TILE_TYPE | undefined)[]).filter(tileType => {
            if (tileType)
                return types.includes(tileType)
        })
        if (intersection.length >= 2) {
            console.log(COAST_VARIATION[entry[1]])
            return entry[1]
        }
    }
    return undefined
}

const baiscMountainVariations = new Map<string, MOUNTAIN_VARIATION | undefined>([
    ['!!!!', undefined],
    ['MMMM', undefined],

    ['!MMM', MOUNTAIN_VARIATION.FLAT],

    ['M!MM', MOUNTAIN_VARIATION.LEFT],
    ['!!MM', MOUNTAIN_VARIATION.LEFT_END],
    ['MMM!', MOUNTAIN_VARIATION.RIGHT],
    ['!MM!', MOUNTAIN_VARIATION.RIGHT_END],
    ['MM!M', MOUNTAIN_VARIATION.UPWARD],

    ['MM!!', MOUNTAIN_VARIATION.OUTWARD_RIGHT],
    ['M!!M', MOUNTAIN_VARIATION.OUTWARD_LEFT],
])

const tileMatcher = (tiles: Tile[][], currentTilePosition: Vector2): COAST_VARIATION | MOUNTAIN_VARIATION | GRASS_VARIATION | undefined => {
    const currentTile = tiles[currentTilePosition.y][currentTilePosition.x]
    let topTile, rightTile, leftTile, bottomTile

    if (currentTilePosition.y !== 0) topTile = tiles[currentTilePosition.y - 1][currentTilePosition.x]
    if (currentTilePosition.x !== tiles[currentTilePosition.y].length - 1) rightTile = tiles[currentTilePosition.y][currentTilePosition.x + 1]
    if (currentTilePosition.y !== tiles.length - 1) bottomTile = tiles[currentTilePosition.y + 1][currentTilePosition.x]
    if (currentTilePosition.x !== 0) leftTile = tiles[currentTilePosition.y][currentTilePosition.x - 1]

    const queryTiles = [topTile ? topTile.tileType : -1, rightTile ? rightTile.tileType : -1, bottomTile ? bottomTile.tileType : -1, leftTile ? leftTile.tileType : -1]
    console.log(queryTiles)

    let variationResult = matchTilePattern(queryTiles)
    if (!variationResult) {
        const advancedQuery = [
            topTile ? topTile.tileType + (topTile.tileVariation ? topTile.tileVariation : 0) : -1,
            rightTile ? rightTile.tileType + (rightTile.tileVariation ? rightTile.tileVariation : 0) : -1,
            bottomTile ? bottomTile.tileType + (bottomTile.tileVariation ? bottomTile.tileVariation : 0) : -1,
            leftTile ? leftTile.tileType + (leftTile.tileVariation ? leftTile.tileVariation : 0) : -1
        ]
        console.log(advancedQuery)
        variationResult = matchTilePattern(advancedQuery)
    }

    return variationResult
}

const calculateTiles = (mapData: MapData) => {
    let tileUnassigned = true;
    console.log("CALCULATING")

    //while (tileUnassigned) {
    tileUnassigned = false
    for (let rowIndex = 0; rowIndex < mapData.tiles.length; rowIndex++) {
        const row = mapData.tiles[rowIndex]
        for (let columnnIndex = 0; columnnIndex < row.length; columnnIndex++) {
            const tile = row[columnnIndex];
            if (tile.tileType !== TILE_TYPE.COAST || tile.tileVariation !== undefined) continue

            let tileVariation = tileMatcher(mapData.tiles, tile.position)
            console.log(tileVariation)
            if (!tileVariation) tileUnassigned = true

            mapData.tiles[rowIndex][columnnIndex].tileVariation = tileVariation
        }
    }
    //}

    return mapData
}
*/

export const calculateCoastStraights = (mapData: MapData): MapData => {
    for (let rowIndex = 0; rowIndex < mapData.tiles.length; rowIndex++) {
        const row = mapData.tiles[rowIndex]
        for (let columnnIndex = 0; columnnIndex < row.length; columnnIndex++) {
            const tile = row[columnnIndex];

            if (tile.tileType !== TILE_TYPE.COAST) continue

            mapData.tiles[rowIndex][columnnIndex].tileVariation = getCoastStraights(mapData.tiles, rowIndex, columnnIndex)
        }
    }

    return mapData
}

const getCoastStraights = (tiles: Tile[][], rowNum: number, tileNum: number): COAST_VARIATION => {
    let topTile = '!', rightTile = '!', bottomTile = '!', leftTile = '!'

    if (rowNum != 0) {
        if (tiles[rowNum - 1][tileNum].tileType == TILE_TYPE.WATER)
            topTile = 'W'
        else if (tiles[rowNum - 1][tileNum].tileType == TILE_TYPE.COAST)
            topTile = 'C'
    }
    if (tileNum != tiles[rowNum].length - 1) {
        if (tiles[rowNum][tileNum + 1].tileType == TILE_TYPE.WATER)
            rightTile = 'W'
        else if (tiles[rowNum][tileNum + 1].tileType == TILE_TYPE.COAST)
            rightTile = 'C'
    }
    if (rowNum != tiles.length - 1) {
        if (tiles[rowNum + 1][tileNum].tileType == TILE_TYPE.WATER)
            bottomTile = 'W'
        else if (tiles[rowNum + 1][tileNum].tileType == TILE_TYPE.COAST)
            bottomTile = 'C'
    }
    if (tileNum != 0) {
        if (tiles[rowNum][tileNum - 1].tileType == TILE_TYPE.WATER)
            leftTile = 'W'
        else if (tiles[rowNum][tileNum - 1].tileType == TILE_TYPE.COAST)
            leftTile = 'C'
    }

    return coastStraightsMapping.get(topTile + rightTile + bottomTile + leftTile) as COAST_VARIATION
}

const coastStraightsMapping = new Map<string, COAST_VARIATION>([
    ['WC!C', COAST_VARIATION.STRAIGHT_TOP],
    ['CC!C', COAST_VARIATION.STRAIGHT_TOP],
    ['CWC!', COAST_VARIATION.STRAIGHT_RIGHT],
    ['CCC!', COAST_VARIATION.STRAIGHT_RIGHT],
    ['!CWC', COAST_VARIATION.STRAIGHT_BOTTOM],
    ['!CCC', COAST_VARIATION.STRAIGHT_BOTTOM],
    ['C!CW', COAST_VARIATION.STRAIGHT_LEFT],
    ['C!CC', COAST_VARIATION.STRAIGHT_LEFT],
])

const calculateCoastSmallLandmassEdges = (mapData: MapData): MapData => {
    for (let rowIndex = 0; rowIndex < mapData.tiles.length; rowIndex++) {
        const row = mapData.tiles[rowIndex]
        for (let columnnIndex = 0; columnnIndex < row.length; columnnIndex++) {
            const tile = row[columnnIndex];

            if (tile.tileType !== TILE_TYPE.COAST || tile.tileVariation !== undefined) continue

            mapData.tiles[rowIndex][columnnIndex].tileVariation = getCoastSmallLandmassEdges(mapData.tiles, rowIndex, columnnIndex)
        }
    }

    return mapData
}

const coastStraightsVariations = Array.from(coastStraightsMapping.values())
const getCoastSmallLandmassEdges = (tiles: Tile[][], rowNum: number, tileNum: number): COAST_VARIATION => {
    let topTile = '!', rightTile = '!', bottomTile = '!', leftTile = '!'

    if (rowNum != 0) {
        if (tiles[rowNum - 1][tileNum].tileType == TILE_TYPE.COAST)
            if (coastStraightsVariations.includes(tiles[rowNum - 1][tileNum].tileVariation as COAST_VARIATION))
                topTile = 'S'
            else
                topTile = 'C'
    }
    if (tileNum != tiles[rowNum].length - 1) {
        if (tiles[rowNum][tileNum + 1].tileType == TILE_TYPE.COAST)
            if (coastStraightsVariations.includes(tiles[rowNum][tileNum + 1].tileVariation as COAST_VARIATION))
                rightTile = 'S'
            else
                rightTile = 'C'
    }
    if (rowNum != tiles.length - 1 && topTile !== 'S') {
        if (tiles[rowNum + 1][tileNum].tileType == TILE_TYPE.COAST)
            if (coastStraightsVariations.includes(tiles[rowNum + 1][tileNum].tileVariation as COAST_VARIATION))
                bottomTile = 'S'
            else
                bottomTile = 'C'
    }
    if (tileNum != 0 && rightTile !== 'S') {
        if (tiles[rowNum][tileNum - 1].tileType == TILE_TYPE.COAST)
            if (coastStraightsVariations.includes(tiles[rowNum][tileNum - 1].tileVariation as COAST_VARIATION))
                leftTile = 'S'
            else
                leftTile = 'C'
    }

    if (JSON.stringify({ x: 5, y: 2 }) == JSON.stringify(tiles[rowNum][tileNum].position))
        console.log(topTile + rightTile + bottomTile + leftTile)

    return coastSmallLandmassMapping.get(topTile + rightTile + bottomTile + leftTile) as COAST_VARIATION
}

const coastSmallLandmassMapping = new Map<string, COAST_VARIATION>([
    ['SS!!', COAST_VARIATION.L_SMALL],
    ['SC!!', COAST_VARIATION.L_SMALL],
    ['CS!!', COAST_VARIATION.L_SMALL],
    ['!SS!', COAST_VARIATION.L_REVERSE_SMALL],
    ['!SC!', COAST_VARIATION.L_REVERSE_SMALL],
    ['!CS!', COAST_VARIATION.L_REVERSE_SMALL],
    ['CCS!', COAST_VARIATION.L_REVERSE_SMALL],
    ['!!SS', COAST_VARIATION.J_REVERSE_SMALL],
    ['!!SC', COAST_VARIATION.J_REVERSE_SMALL],
    ['C!SC', COAST_VARIATION.J_REVERSE_SMALL],
    ['!!CS', COAST_VARIATION.J_REVERSE_SMALL],
    ['!CCS', COAST_VARIATION.J_REVERSE_SMALL],
    ['S!!S', COAST_VARIATION.J_SMALL],
    ['S!!C', COAST_VARIATION.J_SMALL],
    ['C!!S', COAST_VARIATION.J_SMALL],
    ['S!CS', COAST_VARIATION.J_SMALL],
    ['CC!S', COAST_VARIATION.J_SMALL],
])

const coastSmallLandmassVariations = Array.from(coastSmallLandmassMapping.values())
const calculateCoastBigLandmassEdges = (mapData: MapData): MapData => {
    for (let rowIndex = 0; rowIndex < mapData.tiles.length; rowIndex++) {
        const row = mapData.tiles[rowIndex]
        for (let columnnIndex = 0; columnnIndex < row.length; columnnIndex++) {
            const tile = row[columnnIndex];

            if (tile.tileType !== TILE_TYPE.COAST) continue
            if (tile.tileVariation !== undefined
                && !coastSmallLandmassVariations.includes(tile.tileVariation! as COAST_VARIATION)
                && !coastBigLandmassVariations.includes(tile.tileVariation! as COAST_VARIATION)
            )
                continue

            mapData.tiles[rowIndex][columnnIndex].tileVariation = getCoastBigLandmassEdges(mapData.tiles, rowIndex, columnnIndex)
        }
    }

    return mapData
}

const acceptableCoastTopIntersections = [COAST_VARIATION.L_REVERSE_SMALL, COAST_VARIATION.J_REVERSE_SMALL, COAST_VARIATION.L_REVERSE, COAST_VARIATION.J_REVERSE]
const acceptableCoastRightIntersections = [COAST_VARIATION.J_SMALL, COAST_VARIATION.J_REVERSE_SMALL, COAST_VARIATION.J_REVERSE]
const acceptableCoastBottomIntersections = [COAST_VARIATION.L_SMALL, COAST_VARIATION.J_SMALL, COAST_VARIATION.L, COAST_VARIATION.J]
const acceptableCoastLeftIntersections = [COAST_VARIATION.L_SMALL, COAST_VARIATION.L_REVERSE_SMALL, COAST_VARIATION.L]
const getCoastBigLandmassEdges = (tiles: Tile[][], rowNum: number, tileNum: number): COAST_VARIATION => {
    let topTile = '!', rightTile = '!', bottomTile = '!', leftTile = '!'

    if (rowNum !== 0) {
        if (tiles[rowNum - 1][tileNum].tileType === TILE_TYPE.COAST) {
            if (acceptableCoastTopIntersections.includes(tiles[rowNum - 1][tileNum].tileVariation as COAST_VARIATION)) {
                topTile = 'C'
            }
        }
        else if (rowNum !== 0 && tiles[rowNum - 1][tileNum].tileType === TILE_TYPE.WATER) {
            topTile = 'W'
        }
    }
    if (tileNum !== tiles[rowNum].length - 1) {
        if (tiles[rowNum][tileNum + 1].tileType === TILE_TYPE.COAST) {
            if (acceptableCoastRightIntersections.includes(tiles[rowNum][tileNum + 1].tileVariation as COAST_VARIATION)) {
                rightTile = 'C'
            }
        } else if (tileNum !== tiles[rowNum].length - 1 && tiles[rowNum][tileNum + 1].tileType === TILE_TYPE.WATER) {
            rightTile = 'W'
        }
    }
    if (rowNum !== tiles.length - 1 && topTile !== 'C') {
        if (tiles[rowNum + 1][tileNum].tileType === TILE_TYPE.COAST) {
            if (acceptableCoastBottomIntersections.includes(tiles[rowNum + 1][tileNum].tileVariation as COAST_VARIATION)) {
                bottomTile = 'C'
            }
        }
    } else if (rowNum !== tiles.length - 1 && tiles[rowNum + 1][tileNum].tileType === TILE_TYPE.WATER) {
        bottomTile = 'W'
    }
    if (tileNum !== 0 && rightTile !== 'C') {
        if (tiles[rowNum][tileNum - 1].tileType === TILE_TYPE.COAST) {
            if (acceptableCoastLeftIntersections.includes(tiles[rowNum][tileNum - 1].tileVariation as COAST_VARIATION)) {
                leftTile = 'C'
            }
        }
    } else if (tileNum !== 0 && tiles[rowNum][tileNum - 1].tileType === TILE_TYPE.WATER) {
        leftTile = 'W'
    }

    //Type is already correctly set if a water block is found in any cardinal direction
    //  since only small landmass coast tiles have a water block near them
    const newVariation = coastBigLandmassMapping.get(topTile + rightTile + bottomTile + leftTile) as COAST_VARIATION
    return newVariation ? newVariation : tiles[rowNum][tileNum].tileVariation as COAST_VARIATION
}


const coastBigLandmassMapping = new Map<string, COAST_VARIATION>([
    ['C!!!', COAST_VARIATION.L],
    ['CC!!', COAST_VARIATION.L],
    ['!C!!', COAST_VARIATION.L_REVERSE],
    ['!CC!', COAST_VARIATION.L_REVERSE],
    ['!!C!', COAST_VARIATION.J_REVERSE],
    ['!!CC', COAST_VARIATION.J_REVERSE],
    ['!!!C', COAST_VARIATION.J],
    ['C!!C', COAST_VARIATION.J],
])
const coastBigLandmassVariations = Array.from(coastBigLandmassMapping.values())

const calculateMountainBottomEdges = (mapData: MapData): MapData => {
    for (let rowIndex = 0; rowIndex < mapData.tiles.length; rowIndex++) {
        const row = mapData.tiles[rowIndex]
        for (let columnnIndex = 0; columnnIndex < row.length; columnnIndex++) {
            const tile = row[columnnIndex];

            if (tile.tileType !== TILE_TYPE.MOUNTAIN) continue

            mapData.tiles[rowIndex][columnnIndex].tileVariation = getMountainBottomEdges(mapData.tiles, rowIndex, columnnIndex)
        }
    }

    return mapData
}
const getMountainBottomEdges = (tiles: Tile[][], rowNum: number, tileNum: number): MOUNTAIN_VARIATION => {
    let topTile = '!', rightTile = '!', bottomTile = '!', leftTile = '!'

    if (rowNum !== 0 && tiles[rowNum - 1][tileNum].tileType === TILE_TYPE.MOUNTAIN) {
        topTile = 'M'
    }
    if (tileNum !== tiles[rowNum].length - 1 && tiles[rowNum][tileNum + 1].tileType === TILE_TYPE.MOUNTAIN) {
        rightTile = 'M'
    }
    if (rowNum !== tiles.length - 1 && tiles[rowNum + 1][tileNum].tileType === TILE_TYPE.MOUNTAIN) {
        bottomTile = 'M'
    }
    if (tileNum !== 0 && tiles[rowNum][tileNum - 1].tileType === TILE_TYPE.MOUNTAIN) {
        leftTile = 'M'
    }

    return mountainBottomEdgeMapping.get(topTile + rightTile + bottomTile + leftTile) as MOUNTAIN_VARIATION
}
const mountainBottomEdgeMapping = new Map<string, MOUNTAIN_VARIATION>([
    ['MM!!', MOUNTAIN_VARIATION.L],
    ['M!!M', MOUNTAIN_VARIATION.J]
])

const getCoasts = (mapData: MapData) => calculateCoastBigLandmassEdges(calculateCoastBigLandmassEdges(calculateCoastSmallLandmassEdges(calculateCoastStraights(mapData))))

export const getIslandMapping = () => {
    //return advancedCoastMapping(basicCoastMapping(parseMapFile(mapString)))
    //return basicCoastMapping(parseMapFile(mapString))

    return calculateMountainBottomEdges(getCoasts(parseMapFile(mapString)))
    //return calculateCoastSmallLandmassEdges(calculateCoastStraights(parseMapFile(mapString)))
}