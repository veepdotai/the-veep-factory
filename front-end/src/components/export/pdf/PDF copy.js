import { PDFViewer, PDFDownloadLink, Link, Page, Text, Image, View, Document, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  link: {
      fontSize: 16,
      color: 'black',
      marginBottom: 10,
  },

  subLink: {
      fontSize: 14,
      color: 'grey',
      marginLeft: 20,
      marginBottom: 10,
  },

  contentTable: {
      marginHorizontal: 20,
  },

  page: {
      flexDirection: 'column',
      paddingTop: 35,
      paddingBottom: 65,
      paddingHorizontal: 35,
  },

  pdfTitle: {
      fontSize: 30,
      fontWeight: 'bold', // ne semble pas fonctionner
      textAlign: 'center',
  },

  title: {
      fontSize: 24,
      textAlign: 'center',
      marginVertical: 20,
  },

  subTitle: {
      fontSize: 18,
      marginVertical: 20,
  },

  company: {
      fontStyle: 'italic', // ne semble pas fonctionner
      fontSize: 12,
      textAlign: 'center',
      marginTop: 15,
      marginBottom: 150,
  },

  featuredImage: {
      textAlign: 'center',
      marginHorizontal: 'auto',
      width: '50%',
  },

  backPageContent: {
      textAlign: 'center',
      marginVertical: 'auto',
      color: 'grey',
  },

  pageNumber: {
      position: 'absolute',
      fontSize: 12,
      bottom: 30,
      left: 0,
      right: 0,
      textAlign: 'center',
      color: 'grey',
  },

  header: {
      position: 'relative',
      marginBottom: 10,
      backgroundColor: 'lightgrey',
  },

  para: {
      backgroundColor: 'lightgrey',
  },

  text: {
      marginVertical: 12,
      fontSize: 14,
      textAlign: 'justify',
  },

  image: {
      margin: 12,
      width: 50,
      height: 50,
  },

  container: {
      flexDirection: 'row',
      marginBottom: 10,
  },

  imagePara: {
      margin: 12,
      width: 'auto',
      height: 150,
  },

  leftText: {
      flex: 1,
      textAlign: 'justify',
      fontSize: 14,
  },

  rightText: {
      flex: 1,
      textAlign: 'justify',
      fontSize: 14,
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

  centeredText: {
      marginVertical: 'auto',
      marginHorizontal: 12,
      fontSize: 16,
  },
});
  
  
// Create Document Component
export function PDF() {
  return (
    <>
      <PDFViewer width={'100%'} height={'650rem'}>
          <PDFDocument companyName="Nom de l'entreprise" pdfTitle="Nom du document" companyImg="./images/veep.png"/>
      </PDFViewer>

      {/*<PdfLink />*/}
    </>

  )
}

