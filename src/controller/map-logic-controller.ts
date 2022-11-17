import mapString from '@/Insel0231.txt?raw'
import { Vector2 } from '@/model/vector-two.model'
import { Tile, TILE_TYPE, COAST_VARIATION, MOUNTAIN_VARIATION, GRASS_VARIATION } from '@/model/tile.model'
import { MapData } from '@/model/map.model'

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
    [COAST_VARIATION.L_SMALL, '╚'],
    [COAST_VARIATION.L_REVERSE_SMALL, '╔'],
    [COAST_VARIATION.J_REVERSE_SMALL, '╗'],
    [COAST_VARIATION.J_SMALL, '╝'],

    [COAST_VARIATION.L, 'b╚'],
    [COAST_VARIATION.L_REVERSE, 'b╔'],
    [COAST_VARIATION.J_REVERSE, '╗b'],
    [COAST_VARIATION.J, '╝b'],

    [COAST_VARIATION.STRAIGHT_TOP, '═'],
    [COAST_VARIATION.STRAIGHT_RIGHT, '║'],
    [COAST_VARIATION.STRAIGHT_BOTTOM, '═'],
    [COAST_VARIATION.STRAIGHT_LEFT, '║'],
])

export const visualizeMountains = new Map<MOUNTAIN_VARIATION | undefined, string>([
    [MOUNTAIN_VARIATION.STRAIGHT_TOP, '⛰️'],
    [MOUNTAIN_VARIATION.STRAIGHT_RIGHT, '⛰️\\'],
    [MOUNTAIN_VARIATION.J_REVERSE_END, '⛰️\\e'],
    [MOUNTAIN_VARIATION.STRAIGHT_LEFT, '/⛰️'],
    [MOUNTAIN_VARIATION.L_REVERSE_END, 'e/⛰️'],
    [MOUNTAIN_VARIATION.STRAIGHT_BOTTOM, '|⛰️|'],

    [MOUNTAIN_VARIATION.L, '╰⛰️'],
    [MOUNTAIN_VARIATION.J, '⛰️╯'],

    [MOUNTAIN_VARIATION.L_REVERSE, '╭⛰️'],
    [MOUNTAIN_VARIATION.J_REVERSE, '⛰️╮'],
])

export const visualizeGrass = new Map<GRASS_VARIATION, string>([
    [GRASS_VARIATION.NO_TREES, '🌿'],
    [GRASS_VARIATION.ONE_TREE, '🌿1'],
    [GRASS_VARIATION.TWO_TREES, '🌿2'],
    [GRASS_VARIATION.THREE_TREES, '🌿3'],
])

const runInTileArray = (mapData: MapData,
    func: (rowIndex: number, columnIndex: number) => void)
    : MapData => {
    for (let rowIndex = 0; rowIndex < mapData.tiles.length; rowIndex++)
        for (let columnnIndex = 0; columnnIndex < mapData.tiles[rowIndex].length; columnnIndex++)
            func(rowIndex, columnnIndex)

    return mapData
}

const calculateCoastStraights = (mapData: MapData): MapData => runInTileArray(mapData, (rowIndex, columnIndex) => {
    if (mapData.tiles[rowIndex][columnIndex].tileType !== TILE_TYPE.COAST) return

    mapData.tiles[rowIndex][columnIndex].tileVariation = getCoastStraights(mapData.tiles, rowIndex, columnIndex)
})

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

