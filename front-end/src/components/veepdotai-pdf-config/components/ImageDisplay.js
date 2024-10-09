import React, { useRef } from 'react';
import { Input } from "src/components/ui/shadcn/input"
import { Button } from 'src/components/ui/shadcn/button';
import { Label } from "src/components/ui/shadcn/label"

import icones from '../icons'
import { t } from 'i18next'

const ImageDisplay = (props) => {
    let fileLogo = ""
    let fileBack = ""
    const inputBack = useRef(null)
    const inputLogo = useRef(null)

    const handleChangeLogo = (choisit)=>{
        try {fileLogo = URL.createObjectURL(choisit.target.files[0])
        props.handleChangeLogo(fileLogo)
        }
        catch{}
    }

    const handleChangeBack = (choisit)=>{
        try {fileBack = URL.createObjectURL(choisit.target.files[0])
        props.handleChangeBack(fileBack)
        }
        catch{}
    }

    return (
        <div id="divImage" className="items-center  justify-center p-2 list-item list-none">
            <div>
                <Label htmlFor="logo">{t("Logo")}</Label>
                <div className='flex'>
                    <Input id="logo" type="file" onChange={handleChangeLogo} ref={inputLogo} />
                    <Button variant="ghost" className='my-1 px-0 h-9 w-9' onClick={() => {
                        if (inputLogo.current) {
                            inputLogo.current.value = "";
                            inputLogo.current.type = "text";
                            inputLogo.current.type = "file";
                        }
                        props.handleChangeLogo("./assets/images/nothing.png")
                    }}>{icones.trash}</Button>
                </div>
            </div>

            <div className='mt-2'>
                <Label htmlFor="bgImage">{t("PDFBackgroundImage")}</Label>
                <div className='flex'>
                    <Input id="bgImage" type="file" onChange={handleChangeBack} ref={inputBack}/>            
                    <Button variant="ghost" className='my-1 px-0 h-9 w-9' onClick={() => {
                        if (inputBack.current) {
                            inputBack.current.value = "";
                            inputBack.current.type = "text";
                            inputBack.current.type = "file";
                        }
                        props.handleChangeBack("./assets/images/nothing.png")
                    }}>{icones.trash}</Button>
                </div>
            </div>
        </div>
    )

}

export default ImageDisplay