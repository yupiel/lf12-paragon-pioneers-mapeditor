import React, { useEffect, useRef, useState } from "react";
import { MapData } from "@/model/map.model";
import { Tile, TILE_TYPE } from "@/model/tile.model";
import { EditingPanel } from "@/view/EditingPanel";
import { ITileLoader } from "@/model/tile-loader.model";
import "@/scss/mapView.scss"

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
        if (selectedTileType !== null && selectedTileType !== undefined
            && selectedTile?.tileType !== selectedTileType
        ) {
            const mapData = structuredClone(props.mapData)
            mapData.tiles[selectedTile!.position.y][selectedTile!.position.x].tileType = selectedTileType as TILE_TYPE
            mapData.tiles[selectedTile!.position.y][selectedTile!.position.x].tileVariation = undefined

            props.handleMapChange(mapData)
        }

        console.log(selectedTileType + " wurde ausgewählt.")
        setSelectedTile(null)

        if (selectedElement!!) {
            selectedElement.style.boxShadow = ""
        }

        setSelectedElement(null)

        if (editingRef.current) {
            editingRef.current.style.left = "-100px"
        }

    }, [selectedTileType])

    const onClickTile = (tile: Tile, event: React.MouseEvent<HTMLDivElement>) => {
        if (selectedTile && tile.position.x == selectedTile.position.x && tile.position.y == selectedTile.position.y) {
            setSelectedTile(null)
            event.currentTarget.style.boxShadow = "";
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
    handleMapChange: (mapData: MapData) => void
}