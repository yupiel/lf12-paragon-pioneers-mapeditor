import { UploadMapForm } from './view/upload-map-form'
import { DisplayMap } from './view/display-map'
import { useState } from 'react'
import { MapData } from './controller/map-controller'
import { handleMapUpload } from '@/controller/file-controller'
import { EditingPanel } from '@/view/editing-panel'

function App() {
  const [map, setMap] = useState<MapData | undefined>(undefined)

  const setMapUpload = (mapFile: File) => {
    handleMapUpload(mapFile, (parsedMap) => {
      setMap(parsedMap)
    })
  }

  return (
    <>
      {!map && <UploadMapForm setMap={setMapUpload} />}
      {map && <DisplayMap map={map} />}
      {map && <EditingPanel />}
    </>
  )
}

export default App
