import '@/scss/components/editing-panel.scss'
import { useState } from 'react'

//open when tile is selected
//on click change tile to specified 
export const EditingPanel = () => {
    const [open, setOpen] = useState<boolean>(false)

    const toggleSidebar = () => setOpen(!open)

    return (
        <div className="EditingPanel">
            <div className='toggle' onClick={() => toggleSidebar()}>{open ? 'ᐸ' : 'ᐳ'}</div>
            {
                open &&
                <div className='EditingPanel__open'>
                    <div className='toggle' onClick={() => toggleSidebar()}>{open ? 'ᐸ' : 'ᐳ'}</div>
                    <div className='grid' style={
                        {
                            gridTemplateColumns: `repeat(${3}, 50px)`,
                            gridTemplateRows: `repeat(${4}, 50px)`,
                        }
                    }>
                        {
                            test.map(t => (
                                <div className='tile'>{t.type}</div>
                            ))
                        }
                    </div>
                </div>
            }
        </div>
    )
}

const test = [
    {
        type: 0
    },
    {
        type: 1
    },
    {
        type: 2
    },
    {
        type: 3
    },
    {
        type: 4
    },
    {
        type: 5
    },
]