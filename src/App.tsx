import "@/scss/app.scss"
import { useState } from "react";
import { UploadMap } from "@/view/UploadMap";
import { MapView } from "@/view/MapView";
import { MapData } from "@/model/map.model";
import { SimpleTileLoader } from '@/controller/simpleTileLoader'
import {parseMapFile, saveMapFile} from "./controller/mapFileUtils";
// import {parseMapFile} from '@/controller/map-logic-controller'

export const App = () => {
  const [map, setMap] = useState<MapData | undefined>(undefined)

  const tileLoader = new SimpleTileLoader()

  const handleMapUpload = (mapFile: File) => {
    const fileReader = new FileReader()
    fileReader.onloadend = (e) => {
        const mapData: MapData = parseMapFile(fileReader.result as string)
        setMap(mapData)
    }
    fileReader.readAsText(mapFile)
  }

  const saveMap = () => {
    if (map) {
      let file = saveMapFile(map)
      const anchor = document.createElement('a');
      anchor.href = file;
      anchor.download = map?.name;
      document.body.appendChild(anchor);
      anchor.click();
      document.body.removeChild(anchor);
    }
  }

  return (
    <div className="MapWrapper">
      {map && <div className={"MapTitle"}>{map.name}</div>}
      {!map && <UploadMap setMap={handleMapUpload} />}
      {map && <MapView mapData={map} tileLoader={tileLoader} />}
      {map && <div className={"DimensionsWrapper"}>Höhe: {map.dimensions.y}, Breite: {map.dimensions.x}</div>}
      {map && <div className={"SaveButton"} onClick={() => saveMap()}>Karte speichern</div>}
    </div>
  )
}

export default App
