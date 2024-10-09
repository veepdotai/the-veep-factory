import React from 'react'
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

export default class formatDisplay extends React.Component {

    constructor(props){
        super(props)

        this.state = {format : this.props.baseValue}
        this.handleChange = this.handleChange.bind(this)
    }

    handleChange(choisit){
      this.setState({format : choisit})
      this.props.handleChange(choisit)
    }

    render () {
        return (
          <>
            <Label>{t("DocumentFormatSelector")}</Label>
            <DropdownMenu modal={false}>
              <DropdownMenuTrigger asChild> 
                <Button variant="ghost" className=''>{this.state.format}</Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent>
                <DropdownMenuRadioGroup defaultValue={this.state.format} onValueChange={(value) => {this.handleChange(value)}}>
                  <DropdownMenuRadioItem value="A4">A4</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="linkedin">LinkedIn</DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </>
        )
    }
}

/*
            <div className='flex h-[50%]'>
                  <RadioGroup id="format" defaultValue={this.baseValue}>
                    <Label htmlFor='format'>Format du document : </Label>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="A4" id="A4" onClick={() => {
                        this.handleChange("A4")
                      }} />
                      <Label htmlFor="A4">A4</Label>

                      <RadioGroupItem value="linkedin" id="linkedin" onClick={() => {
                        this.handleChange("linkedin")
                      }} />
                      <Label htmlFor="linkedin">LinkedIn</Label>
                    </div>

                  </RadioGroup>
            </div>
*/