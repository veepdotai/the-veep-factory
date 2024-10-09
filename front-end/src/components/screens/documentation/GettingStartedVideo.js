import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

import { Constants } from "src/constants/Constants";

import { Container } from 'react-bootstrap';
import Video from '../../common/Video.js';

export default function GettingStartedVideo() {

    const markdown = `
`;    
    return (
        <>
            <Markdown remarkPlugins={[remarkGfm]}>{markdown}</Markdown>

            <Container className="justify-center">
                <Video poster={Constants.ROOT + '/assets/images/prez-poster.png'} src="https://demo.veep.ai/wp-content/uploads/2023/11/veep.ai_v1.2.2.1-an.mp4" />
            </Container>
        </>
    )
}