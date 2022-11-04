import { ChangeEvent, MouseEvent, useEffect, useRef } from 'react'

import uploadFileIcon from '../assets/upload_icon.svg'
import '@/scss/components/upload-map-form.scss'

export const UploadMapForm = ({setMap} : {setMap: (map: File) => void}) => {
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

    const handleClick = (e: MouseEvent<HTMLDivElement>) => {
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
            setMap(files[0])
        }
    }

    return (
        <div className='UploadMapForm'>
            <input
                ref={uploadRef}
                onChange={handleFileUpload}
                type='file'
                style={{ display: 'none' }}
            />
            <div
                className='UploadMapForm__area'
                onClick={handleClick}
                ref={dropRef}
            >
                Drag and drop map file here or
                upload a file
                <img
                    aria-label='upload-icon'
                    className='area__icon'
                    src={uploadFileIcon}
                />
            </div>
        </div>
    )
}