import React, {useEffect, useRef, useState} from "react";
import {MapData} from "@/model/map.model";
import {Tile, TILE_TYPE} from "@/model/tile.model";
import "@/scss/mapView.scss"
import {EditingPanel} from "@/view/EditingPanel";

export const MapView: React.FC<MapData> = (mapData) => {
    const [selectedTile, setSelectedTile] = useState<Tile | null>(null)
    const [selectedElement, setSelectedElement] = useState<HTMLDivElement | null>(null)

    const [selectedTileType, setSelectedTileType] = useState<number | null>(null)

    const editingRef = useRef<HTMLDivElement | null>(null)

    useEffect(() => {
        //todo: Funktion zum Ändern der Karte
        console.log(selectedTileType + " wurde ausgewählt.")
        setSelectedTile(null)

        if (selectedElement!!) {
            selectedElement.style.boxShadow = ""
        }

        setSelectedElement(null)

        if (editingRef.current) {
            editingRef.current.style.left = "-100px"
        }

        console.log(selectedTileType)
    }, [selectedTileType])

    const onClickTile = (tile: Tile, event: React.MouseEvent<HTMLDivElement>) => {
        // todo: add logic for Map Editing here
        if (selectedTile && tile.position.x == selectedTile.position.x && tile.position.y == selectedTile.position.y) {
            setSelectedTile(null)
            event.currentTarget.style.boxShadow ="";
            setSelectedElement(null)
            if (editingRef.current) {
                editingRef.current.style.left = "-200px"
            }
        } else {
            setSelectedTile(tile)
            if (selectedElement!!) {
                selectedElement.style.boxShadow = ""
            }
            event.currentTarget.style.boxShadow = "inset 0 0 0 2px red";
            setSelectedElement(event.currentTarget)
            if (editingRef.current) {
                editingRef.current.style.left = "5px"
            }
        }
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
                            <div key={tile.position.x + tile.position.y} onClick={(event) => onClickTile(tile, event)} className="TileWrapper">
                                <img src={tile.image}/>
                            </div>
                        )
                    })
                })
            }

            <EditingPanel selectTileType={setSelectedTileType} ref={editingRef} />
        </div>
    )
}