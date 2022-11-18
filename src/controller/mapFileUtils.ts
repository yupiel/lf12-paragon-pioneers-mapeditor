import {Tile, TILE_TYPE, GRASS_VARIATION, COAST_VARIATION, MOUNTAIN_VARIATION} from '@/model/tile.model'
import {MapData} from '@/model/map.model'


const tileTypes = new Map<string, TILE_TYPE>([
    ['W', TILE_TYPE.WATER],
    ['K', TILE_TYPE.COAST],
    ['G', TILE_TYPE.MOUNTAIN],
    ['0', TILE_TYPE.GRASS_FIELD],
    ['1', TILE_TYPE.GRASS_FIELD],
    ['2', TILE_TYPE.GRASS_FIELD],
    ['3', TILE_TYPE.GRASS_FIELD]
])

const tileTypeToString = new Map<TILE_TYPE, string>([
    [TILE_TYPE.WATER, 'W'],
    [TILE_TYPE.COAST, 'K'],
    [TILE_TYPE.MOUNTAIN, 'G'],
    [TILE_TYPE.GRASS_FIELD, '0'],
])

const tileVariationToString = new Map<GRASS_VARIATION | COAST_VARIATION | MOUNTAIN_VARIATION, string>([
    [GRASS_VARIATION.NO_TREES, '0'],
    [GRASS_VARIATION.ONE_TREE, '1'],
    [GRASS_VARIATION.TWO_TREES, '2'],
    [GRASS_VARIATION.THREE_TREES, '3']
])

const tileVariationInitial = new Map<string, GRASS_VARIATION>([
    ['0', GRASS_VARIATION.NO_TREES],
    ['1', GRASS_VARIATION.ONE_TREE],
    ['2', GRASS_VARIATION.TWO_TREES],
    ['3', GRASS_VARIATION.THREE_TREES]
])

const mapHeader = String.raw`*****************************
*  Paragon Pioneers - Map	*
*  W - Wasser				*
*  K - Küste				*
*  G - Gebirge				*
*  0 - Grasfeld				*
*  1 - Gras mit 1 Baum		*
*  2 - Gras mit 2 Baum		*
*  3 - Gras mit 3 Baum		*
*****************************`

export function parseMapFile (fileContent: string): MapData {
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
                imageUrl: undefined
            })
        }
        mapData.tiles.push(lineTiles)
    }
    return mapData
}

export function saveMapFile(mapData: MapData): string {
    let fileContents = ""
    fileContents += mapHeader + '\n'
    fileContents += mapData.name + '\n'
    fileContents += "X: " + mapData.dimensions.x +
        ", Y: " + mapData.dimensions.y + '\n'

    for (let i = 0; i < mapData.tiles.length; i++) {
        for (let j = 0; j < mapData.tiles[i].length; j++) {
            const tile = mapData.tiles[i][j]
            if (tile.tileVariation !== undefined && tileVariationToString.has(tile.tileVariation)) {
                fileContents += tileVariationToString.get(tile.tileVariation)
            } else {
                fileContents += tileTypeToString.get(tile.tileType)
            }
        }
        fileContents += '\n'
    }
    fileContents += '\n'

    const dataURI = "data:" + "text/plain" +
    ";base64," + btoa(fileContents)
    console.log(dataURI)

    return dataURI
}