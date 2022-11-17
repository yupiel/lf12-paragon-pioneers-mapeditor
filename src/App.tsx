import { DisplayMap } from '@/view/map-view'
import { getIslandMapping } from "@/controller/map-logic-controller"
import { SimpleTileLoader } from '@/controller/SimpleTileLoader'

function App() {
  const getMapData = getIslandMapping();
  const tileLoader = new SimpleTileLoader()
  
  return (
    <>
      <DisplayMap map={getMapData} tileLoader={tileLoader} />
    </>
  )
}

export default App
