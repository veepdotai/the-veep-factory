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
    paddingTop: 35,
    paddingBottom: 65,
  },

  featuredImage: {
    top: 350,
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
    border: "1px blue solid",
    borderRadius: 50,
    padding: 10,
    position: "relative",
    marginHorizontal: 20,
  },

  contentPage:{
    flexDirection:"column",
    paddingHorizontal:100
  },
  
  header:{
      position:"relative",
      marginBottom:10,
      borderBottom:1,
      borderColor:"grey"
  },

  title:{
      fontSize:50,
      textAlign:"center",
      marginVertical:50
  },
  
  subtitle:{
      fontSize:40,
      textAlign:"center",
      marginVertical:30
  },
  
  text:{
      marginVertical:30,
      fontSize:30,
      textAlign:"justify"
  },

  imageContent:{
    position:"absolute",
    height:"75%",
    width:"75%",
    marginHorizontal:"25%",
    objectFit:"contain",
    zIndex:1
  },

  footer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,

    margin: 10,
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
    fontSize: 24,
    textAlign: 'left',
    marginVertical: 20,
    //backgroundColor: "yellow",
  },

  title2: {
    fontSize: 22,
    textAlign: 'left',

    marginVertical: 20,
    //backgroundColor: "red",
  },

  title3: {
    fontSize: 20,
    marginVertical: 20,
    //backgroundColor: "blue",
  },

  title4: {
    fontSize: 18,
    marginVertical: 20,
    //backgroundColor: "violet",    
  },

  title5: {
    fontSize: 16,
    marginVertical: 20,
  },

  title6: {
    fontSize: 14,
    marginVertical: 20,
  },

  link: {
    fontSize: 14,
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

  // Metadata Utilities
  metadataBlock: {
    position: "absolute",
    bottom: 100,
    left: 250,
    width: 325,
    fontSize: 12,
    //backgroundColor: "blue",
  },
  
  metadataLine: {
    flexDirection: "row",
    borderLeft: "1px grey solid",
    //backgroundColor: "orange",
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