import { Button, Container, Spinner } from "react-bootstrap";

export default function SuspenseClick({waiting, disabled, handleAction, label, children}) {

    return (
            <Button variant='outline-info' className='p-2 btn btn-sm fs-6 ms-auto' disabled={disabled} onClick={handleAction}>
                {waiting ?
                <Spinner className="me-2" as="span" animation="border" size="sm" role="status" aria-hidden="true" />
                :
                <></>
                }
                {children}{label}
            </Button>
    )
}