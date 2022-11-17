import React, {useRef, useState} from "react";
import {MapData} from "@/model/map.model";
import {Tile, TILE_TYPE} from "@/model/tile.model";
import "@/scss/mapView.scss"
import {EditingPanel} from "@/view/EditingPanel";

export const MapView: React.FC<MapData> = (mapData) => {
    const [selectedTile, setSelectedTile] = useState<Tile | null>(null)
    const tileRef = useRef(null);

    const onClickTile = (tile: Tile, event) => {
        // todo: add logic for Map Editing here
        if (selectedTile && tile.position.x == selectedTile.position.x && tile.position.y == selectedTile.position.y) {
            setSelectedTile(null)
            event.currentTarget.style.boxShadow ="";
        } else {
            setSelectedTile(tile)
            event.currentTarget.style.boxShadow = "inset 0 0 0 2px red";
        }
        console.log("Tile clicked!")
    }

    return (
        <div className="MapViewWrapper" style={
            {
                gridTemplateColumns: `repeat(${mapData.dimensions.x}, 50px)`,
                gridTemplateRows: `repeat(${mapData.dimensions.y}, 50px)`,
            }
        }>
            {mapData &&
                mapData.tiles.map((tileRow: Tile[]) => {
                    return tileRow.map((tile: Tile) => {
                        return (
                            <div key={tile.position.x + tile.position.y} onClick={(event) => onClickTile(tile, event)} className="TileWrapper" ref={tileRef}>
                                <img src={tile.image}/>
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