import "@/scss/app.scss"
import {useState} from "react";
import {UploadMap} from "@/view/UploadMap";
import {MapView} from "@/view/MapView";

export const  App = () =>  {
  const [map, setMap] = useState<undefined>(undefined)

  return (
      <div className="MapWrapper">

          {!map && <UploadMap />}
          {typeof map == MapData && <MapView mapData={map} />}

      </div>
  )
}

export default App
