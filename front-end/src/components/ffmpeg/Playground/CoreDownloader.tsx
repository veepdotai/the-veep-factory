import { Container } from "react-bootstrap";
import LinearProgressWithLabel from "../common/LinearProgressWithLabel";
import { CORE_SIZE } from "./const";

export default function CoreDownloader({ url, received }) {
  const total = CORE_SIZE[url];
  return (
    <Container>
      {`Downloading ${url}`} / {`(${received} / ${total} bytes)`}
      <LinearProgressWithLabel value={(received / total) * 100} />
    </Container>
  );
}
