import React from 'react'
import { t } from 'i18next'

import { Checkbox } from 'src/components/ui/shadcn/checkbox';
import { Label } from "src/components/ui/shadcn/label"

export default class LayoutDisplay extends React.Component {

    constructor(props){
        super(props)

        this.header = true,
        this.footer = true,
        this.newPage = true,
        this.toc = true

        this.handleChange = this.handleChange.bind(this)
    }

    handleChange(){
      this.forceUpdate()
      this.props.handleChange(this.header, this.footer, this.newPage, this.toc)
    }

    render () {
        return (
            <div className='flex flex-col h-[50%] my-8'>
                <Label className='mb-2'>{t("Display")}</Label>
                <div className='flex mb-2'>
                  <Checkbox  id="header" checked={this.header} onClick={() => {
                        this.header = !this.header 
                        this.handleChange()
                    }}/>
                  <Label className='pl-2 pr-2' htmlFor="header">{t("Header")}</Label>
                </div>

                <div className='flex mb-2'>
                  <Checkbox id="footer" checked={this.footer} onClick={() => {
                        this.footer = !this.footer 
                        this.handleChange()
                    }}/>
                  <Label className='pl-2' htmlFor="footer">{t("Footer")}</Label>
                </div>

                <div className='flex mb-2'>
                  <Checkbox id="newPage" checked={this.newPage} onClick={() => {
                    this.newPage = !this.newPage
                    this.handleChange()
                  }}/>
                  <Label className='pl-2' htmlFor='newPage'>{t("PageBreak")}</Label>
                </div>

                <div className='flex mb-2'>
                  <Checkbox id="toc" defaultChecked={this.toc} onClick={() => {
                    this.toc = !this.toc
                    this.handleChange()
                  }}/>
                  <Label className='pl-2' htmlFor='toc'>{t("TOC")}</Label>
                </div>
            </div>
        )
    }
}