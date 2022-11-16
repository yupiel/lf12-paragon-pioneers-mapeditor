import React, {ChangeEvent, useRef, useState} from "react";
import "@/scss/uploadMap.scss"

export const UploadMap = () => {
    const [map, setMap] = useState<undefined>(undefined)
    const uploadRef = useRef<HTMLInputElement>(null)
    const dropRef = useRef<HTMLDivElement>(null)

    const handleFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
        e.preventDefault()
        e.stopPropagation()

        const files = [...e.target.files as FileList]
        getAndCheckUploadedFile(files, (content => {
            console.log(content)
        }))
    }

    const getAndCheckUploadedFile = (files: File[], callback: (fileContent: string) => void) => {
        if (files.length > 1) {
            console.log('Only one map file can be uploaded at a time')
            return
        }

        if (files.some(file => !file.name.toLocaleLowerCase().endsWith('.txt'))) {
            console.log('Only .txt files are accepted')
            return
        }

        if (files && files.length) {
            setMap(files[0])
        }
    }

    return (
        <div className="UploadMapWrapper">
            <div className="WelcomeTitle">
                Willkommen, Abenteurer!
            </div>
            <div className="CallToAction">
                Klicke hier, um deine Karte hochzuladen
            </div>
            <input
                ref={uploadRef}
                onChange={handleFileUpload}
                type='file'
                style={{ display: 'none' }}
           />
        </div>
    )
};

