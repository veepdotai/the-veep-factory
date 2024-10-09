import { Input } from 'src/components/ui/shadcn/input';
import { Button } from "src/components/ui/shadcn/button";
import { useEffect, useRef, useState } from 'react'
import icones from '../icons'


const BackCoverDisplay = (props) => {
    const [image, setImage] = useState("./assets/images/nothing.png")
    const [content, setContent] = useState("")
    const [title, setTitle] = useState("")

    useEffect(
      () => {props.handleChange([number, image, content, title])},
      [image, content, title]
    )

    const number = props.number

    const inputBack = useRef(null)


    if (props.isLast){
      return (
        <div>
          <h2> Fond de la dernière de couverture  :</h2>
          <Input type="file" onChange={(choisit) => { try {setImage(URL.createObjectURL(choisit.target.files[0]))}catch{}}}/>
          
          <Button className='my-1 mx-1 px-0 h-9 w-9' onClick={() => {
            setImage("./assets/images/nothing.png")
            if (inputBack.current) {
                inputBack.current.value = "";
                inputBack.current.type = "text";
                inputBack.current.type = "file";
            }
            props.handleChange([number, image, content])
          }}> {icones.trash} </Button>

          <h2>Titre de la dernière de couverture </h2>
          <Input type="text" placeholder='Titre de la dernière de couverture' className='focus-visible:ring-0 focus-visible:ring-transparent focus-visible:ring-offset-0' onInput={(choisit) => {setTitle(choisit.target.value)}}/>


          <h2>Texte de la dernière de couverture </h2>
          <Input type="text" placeholder='Texte de la dernière de couverture' className='focus-visible:ring-0 focus-visible:ring-transparent focus-visible:ring-offset-0' onInput={(choisit) => {setContent(choisit.target.value)}}/>
        </div>
      )
    }
    else {
      return (
          <div>
            <h2> Fond de la page d'annexe n° {number} :</h2>
            <Input type="file" onChange={(choisit) => { try {setImage(URL.createObjectURL(choisit.target.files[0]))}catch{}}}/>
            
            <Button className='my-1 mx-1 px-0 h-9 w-9' onClick={() => {
              setImage("./assets/images/nothing.png")
              if (inputBack.current) {
                  inputBack.current.value = "";
                  inputBack.current.type = "text";
                  inputBack.current.type = "file";
              }
              props.handleChange([number, image, content])
            }}> {icones.trash} </Button>

            <h2>Titre de la page d'annexe n° {number}</h2>
            <Input type="text" placeholder='Titre de la dernière de couverture' className='focus-visible:ring-0 focus-visible:ring-transparent focus-visible:ring-offset-0' onInput={(choisit) => {setTitle(choisit.target.value)}}/>


            <h2>Texte de la page d'annexe n° {number}</h2>
            <Input type="text" placeholder='Texte de la dernière de couverture' className='focus-visible:ring-0 focus-visible:ring-transparent focus-visible:ring-offset-0' onInput={(choisit) => {setContent(choisit.target.value)}}/>
          </div>
      )
    }
}

export default BackCoverDisplay