const calculateMountainUpwardWindings = (mapData: MapData): MapData => {
    for (let rowIndex = 0; rowIndex < mapData.tiles.length; rowIndex++) {
        const row = mapData.tiles[rowIndex]
        for (let columnnIndex = 0; columnnIndex < row.length; columnnIndex++) {
            const tile = row[columnnIndex];

            if (tile.tileVariation !== MOUNTAIN_VARIATION.L && tile.tileVariation !== MOUNTAIN_VARIATION.J) continue

            mapData.tiles = crawlMountainColumn(mapData.tiles, rowIndex, columnnIndex)
        }
    }
    return mapData
}
const crawlMountainColumn = (tiles: Tile[][], rowNum: number, tileNum: number): Tile[][] => {
    const mountainColumnTiles = []

    for (let rowIndex = rowNum - 1; rowIndex >= 0; rowIndex--) {
        const row = tiles[rowIndex]
        if (row[tileNum].tileType === TILE_TYPE.MOUNTAIN)
            mountainColumnTiles.push(row[tileNum])
        else
            break
    }

    const left = tiles[rowNum][tileNum].tileVariation === MOUNTAIN_VARIATION.L ? true : false

    if (mountainColumnTiles.length > 1)
        for (let tileIndex = 0; tileIndex < mountainColumnTiles.length - 1; tileIndex++) {
            const tile = mountainColumnTiles[tileIndex]

            tiles[tile.position.y][tile.position.x].tileVariation = left ? MOUNTAIN_VARIATION.STRAIGHT_LEFT : MOUNTAIN_VARIATION.STRAIGHT_RIGHT
        }

    const lastFoundMountainTile = mountainColumnTiles[mountainColumnTiles.length - 1]
    tiles[lastFoundMountainTile.position.y][tileNum].tileVariation = getMountainTopEdges(tiles, lastFoundMountainTile.position.y, tileNum, left)

    return tiles
}
const getMountainTopEdges = (tiles: Tile[][], rowNum: number, tileNum: number, left: boolean): MOUNTAIN_VARIATION => {
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

    const queryString = topTile + rightTile + bottomTile + leftTile

    return (left ? mountainTopEdgeMappingLeft.get(queryString) : mountainTopEdgeMappingRight.get(queryString)) as MOUNTAIN_VARIATION
}
const mountainTopEdgeMappingLeft = new Map<string, MOUNTAIN_VARIATION>([
    ['!MM!', MOUNTAIN_VARIATION.L_REVERSE_END],
    ['!!MM', MOUNTAIN_VARIATION.J_REVERSE]
])
const mountainTopEdgeMappingRight = new Map<string, MOUNTAIN_VARIATION>([
    ['!MM!', MOUNTAIN_VARIATION.L_REVERSE],
    ['!!MM', MOUNTAIN_VARIATION.J_REVERSE_END]
])

const calculateMOuntainSidewardWindings = (mapData: MapData): MapData => {
    for (let rowIndex = 0; rowIndex < mapData.tiles.length; rowIndex++) {
        const row = mapData.tiles[rowIndex]
        for (let columnnIndex = 0; columnnIndex < row.length; columnnIndex++) {
            const tile = row[columnnIndex];

            if (tile.tileVariation === MOUNTAIN_VARIATION.L_REVERSE_END) {
                mapData.tiles = crawlMountainRows(mapData.tiles, rowIndex, columnnIndex, true, true)
            }
            else if (tile.tileVariation === MOUNTAIN_VARIATION.L_REVERSE || tile.tileVariation === MOUNTAIN_VARIATION.L) {
                mapData.tiles = crawlMountainRows(mapData.tiles, rowIndex, columnnIndex, false, true)
            }
            else if (tile.tileVariation === MOUNTAIN_VARIATION.J_REVERSE_END) {
                mapData.tiles = crawlMountainRows(mapData.tiles, rowIndex, columnnIndex, true, false)
            }
            else if (tile.tileVariation === MOUNTAIN_VARIATION.J_REVERSE || tile.tileVariation === MOUNTAIN_VARIATION.J) {
                mapData.tiles = crawlMountainRows(mapData.tiles, rowIndex, columnnIndex, false, false)
            }
        }
    }
    return mapData
}
const crawlMountainRows = (tiles: Tile[][], rowNum: number, tileNum: number, top: boolean, right: boolean): Tile[][] => {
    const affectedTiles: Tile[] = []

    const row = tiles[rowNum]

    const populateAffectedTiles = (tileIndex: number) => {
        const tile = row[tileIndex];
        if (tile.tileType === TILE_TYPE.MOUNTAIN && tile.tileVariation === undefined)
            affectedTiles.push(tile)
    }

    if (right)
        for (let tileIndex = tileNum + 1; tileIndex < row.length; tileIndex++) {
            populateAffectedTiles(tileIndex)
        }
    else
        for (let tileIndex = tileNum - 1; tileIndex >= 0; tileIndex--) {
            populateAffectedTiles(tileIndex)
        }

    if (affectedTiles.length > 0)
        for (let tileIndex = 0; tileIndex < affectedTiles.length; tileIndex++) {
            const tile = affectedTiles[tileIndex]

            tiles[tile.position.y][tile.position.x].tileVariation = top ? MOUNTAIN_VARIATION.STRAIGHT_TOP : MOUNTAIN_VARIATION.STRAIGHT_BOTTOM
        }

    return tiles
}


const getCoasts = (mapData: MapData) => calculateCoastBigLandmassEdges(calculateCoastBigLandmassEdges(calculateCoastSmallLandmassEdges(calculateCoastStraights(mapData))))

export const getIslandMapping = () => {
    //return advancedCoastMapping(basicCoastMapping(parseMapFile(mapString)))
    //return basicCoastMapping(parseMapFile(mapString))

    return calculateMOuntainSidewardWindings(calculateMountainUpwardWindings(calculateMountainBottomEdges(getCoasts(parseMapFile(mapString)))))
    //return calculateCoastSmallLandmassEdges(calculateCoastStraights(parseMapFile(mapString)))
}