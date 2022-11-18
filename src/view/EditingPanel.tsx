import React, { MutableRefObject } from "react";
import { TILE_TYPE } from "@/model/tile.model"
import { ITileLoader } from "@/model/tile-loader.model";
import "@/scss/editingPanel.scss";

interface IEditingPanel {
    selectTileType: (tile: TILE_TYPE) => void;
    tileLoader: ITileLoader
}

export const EditingPanel = React.forwardRef<HTMLDivElement, IEditingPanel>(({ selectTileType, tileLoader }, ref) => {

    const handleClick = (key: number) => {
        selectTileType(key)
        if ((ref as MutableRefObject<HTMLDivElement>).current) {
            (ref as MutableRefObject<HTMLDivElement>).current.style.left = "-200px";
        }
        console.log(key)
    }

    const getTiles = () => {
        let tileArray = []
        for (let key of Object.keys(TILE_TYPE).filter(key => !isNaN(Number(key)))) {
            tileArray.push(
                <div className={"EditingPanelTileImage"} key={key} onClick={() => handleClick(Number(key))}>
                    <img
                        src={tileLoader.getSpriteForTile(Number(key))} />
                </div>
            )
        }

        return tileArray;
    }

    return (
        <div className="EditingPanelWrapper" ref={ref}>
            {getTiles()}
        </div>
    )
})