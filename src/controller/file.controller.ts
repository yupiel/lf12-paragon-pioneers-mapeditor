export const downloadMap = (mapString: string) => {
    const newMapFile = document.createElement('a')
    newMapFile.href = `data:text/plain;charset=utf-8,${mapString}`
    newMapFile.download = 'NeueInsel.txt'

    newMapFile.click()
}

export const uploadMap = (mapFile: File, callback: (mapData: string) => void): void => {
    const fileReader = new FileReader()
    fileReader.onloadend = (e) => {
        callback(fileReader.result as string)
    }
    fileReader.readAsText(mapFile)
}