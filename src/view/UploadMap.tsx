import React, {ChangeEvent, useRef, useEffect} from "react"
import {uploadMap} from '@/controller/file.controller'
import uploadFileIcon from "@/assets/upload_icon.svg"
import "@/scss/uploadMap.scss"

interface UploadMapProps {
    handleUploadMap:  (mapString: string) => void
}

export const UploadMap = (props: UploadMapProps) => {
    const dropRef = useRef<HTMLDivElement>(null)
    const uploadRef = useRef<HTMLInputElement>(null)

    useEffect(() => {
        dropRef.current?.addEventListener('dragover', handleDragOver)
        dropRef.current?.addEventListener('drop', handleDrop)

        return () => {
            dropRef.current?.removeEventListener('dragover', handleDragOver)
            dropRef.current?.removeEventListener('drop', handleDrop)
        }
    }, [])

    const handleDragOver = (e: DragEvent) => {
        e.preventDefault()
        e.stopPropagation()
    }

    const handleDrop = (e: DragEvent) => {
        e.preventDefault()
        e.stopPropagation()

        const files = [...e.dataTransfer?.files as FileList]
        getAndCheckUploadedFile(files, (fileContent => {
            console.log(fileContent)
        }))
    }

    const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
        e.preventDefault()
        e.stopPropagation()

        uploadRef.current && uploadRef.current.click()
    }

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
            uploadMap(files[0], props.handleUploadMap)
        }
    }

    return (
        <div className="UploadMapWrapper">
            <div className="WelcomeTitle">
                Willkommen, Abenteurer!
            </div>

            <input
                ref={uploadRef}
                onChange={handleFileUpload}
                type='file'
                style={{ display: 'none' }}
           />
            <div className={"UploadWrapper"} onClick={(e) => handleClick(e)}>
                <div className="CallToAction">
                    Klicke hier, um deine Karte hochzuladen
                </div>
                <img
                    aria-label='upload-icon'
                    className='UploadIcon'
                    src={uploadFileIcon}
                />
            </div>
        </div>
    )
};

