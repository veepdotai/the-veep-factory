import { Constants } from "src/constants/Constants";

export default function LogoWithUrl( {height = "5em"} ) {
    return (
      <a
        href="https://www.veep.ai?utm_source=veepdotai-app&utm_medium=default-template&utm_campaign=launching"
        target="_blank"
        rel="noopener noreferrer"
      >
          <img  style={{height: height}} className="p-2" src={Constants.ROOT + '/assets/images/veep.ai-wnb.png'} alt="Veep.AI" />
      </a>
    )
}