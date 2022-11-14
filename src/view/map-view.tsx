import { MapData, Tile, visualizeCoast, visualizeMountains, COAST_VARIATION, MOUNTAIN_VARIATION, TILE_TYPE, visualizeGrass, GRASS_VARIATION } from "@/controller/map-logic-controller"
import { useState } from "react"

import './map-view.scss'

export const DisplayMap = (props: DisplayMapProps) => {
    const [mapData, setMapData] = useState<MapData>(props.map)

    console.log(mapData)
    return (
        <div className="DisplayMap" style={
            {
                gridTemplateColumns: `repeat(${mapData.dimensions.x}, 50px)`,
                gridTemplateRows: `repeat(${mapData.dimensions.y}, 50px)`,
            }
        }>
            {
                mapData &&
                mapData.tiles.map((tileRow: Tile[]) => {
                    return tileRow.map((tile: Tile) => {
                        return (
                            <div key={`${tile.tileType}_${(Date.now())}_${Math.random() * 1000}`}>
                                {tile.tileType === TILE_TYPE.COAST
                                    ? visualizeCoast.get(tile.tileVariation as COAST_VARIATION)
                                    : tile.tileType === TILE_TYPE.MOUNTAIN
                                        ? visualizeMountains.get(tile.tileVariation as MOUNTAIN_VARIATION)
                                        : tile.tileType === TILE_TYPE.GRASS_FIELD
                                            ? visualizeGrass.get(tile.tileVariation as GRASS_VARIATION)
                                            : '🌊'
                                }
                            </div>
                        )
                    })
                })
            }
        </div>
    )
}

interface DisplayMapProps {
    map: MapData
}