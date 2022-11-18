import React, { MutableRefObject } from "react";
import "@/scss/editingPanel.scss";
import { COAST_VARIATION, GRASS_VARIATION, TILE_TYPE } from "@/model/tile.model"
import { ITileLoader } from "@/model/ITileLoader.model";

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
    }

    const getTiles = () => {
        let tileArray = []
        /*for (let value of Object.values(TILE_TYPE).filter((key): boolean => {
            console.log(key)
            return isNaN(TILE_TYPE[key]) && TILE_TYPE[key] !== TILE_TYPE.GRASS_FIELD
        })) {
            tileArray.push(
                <div className={"EditingPanelTileImage"} onClick={() => handleClick(value)}>
                    <img
                        src={tileLoader.getSpriteForTile(value)} />
                </div>
            )
        }

        for (let value of Object.values(GRASS_VARIATION).filter((key) => isNaN(GRASS_VARIATION[key]))) {
            tileArray.push(
                <div className={"EditingPanelTileImage"} onClick={() => handleClick(value)}>
                    <img
                        src={tileLoader.getSpriteForTile(value)} />
                </div>
            )
        }*/

        tileArray.push(
            <div>
                <p>Coasts</p>
                <hr style={{ borderTop: '3px solid #bbb' }}></hr>
            </div>
        )
        for (let key of Object.keys(COAST_VARIATION).filter(key => !isNaN(Number(key)))) {
            tileArray.push(
                <div className={"EditingPanelTileImage"} onClick={() => handleClick(Number(key))}>
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