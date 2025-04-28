import { Logger } from 'react-logger-lib';

/**
 * Builds PDF content from provided params/metadata and text content
 * 
 * @param {*} content content as simple markdown or structured content as an array of lines of content
 * @param {*} params document metadata (title, subtitle...)
 * @returns 
 */
export default function PDFTest({doc, content, params}) {
  const log = Logger.of(PDFTest.name)

  log.trace("PDFTest: params: ", params)

  return (
    <>
      {
        (content && params) ?
          <>
            {doc}
            {content}
            {JSON.stringify(params)}
          </>
        :
          <>
            Loading...
          </>
      }
    </>
  );
}
