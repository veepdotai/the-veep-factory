import { Input } from 'src/components/ui/shadcn/input';
import { Button } from "src/components/ui/shadcn/button";
import { useEffect, useRef, useState } from 'react'
import icones from '../icons'


const BackCoverDisplay = (props) => {
    const [image, setImage] = useState("./assets/images/nothing.png")
    const [content, setContent] = useState("")
    const [title, setTitle] = useState("")

    useEffect(() => {
      props.handleChange([number, image, content, title])
    }, [image, content, title])

    const number = props.number
    const inputBack = useRef(null)

    return (
      <div>
        <h2>
          {props.isLast ? "Fond de la dernière de couverture: " : "Fond de la page d'annexe n° {number}: "}
        </h2>
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

        <h2>
          {props.isLast ? "Titre de la dernière de couverture: " : "Titre de la page d'annexe n° {number}: "}
        </h2>
        <Input type="text"
          placeholder={props.isLast ? "Titre de la dernière de couverture: " : "Titre de la page d'annexe n° {number}: "}
          className='focus-visible:ring-0 focus-visible:ring-transparent focus-visible:ring-offset-0'
          onInput={(choisit) => {setTitle(choisit.target.value)}}
        />

        <h2>
          {props.isLast ? "Texte de la dernière de couverture: " : "Texte de la page d'annexe n° {number}: "}
        </h2>
        <Input type="text"
          placeholder={props.isLast ? "Texte de la dernière de couverture: " : "Texte de la page d'annexe n° {number}: "}
          className='focus-visible:ring-0 focus-visible:ring-transparent focus-visible:ring-offset-0'
          onInput={(choisit) => {setContent(choisit.target.value)}}
        />
      </div>
    )
}

export default BackCoverDisplay