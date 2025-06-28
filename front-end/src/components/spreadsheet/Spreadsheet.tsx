'use client'

import { useState } from "react";
import { Logger } from "react-logger-lib";
import PubSub from "pubsub-js"

import { ReactGrid, Column, Row, Cell, NumberCell, TextCell } from "@silevis/reactgrid";
import { NonEditableCell } from "@silevis/reactgrid";

import handleRowReorder from "./utils-reactgrid";

import { t } from "src/components/lib/utils"

import { Button } from "src/components/ui/shadcn/button";
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { start } from "repl";
import meta from "@/stories/Button.stories";
import { position } from "html2canvas/dist/types/css/property-descriptors/position";

export default function Spreadsheet() {
  const log = Logger.of(Spreadsheet.name)

  interface FieldConfiguration {
    id: string,
    name: string
    group: string
    type: string
    constraints: string
    options: string
    className: string
    label?: string
    comment?: string
    position: number
  }
    
  const FormSpreadsheet = () => {

    const columnLabels = ['id', 'name', 'group', 'type', 'constraints', 'options', 'className', 'label', 'comment', 'position']

    function initData(start = 0, end = 50) {
      let formConfiguration: FieldConfiguration[] = []
      for(var i = start; i <= end; i++) {
        formConfiguration.push(
          { id: `${i}`, name: "", group: "", type: "", constraints: "", options: "", className: "", label: "", comment: "", position: i },
        )
      }

      return formConfiguration
    }

    let formConfiguration = initData()  // Create an empty array

    const [data, setData] = useState(formConfiguration)

    const isMacOs = () => window.navigator.appVersion.indexOf("Mac") !== -1

    const [cellChangesIndex, setCellChangesIndex] = useState(() => -1);
    const [cellChanges, setCellChanges] = useState<any[][]>(() => []);

    const applyNewValue = (
      //changes: CellChange<TextCell>[],
      changes: any[],
      prev: any[],
      usePrevValue: boolean = false
    ): any[] => {
      log.trace("changes: ", changes)
      log.trace("cellChanges: ", cellChanges)
      changes.forEach((change) => {
        const index = change.rowId;
        const fieldName = change.columnId;
        const cell = usePrevValue ? change.previousCell : change.newCell;
        log.trace("prev: ", prev)
        log.trace("change: ", change)
        log.trace("index: ", index)
        log.trace("fieldName: ", fieldName)
        //prev[index] ? prev[index][fieldName] = cell.text : log.trace("prev[index] == null");
        prev[index][fieldName] = cell.text;
      });
      return [...prev];
    };
    
    const applyChanges = (
//      changes: CellChange<TextCell>[],
      changes: any[],
      prev: any[]
    ): any[] => {
      const updated = applyNewValue(changes, prev);
      //const updated = [];
      setCellChanges([...cellChanges.slice(0, cellChangesIndex + 1), changes]);
      setCellChangesIndex(cellChangesIndex + 1);
      return updated;
    };
    
    const undoChanges = (
      //changes: CellChange<TextCell>[],
      changes: any[],
      prev: any[]
    ): any[] => {
      const updated = applyNewValue(changes, prev, true);
      setCellChangesIndex(cellChangesIndex - 1);
      return updated;
    };
    
    const redoChanges = (
      //changes: CellChange<TextCell>[],
      changes: any[],
      prev: any[]
    ): any[] => {
      const updated = applyNewValue(changes, prev);
      setCellChangesIndex(cellChangesIndex + 1);
      return updated;
    };

    const handleChanges = (changes: any[]/*CellChange<TextCell>[]*/) => {
      log.trace("storeChanges: changes: ", changes)
      applyChanges(changes, data);
    };
   
    const handleUndoChanges = () => {
      log.trace("undoChanges: cellChanges: ", cellChanges, cellChangesIndex)
      if (cellChangesIndex >= 0) {
        setData((prev) =>
          undoChanges(cellChanges[cellChangesIndex], prev)
        );
      }
    };
   
    const handleRedoChanges = () => {
      log.trace("redoChanges: cellChanges: ", cellChanges, cellChangesIndex)
      if (cellChangesIndex + 1 <= cellChanges.length - 1) {
        setData((prev) =>
          redoChanges(cellChanges[cellChangesIndex + 1], prev)
        );
      }
    };

    const handleSave = () => {
      let rows = data?.filter((row) => row.name !== "")
      rows = rows.map((row, i) => { return {...row, id: i, position: i}})
      log.trace("saving data: ", rows)
      log.trace("saving data in json: ", JSON.stringify(rows, null, 2))
      alert("Data saved: " + JSON.stringify(rows, null, 2))
    };

    const handleLoad = () => {
      log.trace("handleLoad: loading data")

      function loadForm() {
        let cn4Label = "align-top w-[150px] mt-4 mb-3 font-semibold"
        let cn4Textarea = "mb-2 border-1"

        return (
            <div className="">
                <fieldset>
                    <Label className={cn4Label} htmlFor='importFormJson' id='jsonLabel'>{t("JsonToImport")}</Label>
                    <Textarea className={cn4Textarea} id="importFormJson" name="json" placeholder={t("PasteJson")} />
                </fieldset>
            </div>
        )
      }

      function importData() {
        log.trace("handleLoad: importData")

        const getValueById = (fieldName) => document.getElementById(fieldName).value 

        try {
          let metadata = JSON.parse(getValueById("importFormJson"))
          log.trace("handleLoad: importData: metadata: ", metadata)
          alert('handleLoad: importData: metadata: ' + JSON.stringify(metadata, null, 2))

          let extendedMetadata = initData(metadata?.length)
          log.trace("handleLoad: importData: extendedMetadata: ", extendedMetadata)

          let newMetadata = metadata?.concat(extendedMetadata) 
          log.trace("handleLoad: importData: newMetadata: ", newMetadata)

          setData(newMetadata)
        } catch(e) {
          log.trace("importForm: pb while updating: e: ", e)
          alert("importForm: pb while updating: e: " + e)
        }

      }

      function displayLoadDialog() {
          log.trace("displayLoadDialog")
          //e.preventDefault()
          PubSub.publish("PROMPT_DIALOG", {
              title: t("FormLoadDialog"),
              description: t("FormLoadDialogDesc"),
              content: loadForm(),
              actions: [{
                  label: t("Cancel")
              }, {
                  label: t("OK"),
                  click: () => importData()
              }]
          })
      }

      displayLoadDialog()
    };

    const [columns, setColumns] = useState<Column[]>(columnLabels.map((row, i) => { return {colIndex: i, width: row.width ?? 100, resizable: row.resizable ?? true} }))

    /**
     * Converts a structured columns array with named keys to a destructured array with rowIndex, colIndex and value
     */
    const headerRow: Cell[] = columnLabels.map((colName, i) => {
      return { rowIndex: 0, colIndex: i, Template: NonEditableCell, props: {value: colName} }
    })


    /**
     * Agregates header row and data to produce Cell[]
     *@param headerRow the header row computed from columns array 
     *@param data 
     * returns 
     */
    function getCells(headerRow, data): (Cell|FieldConfiguration)[] {
      let res = [
        ...headerRow,
        ...convert2Cells(data)
      ]

      return res
    }

    /**
     * 
     */
    function updateData(reorderedData) {
      //log.trace("reorderedData:", reorderedData)
      setData(reorderedData)
    }

    /**
     * [
     *   { id: 1, name: "firstname", type: "text" },
     *   { id: 2, name: "lastname", type: "text" }
     *   ...
     * ]
     * Converts input data above to:
     * [
     *   { rowIndex: 1, colIndex: 0, Template: TextCell, props: { text: "1" } }
     *   { rowIndex: 1, colIndex: 1, Template: TextCell, props: { text: "firstname" } }
     *   { rowIndex: 1, colIndex: 2, Template: TextCell, props: { text: "text" } }
     *   { rowIndex: 2, colIndex: 0, Template: TextCell, props: { text: "2" } }
     *   ...
     * ]
     * There is also a columnLabels array that is extracted from the input data.
     * 
     * Row index starts at 1 (so the i+1) because rowIndex == 0 is the header row, computed
     * separately from the columns array
     * 
     * @param data Converts data to rawData
     * @returns 
     */
    function convert2Cells(mydata) {

      /**
       * data doesn't contain the header
       */
      function updateCol(id: number, key: number | string, newText: string) {
        log.trace("previous: ", data[id][key])
        handleChanges([{rowId: id, columnId: key, previousCell: {text: data[id][key]}, newCell: {text: newText}}])
        /*
        setData((prev) => {
          let res = prev.map((p) => {
              let prevText = p[key]
              if (p.id == id) {
                log.trace("p: ", p)
                let changes = [{...p, rowId: p.id, columnId: key, previousCell: {text: prevText}, newCell: {text: newText}}] 
                log.trace("changes: ", changes)
                storeChanges(changes)
                return { ...p, [key]: newText }
              } else {
                  return p
              }
          })
          log.trace("updateCol: res: ", res)
          return res
        })
          */
      }

      function getCell(i: number, j: number, row, colName) {
        let res = {}
        if (false) {
          // DropdownCell
        } else {
          //TextCell
          res = {
            rowIndex: i,
            colIndex: j,
            Template: TextCell,
            props: {
              text: row[colName],
              onTextChanged: (newText) => { updateCol(row.id, colName, newText) }
            }
          }  
        }
  
        return res
      }
  
      return mydata.flatMap((row, i) => {
        return columnLabels.map((colName, j) => getCell(i+1, j, row, colName))
      })
    }

    const handleResizeColumn = ( newWidth: number, columnIndexes: number[], setColumns: Dispatch<SetStateAction<Column[]>> ) => {
      setColumns((prevColumns) => { // If resizing spans multiple columns (e.g., header cells with colSpan > 1), divide the new width by the number of columns
        const newWidthPerColumn = columnIndexes.length > 1 ? newWidth / columnIndexes.length : newWidth;
        return prevColumns.map((column, idx) => {
          if (columnIndexes.includes(idx)) {
            return { ...column, width: newWidthPerColumn }
          }
          return column;
        });
      });
    };

    return (
      <div
      onKeyDown={(e) => {
        if ((!isMacOs() && e.ctrlKey) || e.metaKey) {
          switch (e.key) {
            case "z":
              handleUndoChanges();
              return;
            case "y":
              handleRedoChanges();
              return;
          }
        }
      }}>

        <div className="inline-flex items-center gap-2">
          {/*
            <Button onClick={handleUndoChanges}>Undo</Button>
            <Button onClick={handleRedoChanges}>Redo</Button>
          */}
            <Button onClick={handleSave}>{t("Save")}</Button>
            <Button onClick={handleLoad}>{t("Load")}</Button>
        </div>

        <div className="inline-flex items-center">
          <ReactGrid
            columns={columns}
            //styledRanges={styledRanges}
            enableRowSelectionOnFirstColumn
            onRowReorder={(selectedRowIndexes, destinationRowIdx) => handleRowReorder(data, selectedRowIndexes, destinationRowIdx, updateData)}
            onResizeColumn={(width, columnIdx) => handleResizeColumn(width, columnIdx, setColumns)}
            /*onCellsChanged={handleChanges}*/
            cells={getCells(headerRow, data)}
            //stickyLeftColumns={1}
          />                    
        </div>

      </div>
    )
  }

  return (
    <FormSpreadsheet />
  )
}
