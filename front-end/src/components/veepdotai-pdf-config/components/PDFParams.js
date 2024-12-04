import { t } from 'i18next';
import moment from 'moment';
import { Logger } from 'react-logger-lib';
import stylesA4 from '../default.css';
import stylesLinkedin from '../defaultLinkedin.css';

const log = Logger.of("PDFParams");

export default class PDFParams {
    
    /**
     * 
     * @param {String} title title of the pdf
     * @param {String} subTitle subtitle of the pdf
     * @param {*} format format in which the pdf will render, either {height, width} or the name of the format. Format is used to set the dimension attribute, which is always {height, width}
     * @param {String} companyName name of the company
     * @param {String} companyImage logo of the company
     * @param {String} backgroundImage image to display at the back of the content of the PDF (only content, not cover or back cover)
     * @param {String} backgroundImageCover image to display at the back of the cover
     * @param {String} author the author of the document
     * @param {String} version the version of the PDF (note to devs : functions are available to automatically increment the version)
     * @param {Date} date date of the last update of the PDF
     * @param {String} footer content to put inside the footer (string)
     * @param {Array} backCover list of backcovers to display ([[number of the backcover, background of the backcover, content fo the backcover, title of the back cover], etc...])
     * @param {Boolean} newPage true if a new page should be started at every level 1 title, false otherwise
     * @param {Boolean} displayHeader  boolean to know if the header will be displayed
     * @param {Boolean} displayFooter boolean to know if the footer will be displayed
     * @param {StyleSheet} stylesheet sheet of css styles to use
     */
    constructor (params) {
        log.trace("constructor: params: " + JSON.stringify(params))

        this.title = params?.title
        this.subTitle = params?.subTitle || params?.subtitle

        this.styles = params?.stylesheet || ""
        log.trace("styles: " + JSON.stringify(this.styles))
        this.stylesheet= params?.stylesheet || stylesA4

        this.format = params?.format || "A4"
        this.setFormat(this.format)

        this.companyName = params?.companyName || t("DefaultCompanyName")
        this.companyImg = params?.companyImage || "./assets/images/nothing.png"
        this.backgroundImg = params?.backgroundImage || "./assets/images/nothing.png"
        this.backgroundImgCover = params?.backgroundImageCover || "./assets/images/gradients/ff0076-590fb7.png"
        
        this.backCover = params?.backCover || [[1, "./assets/images/gradients/ff0076-590fb7.png", t("DefaultBackCoverContent"), t("DefaultBackCoverTitle")]]

        this.newPage = params?.newPage || true
        this.toc = params?.toc || true

        this.author = params?.author || t("DefaultAuthor") 
        this.version = params?.version  || t("DefaultVersionNumber") || "1.0.2"
        this.date = params?.date || moment().format("DD/MM/YYYY")
        this.footer = params?.footer || t("DefaultFooterContent")

        this.displayHeader = params?.displayHeader || true
        this.displayFooter = params?.displayFooter || true
    }

    /**
     * Changes if necessary the format to another one that reactPDF can understand.
     * @param {String} newFormat 
     */
    setFormat(newFormat){
        this.format = newFormat

        if (newFormat == "linkedin"){
            this.dimensions = {width: 800, height: 800}
            this.styles = stylesLinkedin
        }
        else if (newFormat == "A4"){
            this.styles = stylesA4
        }
        else{
            this.dimensions = this.format
        }        
    }

    /**
     * Refreshes the date of the document to the date of the computer.
     */
    refreshDate(){
        this.date = moment().format("DD/MM/YYYY")
    }

    /**
     * 
     * @returns {Array} array containing the position of the dots in the string indicating the version of the document.
     */
    findDotVersion(){
        let first = 1
        let second = 3

        let findFirstDot = false

        for (let i = 0; i < this.version?.length; i++){
            if (this.version.charAt(i) == "." && findFirstDot){
                second = i
                return ([first, second])
            } else if (this.version.charAt(i) == "."){
                first = i
                findFirstDot = true
            }
        }
    }

    /**
     * Increments patch version of the generated document
     * @param {Int} step the step to add
     */
    incrementPatchVersion(step = 1) {
        let dotPosition = this.findDotVersion()
        this.version = this.version.substring(0, dotPosition[1]) + "." + (parseInt(this.version.substring(dotPosition[1]+1)) +step)
    }

    /**
     * Increments minor version of the generated document
     * @param {Int} step the step to add
     */
    incrementMinorVersion(step = 1) {
        let dotPosition = this.findDotVersion()
        this.version = this.version.substring(0, dotPosition[0]) + "." + (parseInt(this.version.substring(dotPosition[0]+1)) +step) + ".0"
    }

    /**
     * Increments major version of the generated document
     * @param {Int} step the step to add
     */
    incrementMajorVersion(step = 1) {
        let dotPosition = this.findDotVersion()
        this.version = (parseInt(this.version.substring(0, dotPosition[0])) + step) + ".0.0"
    }

    /**
     * 
     * @returns A string of the current CSS ready to display to the user
     */
    getStyleString() {
        const affichage = JSON.stringify(this.styles)
        let result = ""
        let i = 1
        for(i; i < affichage?.length; i += 1) {
            if (affichage[i] == "}"){
                result += "\n"
            }
            
            result += affichage[i]
            
            if (affichage[i] == "," && affichage[i-1] == "}"){
                result += "\n \n"
            }else if (affichage[i] == "," || affichage[i] == "{"){
                result += "\n    "
            }
        }
        return String(result.substring(0, result?.length-1))
    }

    /**
     * Transforms a CSS String to a JSON String which can be used to create a stylesheet
     * @param {String} cssString A string version of a CSS document
     * @returns A JSON String corresponding to the CSS
     */
    translateCSStoJSON (cssString){
        const legalChar = ["a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z", "-", "\"", "A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z"]
        const closingChar = [",", ":", "{", "}"]
    
        let inQuote = false
        let result = ""

        let i = 0
        for (i; i < cssString?.length; i++){
            if ( legalChar.includes(cssString[i]) && !inQuote && cssString[i] != "\"" && !(legalChar.includes(cssString[i-1])) ){
                result += "\""
                result += cssString[i]
                inQuote = true
            } else if ( inQuote && cssString[i] != "\"" && closingChar.includes(cssString[i+1]) ){
                result += cssString[i]
                result += "\""
                inQuote = false
//            } else if (inQuote && cssString[i] == "-"){
//                result += cssString[i+1].toUpperCase()
//                i += 1
            } else if (cssString[i] == "{" && cssString[i-1] != ":"){
                result += ":{"
            } else if (cssString[i] == ";"){
                if (cssString[i+2] != "}")
                    result += ","
            } else if (cssString[i] == "\""){
                inQuote = !inQuote
                result += cssString[i]
            } else {
                result += cssString[i]
            }
        }
        return "{" + result + "}"
    }
}