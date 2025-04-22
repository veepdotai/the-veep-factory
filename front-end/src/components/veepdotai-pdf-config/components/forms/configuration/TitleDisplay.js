import React from 'react';
import { t } from 'src/components/lib/utils'
import { Label } from "src/components/ui/shadcn/label"

export default class TitleDisplay extends React.Component {

    constructor(props){
        super(props)

        this.handleChangeTitle = this.handleChangeTitle.bind(this)
        this.handleChangeName = this.handleChangeName.bind(this)
        this.handleChangeSubtitle = this.handleChangeSubtitle.bind(this)
        this.handleChangeAuthor = this.handleChangeAuthor.bind(this)
        this.color = "text-slate-500"
    }

    handleChangeTitle(value) {
      this.props.handleChangeTitle(value)
    }

    handleChangeName(value) {
        this.props.handleChangeName(value)
      }

    handleChangeSubtitle(value) {
      this.props.handleChangeSubtitle(value)
    }

    handleChangeAuthor(value) {
      this.props.handleChangeAuthor(value)
    }

    getInput() {

    }
    
    render () {
        return (
            <div className='items-center h-full justify-center list-item'>
              <div>
                <Label className={this.color} htmlFor="PDFDocumentTitle">{t("PDFDocumentTitle")}</Label>
                <input id="PDFDocumentTitle"
                  type='text'
                  defaultValue={this.props.defaultTitle}
                  placeholder={t("PDFDocumentTitle")}
                  className='p-1 w-full border-grey border-solid border-1 rounded-2 fs-xs'
                  onInput={(event) => {this.handleChangeTitle(event.target.value)}}
                />
              </div>

              <div className='mt-2'>
                <Label className={this.color} htmlFor="PDFDocumentSubtitle">{t("PDFDocumentSubtitle")}</Label>
                <input id="PDFDocumentSubtitle"
                  type='text'
                  defaultValue={this.props.defaultSubtitle}
                  placeholder={t("PDFDocumentSubtitle")}
                  className='p-1 w-full border-grey border-solid border-1 rounded'
                  onInput={(event) => {this.handleChangeSubtitle(event.target.value)}}
                />
              </div>

              <div className='mt-2'>
                <Label className={this.color} htmlFor="OrgName">{t("OrgName")}</Label>
                <input id="OrgName"
                  type="text"
                  defaultValue={this.props.defaultName}
                  placeholder={t("OrgName")}
                  className='p-1 w-full border-grey border-solid border-1 rounded'
                  onInput={(event) => {this.handleChangeName(event.target.value)}}
                  />
              </div>

              <div className='mt-2'>
                <Label className={this.color} htmlFor="AuthorName">{t("AuthorName")}</Label>
                <input id="AuthorName"
                  type='text'
                  defaultValue={this.props.defaultAuthor}
                  placeholder={t("AuthorName")}
                  className='p-1 w-full border-grey border-solid border-1 rounded'
                  onInput={(event) => {this.handleChangeAuthor(event.target.value)}}
                />
              </div>
            </div>
            
        )
    }
}