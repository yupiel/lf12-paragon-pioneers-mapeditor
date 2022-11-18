import React, { useEffect, useRef, useState } from "react";
import { MapData } from "@/model/map.model";
import { Tile } from "@/model/tile.model";
import "@/scss/mapView.scss"
import { EditingPanel } from "@/view/EditingPanel";
import { ITileLoader } from "@/model/ITileLoader.model";

export const MapView: React.FC<MapViewProps> = (props) => {
    const [loaded, setLoaded] = useState<boolean>(false)
    const [selectedTile, setSelectedTile] = useState<Tile | null>(null)
    const [selectedElement, setSelectedElement] = useState<HTMLDivElement | null>(null)
    const [selectedTileType, setSelectedTileType] = useState<number | null>(null)

    const editingRef = useRef<HTMLDivElement | null>(null)

    useEffect(() => {
        props.tileLoader.waitForInitialized(setLoaded)
    }, [])

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
                gridTemplateColumns: `repeat(${props.mapData.dimensions.x}, 50px)`,
                gridTemplateRows: `repeat(${props.mapData.dimensions.y}, 50px)`,
            }
        }>
            {loaded &&
                props.mapData &&
                props.mapData.tiles.map((tileRow: Tile[]) => {
                    return tileRow.map((tile: Tile) => {
                        return (
                            <div key={`${tile.position.x}-${tile.position.y}`} onClick={(event) => onClickTile(tile, event)} className="TileWrapper">
                                <img src={props.tileLoader.getSpriteForTile(tile.tileVariation ? tile.tileVariation : tile.tileType)} />
                            </div>
                        )
                    })
                })
            }
            
            <EditingPanel selectTileType={setSelectedTileType} ref={editingRef} tileLoader={props.tileLoader} />
        </div>
    )
}

interface MapViewProps {
    mapData: MapData
    tileLoader: ITileLoader
}