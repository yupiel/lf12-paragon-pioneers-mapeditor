import "@/scss/app.scss"
import {useState} from "react";
import {UploadMap} from "@/view/UploadMap";
import {MapView} from "@/view/MapView";
import {MapData} from "@/model/map.model";
import {TILE_TYPE} from "@/model/tile.model";

const mockData: MapData = {
    dimensions: {
        x: 3,
        y: 3
    },
    name: "bla",
    tiles: [
        [
            {
                tileType: TILE_TYPE.WATER,
                position: {
                    x: 1,
                    y: 1
                },
                tileVariation: undefined,
                image: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAABQklEQVRoQ+2aOw7CMAxA6cRdYGVjQAiJA3AJJuAswMQlOAASQhwC7gILSEWuqCUraZ2PbaVTO7TOy4tb2Wk1mb4/AwNHZQ7kejmo8LKZPVrjfA5P9XVjpIAk8ohNQFh1RtSDUADH+7iWslhudeSIehAXAOSIeCPRQIA80UuqCTN6retzyAkcv7ORAsJU6PpQqzGSHGR12zHn/nf7eb5vPaeAUNPqm+xcM9mNwASoA4EB4xnkAiU3Yg4EDIQyk82IOZBQQNmNmAPhAokxYg6kL5A4I+ZAugKJNWIOxBdIvBFzIC4gXA9FrxBD1x1UQScexNdMAeHW7EFaKX8PiW4k9ICj5wg0k2FnKBUAxAlmRD2Ib1s/tSEcz9n7VQ+iBQDMkEbUg8DOEF6D1E5R7twgjZgFkW7C24haEClrvu84zPyv9QVdyfKSgIkaGgAAAABJRU5ErkJggg=="
            },
            {
                tileType: TILE_TYPE.WATER,
                position: {
                    x: 2,
                    y: 1
                },
                tileVariation: undefined,
                image: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAABQklEQVRoQ+2aOw7CMAxA6cRdYGVjQAiJA3AJJuAswMQlOAASQhwC7gILSEWuqCUraZ2PbaVTO7TOy4tb2Wk1mb4/AwNHZQ7kejmo8LKZPVrjfA5P9XVjpIAk8ohNQFh1RtSDUADH+7iWslhudeSIehAXAOSIeCPRQIA80UuqCTN6retzyAkcv7ORAsJU6PpQqzGSHGR12zHn/nf7eb5vPaeAUNPqm+xcM9mNwASoA4EB4xnkAiU3Yg4EDIQyk82IOZBQQNmNmAPhAokxYg6kL5A4I+ZAugKJNWIOxBdIvBFzIC4gXA9FrxBD1x1UQScexNdMAeHW7EFaKX8PiW4k9ICj5wg0k2FnKBUAxAlmRD2Ib1s/tSEcz9n7VQ+iBQDMkEbUg8DOEF6D1E5R7twgjZgFkW7C24haEClrvu84zPyv9QVdyfKSgIkaGgAAAABJRU5ErkJggg=="
            },
            {
                tileType: TILE_TYPE.WATER,
                position: {
                    x: 3,
                    y: 1
                },
                tileVariation: undefined,
                image: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAABQklEQVRoQ+2aOw7CMAxA6cRdYGVjQAiJA3AJJuAswMQlOAASQhwC7gILSEWuqCUraZ2PbaVTO7TOy4tb2Wk1mb4/AwNHZQ7kejmo8LKZPVrjfA5P9XVjpIAk8ohNQFh1RtSDUADH+7iWslhudeSIehAXAOSIeCPRQIA80UuqCTN6retzyAkcv7ORAsJU6PpQqzGSHGR12zHn/nf7eb5vPaeAUNPqm+xcM9mNwASoA4EB4xnkAiU3Yg4EDIQyk82IOZBQQNmNmAPhAokxYg6kL5A4I+ZAugKJNWIOxBdIvBFzIC4gXA9FrxBD1x1UQScexNdMAeHW7EFaKX8PiW4k9ICj5wg0k2FnKBUAxAlmRD2Ib1s/tSEcz9n7VQ+iBQDMkEbUg8DOEF6D1E5R7twgjZgFkW7C24haEClrvu84zPyv9QVdyfKSgIkaGgAAAABJRU5ErkJggg=="
            }
        ],
        [
            {
                tileType: TILE_TYPE.WATER,
                position: {
                    x: 1,
                    y: 2
                },
                tileVariation: undefined,
                image: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAABQklEQVRoQ+2aOw7CMAxA6cRdYGVjQAiJA3AJJuAswMQlOAASQhwC7gILSEWuqCUraZ2PbaVTO7TOy4tb2Wk1mb4/AwNHZQ7kejmo8LKZPVrjfA5P9XVjpIAk8ohNQFh1RtSDUADH+7iWslhudeSIehAXAOSIeCPRQIA80UuqCTN6retzyAkcv7ORAsJU6PpQqzGSHGR12zHn/nf7eb5vPaeAUNPqm+xcM9mNwASoA4EB4xnkAiU3Yg4EDIQyk82IOZBQQNmNmAPhAokxYg6kL5A4I+ZAugKJNWIOxBdIvBFzIC4gXA9FrxBD1x1UQScexNdMAeHW7EFaKX8PiW4k9ICj5wg0k2FnKBUAxAlmRD2Ib1s/tSEcz9n7VQ+iBQDMkEbUg8DOEF6D1E5R7twgjZgFkW7C24haEClrvu84zPyv9QVdyfKSgIkaGgAAAABJRU5ErkJggg=="
            },
            {
                tileType: TILE_TYPE.WATER,
                position: {
                    x: 2,
                    y: 2
                },
                tileVariation: undefined,
                image: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAABQklEQVRoQ+2aOw7CMAxA6cRdYGVjQAiJA3AJJuAswMQlOAASQhwC7gILSEWuqCUraZ2PbaVTO7TOy4tb2Wk1mb4/AwNHZQ7kejmo8LKZPVrjfA5P9XVjpIAk8ohNQFh1RtSDUADH+7iWslhudeSIehAXAOSIeCPRQIA80UuqCTN6retzyAkcv7ORAsJU6PpQqzGSHGR12zHn/nf7eb5vPaeAUNPqm+xcM9mNwASoA4EB4xnkAiU3Yg4EDIQyk82IOZBQQNmNmAPhAokxYg6kL5A4I+ZAugKJNWIOxBdIvBFzIC4gXA9FrxBD1x1UQScexNdMAeHW7EFaKX8PiW4k9ICj5wg0k2FnKBUAxAlmRD2Ib1s/tSEcz9n7VQ+iBQDMkEbUg8DOEF6D1E5R7twgjZgFkW7C24haEClrvu84zPyv9QVdyfKSgIkaGgAAAABJRU5ErkJggg=="
            },
            {
                tileType: TILE_TYPE.WATER,
                position: {
                    x: 3,
                    y: 2
                },
                tileVariation: undefined,
                image: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAABQklEQVRoQ+2aOw7CMAxA6cRdYGVjQAiJA3AJJuAswMQlOAASQhwC7gILSEWuqCUraZ2PbaVTO7TOy4tb2Wk1mb4/AwNHZQ7kejmo8LKZPVrjfA5P9XVjpIAk8ohNQFh1RtSDUADH+7iWslhudeSIehAXAOSIeCPRQIA80UuqCTN6retzyAkcv7ORAsJU6PpQqzGSHGR12zHn/nf7eb5vPaeAUNPqm+xcM9mNwASoA4EB4xnkAiU3Yg4EDIQyk82IOZBQQNmNmAPhAokxYg6kL5A4I+ZAugKJNWIOxBdIvBFzIC4gXA9FrxBD1x1UQScexNdMAeHW7EFaKX8PiW4k9ICj5wg0k2FnKBUAxAlmRD2Ib1s/tSEcz9n7VQ+iBQDMkEbUg8DOEF6D1E5R7twgjZgFkW7C24haEClrvu84zPyv9QVdyfKSgIkaGgAAAABJRU5ErkJggg=="
            }
        ],
        [
            {
                tileType: TILE_TYPE.WATER,
                position: {
                    x: 1,
                    y: 3
                },
                tileVariation: undefined,
                image: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAABQklEQVRoQ+2aOw7CMAxA6cRdYGVjQAiJA3AJJuAswMQlOAASQhwC7gILSEWuqCUraZ2PbaVTO7TOy4tb2Wk1mb4/AwNHZQ7kejmo8LKZPVrjfA5P9XVjpIAk8ohNQFh1RtSDUADH+7iWslhudeSIehAXAOSIeCPRQIA80UuqCTN6retzyAkcv7ORAsJU6PpQqzGSHGR12zHn/nf7eb5vPaeAUNPqm+xcM9mNwASoA4EB4xnkAiU3Yg4EDIQyk82IOZBQQNmNmAPhAokxYg6kL5A4I+ZAugKJNWIOxBdIvBFzIC4gXA9FrxBD1x1UQScexNdMAeHW7EFaKX8PiW4k9ICj5wg0k2FnKBUAxAlmRD2Ib1s/tSEcz9n7VQ+iBQDMkEbUg8DOEF6D1E5R7twgjZgFkW7C24haEClrvu84zPyv9QVdyfKSgIkaGgAAAABJRU5ErkJggg=="
            },
            {
                tileType: TILE_TYPE.WATER,
                position: {
                    x: 2,
                    y: 3
                },
                tileVariation: undefined,
                image: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAABQklEQVRoQ+2aOw7CMAxA6cRdYGVjQAiJA3AJJuAswMQlOAASQhwC7gILSEWuqCUraZ2PbaVTO7TOy4tb2Wk1mb4/AwNHZQ7kejmo8LKZPVrjfA5P9XVjpIAk8ohNQFh1RtSDUADH+7iWslhudeSIehAXAOSIeCPRQIA80UuqCTN6retzyAkcv7ORAsJU6PpQqzGSHGR12zHn/nf7eb5vPaeAUNPqm+xcM9mNwASoA4EB4xnkAiU3Yg4EDIQyk82IOZBQQNmNmAPhAokxYg6kL5A4I+ZAugKJNWIOxBdIvBFzIC4gXA9FrxBD1x1UQScexNdMAeHW7EFaKX8PiW4k9ICj5wg0k2FnKBUAxAlmRD2Ib1s/tSEcz9n7VQ+iBQDMkEbUg8DOEF6D1E5R7twgjZgFkW7C24haEClrvu84zPyv9QVdyfKSgIkaGgAAAABJRU5ErkJggg=="
            },
            {
                tileType: TILE_TYPE.WATER,
                position: {
                    x: 3,
                    y: 3
                },
                tileVariation: undefined,
                image: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAABQklEQVRoQ+2aOw7CMAxA6cRdYGVjQAiJA3AJJuAswMQlOAASQhwC7gILSEWuqCUraZ2PbaVTO7TOy4tb2Wk1mb4/AwNHZQ7kejmo8LKZPVrjfA5P9XVjpIAk8ohNQFh1RtSDUADH+7iWslhudeSIehAXAOSIeCPRQIA80UuqCTN6retzyAkcv7ORAsJU6PpQqzGSHGR12zHn/nf7eb5vPaeAUNPqm+xcM9mNwASoA4EB4xnkAiU3Yg4EDIQyk82IOZBQQNmNmAPhAokxYg6kL5A4I+ZAugKJNWIOxBdIvBFzIC4gXA9FrxBD1x1UQScexNdMAeHW7EFaKX8PiW4k9ICj5wg0k2FnKBUAxAlmRD2Ib1s/tSEcz9n7VQ+iBQDMkEbUg8DOEF6D1E5R7twgjZgFkW7C24haEClrvu84zPyv9QVdyfKSgIkaGgAAAABJRU5ErkJggg=="
            }
        ]

    ]
}

export const  App = () =>  {
    const [map, setMap] = useState<MapData | undefined>(undefined)

    const setMapUpload = (mapFile: File) => {
        setMap(mockData)
        //todo import parserDingeskirchen
        //handleMapUpload(mapFile, (parsedMap: MapData) => {

        //})
    }
  return (
      <div className="MapWrapper">
          {!map && <UploadMap setMap={setMapUpload}  />}
          {map && <MapView dimensions={map.dimensions} name={map.name} tiles={map.tiles} />}
      </div>
  )
}

export default App