export function PDFDocument( {props} ) {

  let data = {
    pdfTitle: "Compte rendu",
    companyImg: "./assets/images/veep.png",
    companyName: "Veep.AI",
    imageBg: "https://images.pexels.com/photos/2088205/pexels-photo-2088205.jpeg",
    imageBg2: "https://images.pexels.com/photos/6144105/pexels-photo-6144105.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
  }

  return (
    <Document>
        <Page style={styles.page} bookmark={"Page de couverture"}>
            <Text style={styles.pdfTitle}>{data.pdfTitle}</Text>

            <Text style={styles.company}>
                {data.companyName}
            </Text>

            <Image
                style={styles.featuredImage}
                src={data.companyImg}
            />

            <Text
                style={styles.pageNumber}
                render={({ pageNumber, totalPages }) => (
                    `${pageNumber} / ${totalPages}`
                )}
                fixed
            />
        </Page>

        <Page style={styles.page} bookmark={"Sommaire"}>
            <Text style={styles.title}>Sommaire</Text>
            
            <View style={styles.contentTable}>
                <Link style={styles.link} src='#paragraph'>Paragraphes simples</Link>
                <Link style={styles.link} src='#imgPara'>Tests de paragraphes avec images</Link>
                    <Link style={styles.subLink} src='#rightImage'>Paragraphe avec image à droite</Link>
                    <Link style={styles.subLink} src='#leftImage'>Paragraphe avec image à gauche</Link>
                <Link style={styles.link} src='#bgImgTests'>Tests d'images en fond</Link>
                    <Link style={styles.subLink} src='#bgImg'>Image avec texte par dessus</Link>
                    <Link style={styles.subLink} src='#fullbgImg'>Image en fond de page</Link>
            </View>
        </Page>

        <Page style={styles.page} bookmark={"Contenu"}>
            <View style={styles.header} fixed>
                <Image
                    style={styles.image}
                    src={data.companyImg}
                />
            </View>

            <Text style={styles.title} id='paragraph'>
                Paragraphes simples
            </Text>

            <Text style={styles.text}>
                Carrot cake bonbon lollipop brownie sweet roll muffin pastry. Cheesecake cheesecake chocolate bonbon cupcake cheesecake marzipan sweet roll bear claw. Sesame snaps jelly-o lollipop gummi bears donut brownie macaroon. Topping tart sweet roll gingerbread toffee sesame snaps cupcake danish. Dessert oat cake gummi bears cake cheesecake. Carrot cake chocolate bar ice cream dragée danish. Marshmallow fruitcake tart marzipan cheesecake oat cake marzipan. Cheesecake macaroon tootsie roll soufflé brownie cotton candy sweet. Sesame snaps tootsie roll cotton candy sugar plum jelly beans shortbread. Sugar plum wafer biscuit dragée tart. Oat cake gummi bears halvah sugar plum sweet apple pie. Jelly-o toffee soufflé croissant candy canes. Cake oat cake soufflé chupa chups jelly. Dragée gummi bears tiramisu cupcake donut carrot cake halvah macaroon toffee.
            </Text>
            <Text style={styles.text}>
                Gummies chupa chups croissant candy tiramisu jelly beans chocolate cake. Powder oat cake liquorice croissant marshmallow. Carrot cake sweet roll cotton candy dessert gingerbread oat cake bear claw. Liquorice chocolate cake chocolate cake pie marzipan lemon drops. Carrot cake biscuit dragée bonbon chocolate bar donut. Candy wafer chocolate tiramisu bear claw lollipop. Cookie caramels dessert shortbread chupa chups gummies lollipop muffin. Marshmallow danish danish tiramisu powder. Gingerbread chupa chups cookie jelly-o powder chocolate bar jujubes. Lollipop liquorice tart donut brownie ice cream sweet roll gingerbread dessert. Chocolate bar danish marzipan oat cake shortbread halvah carrot cake. Oat cake wafer sesame snaps pastry liquorice cupcake. Croissant marshmallow pie croissant tart chupa chups.
            </Text>
            <Text style={styles.text}>
                Liquorice sugar plum jelly-o chocolate bar cupcake wafer chocolate bar cupcake chupa chups. Macaroon cotton candy carrot cake danish marshmallow. Shortbread gummies halvah marshmallow topping muffin icing cookie. Caramels topping danish jelly dragée. Sweet tootsie roll sweet roll toffee macaroon pudding jujubes. Soufflé marshmallow croissant pastry chocolate marzipan cookie cake cake. Chocolate bar cake pastry chocolate bar cake. Bear claw chupa chups biscuit candy canes cake sweet bonbon jujubes sesame snaps. Carrot cake jujubes sugar plum muffin jelly wafer gummi bears cotton candy carrot cake. Fruitcake liquorice candy marshmallow halvah sugar plum. Ice cream candy canes cheesecake pudding danish apple pie chocolate. Muffin brownie cake jelly beans fruitcake apple pie. Marshmallow cake pudding oat cake marshmallow. Donut carrot cake sweet roll biscuit dragée.
            </Text>
            <Text style={styles.text}>
                Carrot cake jelly beans lollipop croissant apple pie gummies. Tootsie roll bear claw cheesecake cheesecake biscuit danish jujubes bear claw icing. Cotton candy apple pie topping muffin chocolate danish. Tart toffee cookie wafer tootsie roll. Marzipan chocolate cake chocolate bar carrot cake wafer. Soufflé lollipop cotton candy cheesecake gummi bears tiramisu biscuit sugar plum pie. Cotton candy cake caramels danish pastry croissant cheesecake topping. Halvah donut cheesecake chocolate bar bear claw pie. Wafer toffee chupa chups muffin pie tart dragée. Sesame snaps dragée powder chocolate cake marzipan. Marzipan gummi bears jelly-o liquorice chocolate bar chupa chups. Wafer bear claw caramels sugar plum halvah ice cream oat cake tart.
            </Text>
            
            <Text style={styles.title} id='imgPara' break>
                Tests de paragraphes avec images
            </Text>

            <Text style={styles.subTitle} id='rightImage'>
                Paragraphe avec image à droite
            </Text>

            <Text style={styles.text}>
                On utilise un container flex et on met le texte en tant que premier élément afin qu'il soit à gauche de l'image.
            </Text>

            <View style={styles.container}>
                <Text style={styles.leftText}>
                    Biscuit tiramisu pudding chocolate bar oat cake cotton candy. Liquorice jelly chupa chups chupa chups cheesecake macaroon. Icing chocolate jelly muffin chocolate cake cake. Cupcake bonbon shortbread chocolate bar donut brownie. Pastry gummies icing jelly beans chocolate jelly. Biscuit pudding shortbread gummies sesame snaps. Halvah halvah powder croissant cake topping sesame snaps cake. Powder lemon drops apple pie dragée cake. Caramels pudding carrot cake croissant gingerbread jujubes. Sweet biscuit lollipop oat cake donut topping dessert jujubes gummi bears. Candy canes danish candy gummi bears chupa chups pie. Sugar plum jelly-o donut marshmallow biscuit powder gummi bears powder jelly-o.
                </Text>
                <Image
                    style={styles.imagePara}
                    src={data.imageBg}
                />
            </View>

            <Text style={styles.subTitle} id='leftImage'>
                Paragraphe avec image à gauche
            </Text>

            <View style={styles.container}>
                <Image
                    style={styles.imagePara}
                    src="./images/image.jpg"
                />
                <Text style={styles.rightText}>
                    Toffee chocolate cake sesame snaps shortbread cheesecake muffin gummies dragée gummi bears. Cake biscuit sweet roll danish muffin. Biscuit tiramisu pudding chocolate bar oat cake cotton candy. Liquorice jelly chupa chups chupa chups cheesecake macaroon. Icing chocolate jelly muffin chocolate cake cake. Cupcake bonbon shortbread chocolate bar donut brownie. Pastry gummies icing jelly beans chocolate jelly. Biscuit pudding shortbread gummies sesame snaps. Halvah halvah powder croissant cake topping sesame snaps cake. Powder lemon drops apple pie dragée cake. Caramels pudding carrot cake croissant gingerbread jujubes. Sweet biscuit lollipop oat cake donut topping dessert jujubes gummi bears. Candy canes danish candy gummi bears chupa chups pie. Sugar plum jelly-o donut marshmallow biscuit powder gummi bears powder jelly-o.
                </Text>
            </View>

            <Text style={styles.title} id='bgImgTests' break>
                Tests d'images en fond
            </Text>

            <Text style={styles.subTitle} id='bgImg'>
                Image avec texte par dessus
            </Text>
            
            <View style={styles.backgroundImageContainer}>
                <Text style={styles.centeredText}>
                    Toffee chocolate cake sesame snaps shortbread cheesecake muffin gummies dragée gummi bears. Cake biscuit sweet roll danish muffin. Biscuit tiramisu pudding chocolate bar oat cake cotton candy. Liquorice jelly chupa chups chupa chups cheesecake macaroon. Icing chocolate jelly muffin chocolate cake cake. Cupcake bonbon shortbread chocolate bar donut brownie. Pastry gummies icing jelly beans chocolate jelly.
                </Text>

                <Image
                    style={styles.backgroundImage}
                    src={data.imageBg}
                />
            </View>
                    
            <View  style={styles.fullBackgroundImageContainer} break>
                <Text id='fullbgImg' style={styles.subTitle}>
                    Image en fond de page
                </Text>

                <Text style={styles.text}>
                    Texte de remplissage : Toffee chocolate cake sesame snaps shortbread cheesecake muffin gummies dragée gummi bears. Cake biscuit sweet roll danish muffin. Biscuit tiramisu pudding chocolate bar oat cake cotton candy. Liquorice jelly chupa chups chupa chups cheesecake macaroon. Icing chocolate jelly muffin chocolate cake cake. Cupcake bonbon shortbread chocolate bar donut brownie. Pastry gummies icing jelly beans chocolate jelly.
                </Text>

                <Image
                    style={styles.fullBackgroundImage}
                    src={data.imageBg2}
                />
            </View>

            <Text
                style={styles.pageNumber}
                render={({ pageNumber, totalPages }) => (
                    `${pageNumber} / ${totalPages}`
                )}
                fixed
            />
        </Page>

        <Page style={styles.page} bookmark={"Page de garde"}>
            <Text style={styles.backPageContent}>
                PDF généré par Veep.ai
            </Text>

            <Text
                style={styles.pageNumber}
                render={({ pageNumber, totalPages }) => (
                    `${pageNumber} / ${totalPages}`
                )}
                fixed
            />
        </Page>
    </Document>
  );
}

{/*
const PdfLink = () => {
  return (
    <div>
      <PDFDownloadLink document={<MyDocument companyName="Nom de l'entreprise" pdfTitle="Titre du document" companyImg="./images/veep.png"/>} fileName="example.pdf">
          {({ blob, url, loading, error }) =>
              loading ? 'Loading document...' : 'Download pdf'
          }
      </PDFDownloadLink>
    </div>
  );
};
*/}
export default PDF;