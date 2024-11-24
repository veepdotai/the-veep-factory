import { Container, Stack } from 'react-bootstrap';
import { Logger } from 'react-logger-lib';

import Tour from './Tour';

export function ScreenHeading( {name, title, subtitle}) {
    return (    
        <Container className="w-full border-bottom m-0">
            <Heading name={name} className="p-0 pt-2 pb-2 fs-4">{title}</Heading>
            {/*<Heading className="p-0 mt-0-2 fs-7 font-italic text-secondary">{subtitle}</Heading>*/}
        </Container>
    )

}

export function Heading( props ) {
    const log = Logger.of(Heading.name);

    return (
        <Stack direction="horizontal">
            <Container className={props.className}>{props.children}</Container>
            <Tour className="ms-auto" name={props.name} />
        </Stack>
    )
}

export function Section1Heading( props ) {
    const log = Logger.of(Section1Heading.name);

    return (
        <Container>{props.children}</Container>
    )
}

export function Section2Heading( props ) {
    const log = Logger.of(Section2Heading.name);

    return (
        <Container>{props.children}</Container>
    )
}