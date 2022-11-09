import { DisplayMap } from '@/view/map-view'
import { getIslandMapping } from "@/controller/map-logic-controller"

function App() {
  const getMapData = getIslandMapping();
  
  return (
    <>
      <DisplayMap map={getMapData} />
    </>
  )
}

export default App
