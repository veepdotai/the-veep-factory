import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { t } from 'i18next';
import { Logger } from 'react-logger-lib';

import { Button, Card, Container, Form } from "react-bootstrap";
import PromptsStore from "../screens/PromptsStore";

import PubSub from 'pubsub-js';

export default function GenericForm( props ) {
  const log = Logger.of(GenericForm.name);
  log.trace("Initialization");
  


  const { register, getValues, setValue, handleSubmit, formState: { errors } } = useForm();
  const [fields, setFields] = useState(props.data);
  
  /**
   * Handles content validation and error management
   * @param {*} e
  */
 function handleChanges(e) {
   setValue(e.target.name, e.target.value);
   log.trace("handleChanges: " + e.target.name + " : " + e.target.value);
 
   /*
    switch (e.target.name) {
        case "firstName":
            setFirstName(getValues(e.target.name));
            break;
        case "lastName":
            setLastName(getValues(e.target.name));
            break;
        case "pseudo":
            setPseudo(getValues(e.target.name));
            break;
        default:
            break;
    }
*/
  }

  //console.log(errors.pseudo);

  function onSubmit(data) {    
    alert(t("Form.ReadOnly"));
  }

  function titleize(attr) {
    let fieldName = '';
    if (attr.length > 0) {
      fieldName = attr.replace(/_/g, " ").toString();
      fieldName = fieldName[0].toUpperCase()
                  + (fieldName.length > 1 ? fieldName.substring(1, fieldName.length) : '');
    } else {
      fieldName = '';
    }

    return fieldName;
  }

  function isJson(item) {
    let value = typeof item !== "string" ? JSON.stringify(item) : item;    
    try {
      value = JSON.parse(value);
    } catch (e) {
      return false;
    }
      
    return typeof value === "object" && value !== null;
  }

  return (
    <>
      {fields ?
        <Container>
          {/*<h2>{props.title}</h2>*/}
          <Container className="">
            <Form onSubmit={handleSubmit(onSubmit)}>
              {
                Object.keys(fields).map((attr) => {
                  return (
                    <Form.Group key={attr} className="mt-3" controlId={attr}>
                      <Form.Label className="fs-bold">{titleize(attr)}:</Form.Label>
                      <Form.Control value={fields[attr] ?? ""} type="text" {...register(attr)} onChange={handleChanges} />
                    </Form.Group>
                  )
                })
              }
              <div className="d-flex">
                <Container className="mt-3 ml-auto">
                  <Button className="" variant="primary" type="submit">{t('Form.Cancel')}</Button>
                  <Button className="ms-2 " variant="primary" type="submit">{t('Form.Submit')}</Button>
                </Container>
              </div>
            </Form>
          </Container>
        </Container>
      :
        <></>
      }
    </>
  )
}
