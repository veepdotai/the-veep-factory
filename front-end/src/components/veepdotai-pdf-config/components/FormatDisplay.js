import {useState} from 'react'
import { t } from 'i18next'

import {RadioGroup, RadioGroupItem} from 'src/components/ui/shadcn/radio-group';
import { Label } from "src/components/ui/shadcn/label"

import {Button} from "src/components/ui/shadcn/button"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "src/components/ui/shadcn/dropdown-menu"

export default function FormatDisplay(props) {

    const [state, setState] = useState({format : props.baseValue})

    function handleChange(value){
      setState({format : value})
      handleChange(value)
    }

    return (
      <>
        <Label>{t("DocumentFormatSelector")}</Label>
        <DropdownMenu modal={false}>
          <DropdownMenuTrigger asChild> 
            <Button variant="ghost" className=''>{state.format}</Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent>
            <DropdownMenuRadioGroup defaultValue={state.format} onValueChange={(value) => {handleChange(value)}}>
              <DropdownMenuRadioItem value="A4"><img className="h-[30px] rounded" src="/assets/images/gradients/9055ff-13e2da.png" />A4</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="linkedin">LinkedIn</DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </>
    )
}
