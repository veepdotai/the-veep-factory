import { Button, Carousel, Card } from 'react-bootstrap';
import { runInNewContext } from 'vm';

export default function AddContentWizard() {
    const palettes = [
        { from: "#f40076", to: "#df98fa" },
        { from: "#f06966", to: "#fad6a6" },
        { from: "#ff0076", to: "#590fb7" },
        { from: "#9055ff", to: "#13e2da" },
        { from: "#0b63f6", to: "#003cc5", color: "white" },
        { from: "#d6ff7f", to: "#00b3cc" },
        { from: "#e233ff", to: "#ff6b00" },
        { from: "#df98fa", to: "#9055ff" },
        { from: "#ed7b84", to: "#9055ff" },
        { from: "#402565", to: "#30be96" },
        { from: "#402662", to: "#3900a6", color: "white" }, // 10
        { from: "#f14658", to: "#dc2537", color: "white" },
        { from: "#f40076", to: "#342711", color: "white" },
        { from: "#000066", to: "#6699ff", color: "white" },
        { from: "#cb5eee", to: "#4be1ec" },
        { from: "#fa7cbb", to: "#f14658" }, // 15
        { from: "#737dfe", to: "#ffcac9" },
        { from: "#2f80ed", to: "#b2ffda" }
      ];

    // 4,w | 10,w | 11,w | 12,w | 13,w
    // 7,w | 9,w
    let angle = "+135";
    let color = "white";
    let i = 13;

    let outerStyle = {width: "100%", height: "300px"};
    let innerStyle = {height: "300px"};

    function getCardStyle(i) {
        let cardStyle = {
          "color": color,
          "width": "300px",
          "backgroundImage": `linear-gradient(${angle}deg, ${palettes[i].from}, ${palettes[i].to})`
        };
        return cardStyle;
    }

    let cardCN = "w-50 vh-50 mx-auto";
    let cardTextCN = "fw-bold p-3";
    let categoryCN = {"className": "text-black fw-bold bg-white"};
    
    return (
        <>
            <Carousel data-bs-theme="dark" style={outerStyle}>
                {
                    palettes.map((row, i) => {
                        if (row.color == "white") {
                            return (
                                <Carousel.Item key={i} style={innerStyle}>
                                    <Card className={cardCN} style={{...getCardStyle(i)}}>
                                        <Card.Text className={cardTextCN}>
                                            Articles de blog, livres blancs, retours d'expérience, interviews, témoignages...
                                        </Card.Text>
                                        <Card.Footer {...categoryCN}>Communication/marketing</Card.Footer>
                                    </Card>
                                    <Carousel.Caption>
                                        <Button>Choisir</Button>
                                    </Carousel.Caption>
                                </Carousel.Item>
                        )}
                    } )
                }
            </Carousel>
        </>
    )
}