import React from "react";
import "@/scss/editingPanel.scss";
import {GRASS_VARIATION, TILE_TYPE} from "@/model/tile.model"

interface IEditingPanel {
    selectTileType: (tile: TILE_TYPE) => void;
}

export const EditingPanel = React.forwardRef<HTMLDivElement, IEditingPanel>(({selectTileType}, ref) => {

    const handleClick = (key: number) => {
        selectTileType(key)
        if (ref?.current) {
            ref.current.style.left="-200px";
        }
        console.log(key)
    }

    const getTiles = () => {
        let tileArray = []
        for (let value of Object.values(TILE_TYPE).filter((key): boolean => isNaN(TILE_TYPE[key]) && TILE_TYPE[key] !== TILE_TYPE.GRASS_FIELD)) {
            tileArray.push(
                <div className={"EditingPanelTileImage"} onClick={() => handleClick(value)}>
                    <img
                        src={"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAABQklEQVRoQ+2aOw7CMAxA6cRdYGVjQAiJA3AJJuAswMQlOAASQhwC7gILSEWuqCUraZ2PbaVTO7TOy4tb2Wk1mb4/AwNHZQ7kejmo8LKZPVrjfA5P9XVjpIAk8ohNQFh1RtSDUADH+7iWslhudeSIehAXAOSIeCPRQIA80UuqCTN6retzyAkcv7ORAsJU6PpQqzGSHGR12zHn/nf7eb5vPaeAUNPqm+xcM9mNwASoA4EB4xnkAiU3Yg4EDIQyk82IOZBQQNmNmAPhAokxYg6kL5A4I+ZAugKJNWIOxBdIvBFzIC4gXA9FrxBD1x1UQScexNdMAeHW7EFaKX8PiW4k9ICj5wg0k2FnKBUAxAlmRD2Ib1s/tSEcz9n7VQ+iBQDMkEbUg8DOEF6D1E5R7twgjZgFkW7C24haEClrvu84zPyv9QVdyfKSgIkaGgAAAABJRU5ErkJggg=="}/>
                </div>
            )
        }

        for (let value of Object.values(GRASS_VARIATION).filter((key) => isNaN(GRASS_VARIATION[key]))) {
            tileArray.push(
                <div className={"EditingPanelTileImage"} onClick={() => handleClick(value)}>
                    <img
                        src={"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAABQklEQVRoQ+2aOw7CMAxA6cRdYGVjQAiJA3AJJuAswMQlOAASQhwC7gILSEWuqCUraZ2PbaVTO7TOy4tb2Wk1mb4/AwNHZQ7kejmo8LKZPVrjfA5P9XVjpIAk8ohNQFh1RtSDUADH+7iWslhudeSIehAXAOSIeCPRQIA80UuqCTN6retzyAkcv7ORAsJU6PpQqzGSHGR12zHn/nf7eb5vPaeAUNPqm+xcM9mNwASoA4EB4xnkAiU3Yg4EDIQyk82IOZBQQNmNmAPhAokxYg6kL5A4I+ZAugKJNWIOxBdIvBFzIC4gXA9FrxBD1x1UQScexNdMAeHW7EFaKX8PiW4k9ICj5wg0k2FnKBUAxAlmRD2Ib1s/tSEcz9n7VQ+iBQDMkEbUg8DOEF6D1E5R7twgjZgFkW7C24haEClrvu84zPyv9QVdyfKSgIkaGgAAAABJRU5ErkJggg=="}/>
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