import { StyleSheet } from "@react-pdf/renderer";

const styles = StyleSheet.create({

  /**
   * Banners: header/footer
   * Pages: firstPage/tocPage/contentPage/lastPage/backPageContent?
   * Parts: title/subtitle
   * Styles: 
   */
  firstPage: {
    flexDirection: 'column',
    paddingTop: 100,
    paddingBottom: 65,
  },

  title: {
    //position: "absolute",
    //width: "100%",
    //top: 150,
    fontSize: 30,
    fontWeight:900,
    fontFamily:"Helvetica-Bold",
    textAlign:"left",
    marginLeft:50,
    marginVertical: 20,
    color: 'white'
  },

  subtitle: {
    fontSize: 24,
    textAlign:"left",
    marginLeft:50,
    color: 'white'
  },

  featuredImage: {
    top: 175,
    textAlign: 'center',
    marginHorizontal: 'auto',
    width: '30%',
  },

  // Specific metadata
  company: {
    fontStyle: 'italic', // ne semble pas fonctionner
    fontSize: 12,
    textAlign: 'center',
    marginTop: 15,
    marginBottom: 150,
  },

  // Page 2
  tocPage: {
    flexDirection: 'column',
    paddingTop: 35,
    paddingBottom: 65,
    paddingHorizontal: 30,
  },

  contentTable: {
    position: "relative",
    marginTop: 30,
    marginHorizontal: 50,
  },

  contentTableTitle: {
    textAlign: "center",
    marginBottom: 50,
  },

  contentTableLinks: {
    border: "1px black solid",
    borderRadius: 5,
    padding: 10,
    position: "relative",
    marginHorizontal: 20,
  },

  contentPage: {
    flexDirection: 'column',
    //paddingTop: 35,
    //paddingBottom: 65,
    paddingHorizontal: 100,
  },

  header: {
    position: 'relative',
    marginBottom: 10,
    borderBottom: 1,
    borderColor: 'grey',
    //backgroundColor: 'lightgrey',
  },

  text: {
      marginVertical: 12,
      fontSize: 14,
      textAlign: 'justify',
      marginBottom:25,
  },

  imageContent:{
    height:"50%",
    width:"50%",
    marginLeft:"25%",
    objectFit:"contain",
    zIndex:1
  },

  footer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,

    margin: 10,
    marginTop: 30,
    padding: 10,

    fontSize: 12,
    color: 'grey',

    borderTop: 1,
    borderColor: 'grey',
    //backgroundColor: 'lightgrey',
  },

 footerMargin: {
    margin : 20,
    height : "10px",
    //backgroundColor : "blue",
 },

  pageNumber: {
    //color: "black", backgroundColor: 'green',
    position: 'absolute',
    right: 0,
    padding: 10,
  },

  footerContent: {
    width: "90%",
    textAlign: "center",
    //backgroundColor: 'red',
  },

  companyBackgroundImage: {    
    position: 'absolute',
    top: 0,
    left : 0,
    right: 0,
    bottom: 0,
    objectFit: 'fill',
  },

  companyBackground: {
    //backgroundColor:'blue',
    zIndex: 999,
    position: 'absolute',
    top: 0,
    left : 0,
    right: 0,
    bottom: 0,
  },

  // Metadata Utilities
  metadataBlock: {
    position: "absolute",
    bottom: 100,
    left: 50,
    width: 325,
    fontSize: 12,
    color: 'white'
    //backgroundColor: "blue",
  },
  
  metadataLine: {
    flexDirection: "row",
    paddingLeft: "5px",
    borderLeftStyle: "solid",
    borderLeftColor: "white",
    borderLeftWidth: "2px",
    
    //backgroundColor: "orange",
  },
  
  lastPage: {
    flexDirection: 'column',
    paddingTop: 35,
    paddingBottom: 65,
  },

  backPageContent: {
    textAlign: 'center',
    marginVertical: 'auto',
    color: 'grey',
  },

  /**
   * Text styles
   */
  title1: {
    fontSize: 16,
    fontWeight:900,
    fontFamily:"Helvetica-Bold",
    textAlign: 'left',
    marginVertical: 20,
    //backgroundColor: "yellow",
  },

  title2: {
    fontSize: 14,
    textAlign: 'left',
    marginVertical: 20,
    //backgroundColor: "red",
  },

  title3: {
    fontSize: 12,
    marginVertical: 20,
    //backgroundColor: "blue",
  },

  title4: {
    fontSize: 12,
    marginVertical: 20,
    //backgroundColor: "violet",    
  },

  title5: {
    fontSize: 12,
    marginVertical: 20,
  },

  title6: {
    fontSize: 12,
    marginVertical: 20,
  },

  link: {
    fontSize: 12,
    color: 'black',
    marginBottom: 10,
  },

  subLink: {
    fontSize: 12,
    color: 'grey',
    marginLeft: 20,
    marginBottom: 10,
  },

  centeredText: {
    marginVertical: 'auto',
    marginHorizontal: 12,
    fontSize: 16,
  },

  label: {
    fontWeight: "extrabold",
    width: 75,
    textAlign: "right",
    //backgroundColor: "violet",
  },

  sep: {
    paddingLeft: 5,
    paddingRight: 5,
    //backgroundColor: "yellow",
  },

  value: {
  },

  /**
   * Block and paragraph styles
   */

  para: {
    backgroundColor: 'lightgrey',
  },

  container: {
      flexDirection: 'row',
      marginBottom: 10,
  },

  /**
   *  General styles
   */
  alignStart: {
      flex: 1,
      textAlign: 'justify',
      fontSize: 14,
  },

  alignEnd: {
      flex: 1,
      textAlign: 'justify',
      fontSize: 14,
  },

  /**
   * Image styles
   */
  image: {
    margin: 12,
    width: 30,
    height: 30,
  },

  backgroundImageContainer: {
      width: '100%',
      // pb d'ajustement de la hauteur : un fit-content ne fonctionne pas et pourtant on aimerait que le container s'ajuste à la hauteur de l'image
      height: '50%', 
  },

  backgroundImage: {
      objectFit: 'contain',
      position: 'absolute',
      top: 0,
      zIndex: -1,
      width: '100%',
      height: 'auto',
  },

  fullBackgroundImage: {
      objectFit: 'cover',
      position: 'absolute',
      zIndex: -1,
      width: '100%',
      height: '100%',
  },

  fullBackgroundImageContainer: {
      width: '100%',
      height: '88%',
  },

  imageInPara: {
      margin: 12,
      width: 'auto',
      height: 150,
  },

});
  
export default styles