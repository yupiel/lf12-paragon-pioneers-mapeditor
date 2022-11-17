import React, { useEffect, useRef, useState } from "react";
import { MapData } from "@/model/map.model";
import { Tile } from "@/model/tile.model";
import "@/scss/mapView.scss"
import { EditingPanel } from "@/view/EditingPanel";
import { ITileLoader } from "@/model/ITileLoader.model";

export const MapView: React.FC<MapViewProps> = (props) => {
    const [loaded, setLoaded] = useState<boolean>(false)
    const [selectedTile, setSelectedTile] = useState<Tile | null>(null)
    const tileRef = useRef(null);

    useEffect(() => {
        props.tileLoader.initialize(setLoaded)
    }, [])

    const onClickTile = (tile: Tile, event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        if (selectedTile && tile.position.x == selectedTile.position.x && tile.position.y == selectedTile.position.y) {
            setSelectedTile(null)
            event.currentTarget.style.boxShadow = "";
        } else {
            setSelectedTile(tile)
            event.currentTarget.style.boxShadow = "inset 0 0 0 2px red";
        }
        console.log("Tile clicked!")
    }

    return (
        <div className="MapViewWrapper" style={
            {
                gridTemplateColumns: `repeat(${props.mapData.dimensions.x}, 50px)`,
                gridTemplateRows: `repeat(${props.mapData.dimensions.y}, 50px)`,
            }
        }>
            {loaded &&
                props.mapData &&
                props.mapData.tiles.map((tileRow: Tile[]) => {
                    return tileRow.map((tile: Tile) => {
                        return (
                            <div key={tile.position.x + tile.position.y} onClick={(event) => onClickTile(tile, event)} className="TileWrapper" ref={tileRef}>
                                <img src={props.tileLoader.getSpriteForTile(tile.tileType)} />
                            </div>
                        )
                    })
                })
            }
            {selectedTile && (
                <EditingPanel />
            )}
        </div>
    )
}

interface MapViewProps {
    mapData: MapData
    tileLoader: ITileLoader
}