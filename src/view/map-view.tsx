import { MapData, Tile, visualizeCoast } from "@/controller/map-logic-controller"
import { useState } from "react"

import './map-view.scss'

export const DisplayMap = (props: DisplayMapProps) => {
    const [mapData, setMapData] = useState<MapData>(props.map)
    

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
                                {visualizeCoast.get(tile.coastVariation as number)}
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