import { Vector2 } from './vector-two.model'
import { Tile } from './tile.model'

export interface MapData {
    name: string
    dimensions: Vector2
    tiles: Array<Array<Tile>>
}