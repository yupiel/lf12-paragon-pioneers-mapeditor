import { MapData, Tile, visualizeCoast } from "@/controller/map-controller"
import { useState } from "react"

import '@/scss/components/display-map.scss'

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
                            <div key={`${tile.type}_${(Date.now())}_${Math.random() * 1000}`}>
                                {visualizeCoast.get(tile.variation)}
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