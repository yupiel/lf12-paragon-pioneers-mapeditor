import React, { MutableRefObject } from "react";
import "@/scss/editingPanel.scss";
import {GRASS_VARIATION, TILE_TYPE} from "@/model/tile.model"
import {SimpleTileLoader} from "@/controller/simpleTileLoader";
import {ITileLoader} from "@/model/ITileLoader.model";

interface IEditingPanel {
    selectTileType: (tile: TILE_TYPE) => void;
    tileLoader: ITileLoader
}

export const EditingPanel = React.forwardRef<HTMLDivElement, IEditingPanel>(({selectTileType, tileLoader, varTileLoader}, ref) => {

    const handleClick = (key: number) => {
        selectTileType(key)
        if ((ref as MutableRefObject<HTMLDivElement>).current) {
            (ref as MutableRefObject<HTMLDivElement>).current.style.left="-200px";
        }
    }

    const getTiles = () => {
        let tileArray = []
        for (let value of Object.values(TILE_TYPE).filter((key): boolean => isNaN(TILE_TYPE[key]) && TILE_TYPE[key] !== TILE_TYPE.GRASS_FIELD)) {
            tileArray.push(
                <div className={"EditingPanelTileImage"} onClick={() => handleClick(value)}>
                    <img
                        src={tileLoader.getSpriteForTile(value)}/>
                </div>
            )
        }

        for (let value of Object.values(GRASS_VARIATION).filter((key) => isNaN(GRASS_VARIATION[key]))) {
            tileArray.push(
                <div className={"EditingPanelTileImage"} onClick={() => handleClick(value)}>
                    <img
                        src={tileLoader.getSpriteForTile(value)}/>
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