import React from 'react';
//On utilise shadcn.ui pour faire le panneau
import { t } from "i18next"

import  {ResizableHandle, ResizablePanel, ResizablePanelGroup } from 'src/components/ui/shadcn/resizable';
import { Input } from 'src/components/ui/shadcn/input';
import { Button } from "src/components/ui/shadcn/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "src/components/ui/shadcn/tabs";

import FormatDisplay from './forms/configuration/FormatDisplay';
import PDFParams from './PDFParams';
import TitleDisplay from './forms/configuration/TitleDisplay';
import ImageDisplay from './forms/configuration/ImageDisplay';
import LayoutDisplay from './forms/configuration/LayoutDisplay';
import AceEditor from 'react-ace';
import "ace-builds/src-noconflict/mode-css";
import "ace-builds/src-noconflict/ext-inline_autocomplete";

import icones from '../icons'

import { StyleSheet } from "@react-pdf/renderer";
import BackCoverDynamicDisplay from './forms/carrousel/BackCoverDynamicDisplay';
import ContentDynamicDisplay from './forms/carrousel/ContentDynamicDisplay';


class ConfigPanel extends React.Component {

  constructor(props){
    super(props)

    this.handleFormatChange = this.handleFormatChange.bind(this)
    this.handleTitleChange = this.handleTitleChange.bind(this)
    this.handleNameChange = this.handleNameChange.bind(this)
    this.handleLogoChange = this.handleLogoChange.bind(this)
    this.handleBackgroundChange = this.handleBackgroundChange.bind(this)
    this.handleSubtitleChange = this.handleSubtitleChange.bind(this)
    this.handleAuthorChange = this.handleAuthorChange.bind(this)
    this.handleLayoutChange = this.handleLayoutChange.bind(this)
    this.handleCSSFileChange = this.handleCSSFileChange.bind(this)
    this.handleCSSTextChange = this.handleCSSTextChange.bind(this)
    this.handleBackCoverChange = this.handleBackCoverChange.bind(this)
    this.handleContentChange = this.handleContentChange.bind(this)
    this.handleCompile = this.handleCompile.bind(this)

    this.content = props.content
    this.param = props.parameter
    this.cssActuel = this.param.getStyleString()
  }

  handleCompile (step=1) {
    this.param.refreshDate()
    //this.param.littleIncrementVersion(step)
    this.props.handleCompilePDF(this.param, this.content)
  }

  handleCSSTextChange(newValue){
    try{
      this.param.styles = StyleSheet.create(JSON.parse(this.param.translateCSStoJSON(newValue)))
      this.cssActuel = this.param.getStyleString()
      this.handleCompile(0)
    }
    catch(erreur){
      console.log(erreur)
    }
  }

  async handleCSSFileChange (event){
    const file = event.target.files[0];
    if (!(file instanceof Blob)){
        this.param.styles = StyleSheet.create()
        return
    }
    const reader = new FileReader();

    reader.onload = () => {
      // Récupération du contenu du fichier CSS et changement des paramètres
      this.param.styles = StyleSheet.create(JSON.parse(this.param.translateCSStoJSON(reader.result)))
      this.cssActuel = this.param.getStyleString()
      this.handleCompile(0)
    };

    reader.onerror = () => {
      reject(reader.error); // Rejeter la promesse en cas d'erreur
    };

    // Lecture du contenu du fichier CSS
    reader.readAsText(file);
  } 

  handleFormatChange(newFormat) {
    this.param.setFormat(newFormat)
    this.cssActuel = this.param.getStyleString()
    this.forceUpdate()
  }
  
  handleTitleChange(newTitle){
    this.param.title = newTitle
  }

  handleNameChange(newName){
    this.param.companyName = newName
  }

  handleLogoChange(newImg){
    this.param.companyImg = newImg
  }

  handleBackgroundChange(newImg){
    this.param.backgroundImg = newImg
  }

  handleSubtitleChange(newSubtitle){
    this.param.subTitle = newSubtitle
  }

  handleAuthorChange(newAuthor){
    this.param.author = newAuthor
  }

  handleLayoutChange(newHeader, newFooter, newNewPage, newToc){
    this.param.displayHeader = newHeader
    this.param.displayFooter = newFooter
    this.param.newPage = newNewPage
    this.param.toc = newToc
  }

  handleBackCoverChange(newCover){
    this.param.backCover = newCover
    this.forceUpdate()
  }

  handleContentChange(newContent){
    this.content = newContent
  }

