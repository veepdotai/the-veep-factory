
import { Form, FloatingLabel } from 'react-bootstrap'
import { Logger } from 'react-logger-lib'
import { t } from 'i18next'

import IconPicker from 'react-icons-picker'
import { UtilsFormCommon } from './utils-form-common'

export const UtilsForm = {
  log: Logger.of("UtilsForm"),

  groupLabelStyle: {
    //className: "m-2 mt-3"
  },

  labelStyle: {
      //xs: 12,
    //md: 3,
    //className: "fw-semibold text-capitalize"
  },

  getValueRHF: function(form, name, varName, params, veepletObject, handleChange, storeFieldData = null, iconNames = null, setIconNames = null, setDisabledSaveButton = null) {
    let log = (msg) => UtilsForm.log.trace("getValueRHF: " + msg)
    let fieldType = params?.field ?? "input";
    let fieldValues = null
    if (fieldType.match(/select:/)) {
      fieldValues = fieldType.replace(/select:/, "")
      fieldType = "combobox"
    } else if (fieldType.match(/.*\|.*/)) {
      fieldValues = fieldType
      fieldType = "combobox"
    }
    
    //log(`form: ${JSON.stringify(form)}`);
    log(`varName: ${varName} / type: ${fieldType}`);

    //return "val: " + varName + field
    return UtilsFormCommon.getFormField(form, varName, fieldType, fieldValues)
  },

  /**
   * 
   * @param {*} name 
   * @param {*} varName 
   * @param {*} params 
   * @param {*} veepletObject 
   * @param {*} handleChange 
   * @param {*} storeFieldData for color input field only
   * @param {*} iconNames for icon picker field only
   * @param {*} setIconNames for icon picker field only
   * @param {*} setDisabledSaveButton for icon picker field only
   * @returns 
   */
  getValue: function(name, varName, params, veepletObject, handleChange, storeFieldData = null, iconNames = null, setIconNames = null, setDisabledSaveButton = null) {
    let log = (msg) => UtilsForm.log.trace("getValue: " + msg)
    let field = params?.field ?? "input";
    log(`varName: ${varName} / typeof ${typeof field}`);
    
    let data = veepletObject;
    log("veepletObject: " + JSON.stringify(data));
    log("varName: " + varName);
    let attrs = varName.match(/[a-zA-Z_0-9]+/g)
    log("attrs: " + JSON.stringify(attrs));

    for(let i = 0; i < attrs.length; i++) {
      log("attr: " + attrs[i]);
      try {
        data = data[attrs[i]];
      } catch(e) {
        data = "";
      }
    }
    log("varName / data: " + varName + "/" + JSON.stringify(data));

    //let id = varName.toLowerCase();
    let id = varName;
    let label = name;
    let help = `${varName}.help`;
    let result = null;

    let style = {};
    if (field == "textarea") {
      //style = {"height": params?.style?.height ?? "200px", ...params.style};
      //style = {height: "300px"};
      style = {height: params?.style?.height ?? "100px"};
      result = 
          <Form.Control style={style} as="textarea" defaultValue={data}
            onChange={handleChange} aria-describedby={id + "Block"} />
    } else if (field == "color") {
      // input type=color

      let inputStyle = {
        width: "200px"
      }

      let value = data || (params.defaultValue ?? "white");

      style = { marginTop: "-4px"};
      result = 
        <>
          <Form.Control style={inputStyle} type="color" defaultValue={value}
            onChange={(e) => {
              handleChange();
              storeFieldData(e.target.value, varName)}
            }
          />
        </>
    } else if (field == "icon") {
      // input element to store value and IconPicker to select icon

      style = {
        padding: "20px 20px 0px 20px",
        border: "1px solid lightgrey",
        borderRadius: "7px",
        width: "100px"
      }

      let localPickButtonStyle = {
        border: "0",
        cursor: "pointer",
        padding: "10px 0px 10px 10px"
      }

      let type = params.type;
      result = 
        <>
          <Form.Control
            defaultValue={iconNames[type]}
            type="hidden"
            onChange={handleChange}
          />
          <IconPicker
            pickButtonStyle={{...localPickButtonStyle}}
            value={iconNames[type]}
            onChange={(iconName) => {
                setIconNames({
                  "header": type == "header" ? iconName : iconNames["header"],
                  "body": type == "body" ? iconName : iconNames["body"]
                })
                setDisabledSaveButton(false);
              }
            }
          />
        </>

    } else if (field.match(/^select:/)) {
      // select element
      let values = field.replace(/select:/, "").split('|');
      let options = values.map((row) => 
        data == row ? <option selected>{row}</option> : <option>{row}</option>
      )
      result =
        <Form.Select aria-label="Floating label select example"
          onChange={handleChange}>
          <option>{t("Select")}</option>
          {options}
        </Form.Select>
    } else {
      // input element
      result = 
          <Form.Control
            type="text" defaultValue={data}
            onBlur={(e) => handleChange(e)} aria-describedby={id + "Block"} />
    }

    result =
      <FloatingLabel style={{...style}} controlId={id} label={label} className='mb-3'>
          {result}
      </FloatingLabel>

    return result;
  }
}

