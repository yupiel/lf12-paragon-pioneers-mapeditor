import "@/scss/app.scss"
import { useState } from "react";
import { UploadMap } from "@/view/UploadMap";
import { MapView } from "@/view/MapView";
import { MapData } from "@/model/map.model";
import { VariationTileLoader } from "./controller/variation-tile.controller";
import { calculateIslandMapping, reCalculateIslandMapping } from '@/controller/map-logic.controller'

const varTileLoader = new VariationTileLoader()

export const App = () => {
  const [map, setMap] = useState<MapData | undefined>(undefined)

  const handleUploadMap = (mapString: string) => setMap(calculateIslandMapping(mapString))

  const handleMapChange = (mapData: MapData) => setMap(reCalculateIslandMapping(mapData))

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
      {!map && <UploadMap handleUploadMap={handleUploadMap} />}
      {map && <div className={"MapTitle"}>{map.name}</div>}
      {map && <MapView mapData={map} tileLoader={varTileLoader} handleMapChange={handleMapChange} />}
      {map && <div className={"DimensionsWrapper"}>Höhe: {map.dimensions.y}, Breite: {map.dimensions.x}</div>}
      {map && <div className={"SaveButton"} onClick={() => saveMap()}>Karte speichern</div>}
    </div>
  )
}

export default App