  presentationPanel() {
    return(
      <div>
          <h2>Fond de la page de garde :</h2>
          <div class="flex">
            <Input type="file"
              onChange={(item) => {this.param.backgroundImgCover = URL.createObjectURL(item.target.files[0])}}/>          
            <Button variant="ghost" className='mt-1 mx-1 px-0 h-9 w-9' onClick={() => {
                this.param.backgroundImgCover = "./assets/images/nothing.png"
            }}>{icones.trash}</Button>          
            <Button variant="ghost" className='mt-1 mx-1 px-0 h-9 w-9' onClick={() => {this.handleCompile()}}>{icones.refresh} </Button>
          </div>
          <div>
            <ContentDynamicDisplay pages={this.content} handleChange={this.handleContentChange} startingPage={this.param.toc ? 2 : 1 } />
            <div className='flex flex-grow-0 h-px mx-5 my-1 bg-gray-400' />
            <BackCoverDynamicDisplay pages={this.param.backCover} handleChange={this.handleBackCoverChange}/>
          </div>
      </div>
    )
  }

  cssPanel() {
    return(
      <div className='w-full h-full'>
        <div className='flex'>
          <Input type="file" className='my-1 mx-1' onChange={this.handleCSSFileChange}></Input>
          <Button variant="ghost" className='mx-1 px-0 h-9 w-9' onClick={() => {this.param.setFormat(this.param.format), this.cssActuel = this.param.getStyleString(), this.handleCompile(0)}}>{icones.reset} </Button>
          <Button variant="ghost" className='mx-1 px-0 h-9 w-9' onClick={() => {this.handleCSSTextChange(this.cssActuel), this.handleCompile()}}>{icones.refresh}</Button>
        </div>
        <AceEditor placeholder='Écrivez votre CSS ici : ' value={this.cssActuel} width='100%' height='100%' mode="css" onChange={(newValue) => {this.cssActuel = newValue}} setOptions={{enableLiveAutocompletion: true, showLineNumbers: true,}}/>
      </div>
    )
  }

  metadataPanel(){
    return (
      <div>
            <div className='flex items-start'>
              
              <div className="mx-2">
                <TitleDisplay 
                  handleChangeTitle={this.handleTitleChange}
                  defaultTitle={this.param.title}
                  handleChangeSubtitle={this.handleSubtitleChange}
                  defaultSubtitle={this.param.subTitle}
                  handleChangeName={this.handleNameChange}
                  defaultName={this.param.companyName}
                  handleChangeAuthor={this.handleAuthorChange}
                  defaultAuthor={this.param.author}
                />
              </div>
            </div>

            <div className="list-item items-center justify-center p-2 my-3">
              <Button className='px-0 h-9 w-9' onClick={() => {this.handleCompile()}}> {icones.refresh} </Button>
            </div>
        </div>
    )
  }

  layoutPanel(){
    return (
      <div>            
            <div className='flex items-start'>

              <div>
                <FormatDisplay baseValue={this.param.format} handleChange={this.handleFormatChange}/>
                <LayoutDisplay  handleChange={this.handleLayoutChange} />
              </div>

              <ImageDisplay handleChangeLogo={this.handleLogoChange} handleChangeBack={this.handleBackgroundChange}/>

            </div>

            <div className="list-item items-center justify-center p-2 my-3">
              <Button className='px-0 h-9 w-9' onClick={() => {this.handleCompile()}}> {icones.refresh} </Button>
            </div>
        </div>
    )
  }

  //Dans le render, le forcemount et le data state hidden permettent aux onglets de ne pas être vus quand ils ne sont pas sélectionnés ET de ne pas perdre leurs états quand changés.
  render() {
    return (
      <Tabs defaultValue="layout" className='flex flex-col h-full'>
        <TabsList className="grid w-full grid-cols-3">
          {/*<TabsTrigger onClick={this.handleCompile} value="presentation">Présentation</TabsTrigger>*/}
          <TabsTrigger onClick={this.handleCompile} value="metadata">{t("Metadata")}</TabsTrigger>
          <TabsTrigger onClick={this.handleCompile} value="layout">{t("Display")}</TabsTrigger>
          <TabsTrigger onClick={this.handleCompile} value="css">{t("CSS")}</TabsTrigger>
        </TabsList>

        <TabsContent value="presentation" className='flex-grow data-[state=inactive]:hidden' forceMount>
          {this.presentationPanel()}
        </TabsContent>

        <TabsContent value="metadata" className='flex-grow data-[state=inactive]:hidden' forceMount>
          {this.metadataPanel()}
        </TabsContent>

        <TabsContent value="layout" className='flex-grow data-[state=inactive]:hidden' forceMount>
          {this.layoutPanel()}
        </TabsContent>

        <TabsContent value="css" className='flex-grow data-[state=inactive]:hidden' forceMount>
          {this.cssPanel()}
        </TabsContent>

      </Tabs>
    )
  }
}

export default ConfigPanel