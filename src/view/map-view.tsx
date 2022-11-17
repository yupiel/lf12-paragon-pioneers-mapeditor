import { visualizeCoast, visualizeMountains, visualizeGrass } from "@/controller/map-logic-controller"
import { Tile, TILE_TYPE, COAST_VARIATION, MOUNTAIN_VARIATION, GRASS_VARIATION } from '@/model/tile.model'
import { MapData } from '@/model/map.model'
import { createElement, useEffect, useState } from "react"

import './map-view.scss'
import { ITileLoader } from "@/model/ITileLoader.model"

export const DisplayMap = (props: DisplayMapProps) => {
    const [mapData, setMapData] = useState<MapData>(props.map)
    const [loaded, setLoaded] = useState<boolean>(false)

    useEffect(() => {
        props.tileLoader.initialize(setLoaded)
    }, [])


    console.log(mapData)
    return (
        <div className="DisplayMap" style={
            {
                gridTemplateColumns: `repeat(${mapData.dimensions.x}, 50px)`,
                gridTemplateRows: `repeat(${mapData.dimensions.y}, 50px)`,
            }
        }>
            {
                loaded &&
                mapData &&
                mapData.tiles.map((tileRow: Tile[]) => {
                    return tileRow.map((tile: Tile) => {
                        return (
                            <div>
                                <img src={props.tileLoader.getSpriteForTile(tile.tileType)} />
                            </div>
                        )
                    })
                })
            }
        </div>
    )
}

interface DisplayMapProps {
    map: MapData,
    tileLoader: ITileLoader
}