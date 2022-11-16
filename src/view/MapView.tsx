import React from "react";

export const MapView = (mapData: MapData) => {

    return (
        <div className="mapViewWrapper" style={
            {
                gridTemplateColumns: `repeat(${mapData.dimensions.x}, 50px)`,
                gridTemplateRows: `repeat(${mapData.dimensions.y}, 50px)`,
            }
        }>
            {mapData && mapData.tiles.map((tileRow: Tile[]) => {
                return tileRow.map((tile: Tile[]) => {
                    
                })
            })}

        </div>
    )
}