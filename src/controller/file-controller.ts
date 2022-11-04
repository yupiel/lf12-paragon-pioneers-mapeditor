import { MapData, parseMapFile, formatMap } from './map-controller'

export const handleMapUpload = (mapFile: File, callback: (map: MapData) => void) => {
    const fileReader = new FileReader()
    fileReader.onloadend = (e) => {
        callback(formatMap(parseMapFile(fileReader.result as string)))
    }
    fileReader.readAsText(mapFile)
}
