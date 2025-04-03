
export default function initAppJSLogs(level = "NONE") {

    /* General */
    localStorage.setItem('App', level);
    localStorage.setItem('initVeepdotaiApp', level);
    localStorage.setItem('VeepToast', level);
    localStorage.setItem('PromptDialog', level);

    /** Contexts */
    localStorage.setItem('VeepProvider', level);
    localStorage.setItem('AppPreferencesProvider', level);
    localStorage.setItem('ProfileProvider', level);
    localStorage.setItem('UserPreferencesProvider', level);
    localStorage.setItem('VeepletProvider', level);
    localStorage.setItem('SharedCatalogProvider', level);
    localStorage.setItem('PersonalCatalogProvider', level);

    /** Hooks */
    localStorage.setItem('useVeeplet', level);
    localStorage.setItem('useCatalog', level);

    /** Domain */
    localStorage.setItem('Veeplet', level);

    /** Layout */
    localStorage.setItem('Index', level);
    localStorage.setItem('MenuHorizontal', level);
    localStorage.setItem('MenuVertical', level);
    localStorage.setItem('MenuOptions', level);
    localStorage.setItem('Main', level);
    localStorage.setItem('Footer', level);

    /** Functions */
    localStorage.setItem('Cover', level);
    localStorage.setItem('Dashboard', level);
    localStorage.setItem('MyContent', level);
    localStorage.setItem('MyContentDetails', level);
    localStorage.setItem('MyContentDetailsUtils', level);
    localStorage.setItem('MyContentDetailsForDesktop', level);
    localStorage.setItem('MyContentDetailsForMobile', level);
    localStorage.setItem('Content', level);
    localStorage.setItem('ContentCard', level);
    
    localStorage.setItem('MainContent', level);
    localStorage.setItem('MergedContent', level);

    localStorage.setItem('Editor', level);
    localStorage.setItem('PlateEditor', level);
    localStorage.setItem('ReportData', level);
    localStorage.setItem('Credits', level);
    localStorage.setItem('Profile', level);
    localStorage.setItem('Parameters', level);
    
    /** Components */
    localStorage.setItem('Monitoring', level);
    localStorage.setItem('AllCards', level);
      localStorage.setItem('Prompt', level);
      localStorage.setItem('PromptActions', level);
      localStorage.setItem('PromptDetails', level);
    localStorage.setItem('EditorialCalendar', level);
    localStorage.setItem('Calendar', level);
      localStorage.setItem('CalendarView', level);
      localStorage.setItem('CalendarSheet', level);
    localStorage.setItem('PDF', level);
      localStorage.setItem('PDFExportForm', level);
      localStorage.setItem('PDFViewer', level);
      localStorage.setItem('PDFDocument', level);
      localStorage.setItem('PDFParams', level);
      localStorage.setItem('PDFPanel', level);
    localStorage.setItem('GenericForm', level);
    localStorage.setItem('DynamicForm', level);
    localStorage.setItem('Heading', level);
    localStorage.setItem('Home', level);
    localStorage.setItem('Menu', level);
    localStorage.setItem('MenuItem', level);
      localStorage.setItem('OffCanvasMenu', level);
    localStorage.setItem('Icon', level);
    localStorage.setItem('IconProfile', level);
    localStorage.setItem('Logs', level);
      localStorage.setItem('DisplayLogs', level);
    localStorage.setItem('LinkedIn', level);
    localStorage.setItem('LinkedInOps', level);
    localStorage.setItem('LinkedInStatus', level);
    localStorage.setItem('NavItem', level);
    localStorage.setItem('NavItemLinkIconText', level);
    localStorage.setItem('Process', level);
    localStorage.setItem('Result', level);
    localStorage.setItem('Tour', level);
    localStorage.setItem('ThirdPartiesDataProvider', level);
    localStorage.setItem('UtilsGraphQL', level);
    localStorage.setItem('UtilsGraphQLObject', level);
    localStorage.setItem('UtilsGraphQLPost', level);
    localStorage.setItem('UtilsGraphQLClauseBuilder', level);
    localStorage.setItem('UtilsGraphQLVcontent', level);
    localStorage.setItem('UtilsGraphQLMonitoring', level);
    localStorage.setItem('UtilsGraphQLEditorialLine', level);
    localStorage.setItem('UtilsDataConverter', level);
    localStorage.setItem('WaitForIt', 'OFF');
    
    /** Pickers */
    localStorage.setItem('PromptForm', level);
    localStorage.setItem('EmojisPicker', level);
    localStorage.setItem('NativeColorPicker', level);
    localStorage.setItem('ReactIconsPicker', level);

    /** Form */
    localStorage.setItem('Sources', level);
    localStorage.setItem('Form', level);
    localStorage.setItem('ToggleForm', level);
    localStorage.setItem('Upload', level);
    localStorage.setItem('UploadSelector', level);
    localStorage.setItem('TextForm', level);
    localStorage.setItem('UploadForm', level);
    localStorage.setItem('UploadRDU', level);
    localStorage.setItem('UploadRFU', level);
    localStorage.setItem('UrlForm', level);
    localStorage.setItem('VocalForm', level);
    localStorage.setItem('UploadLib', level);
    localStorage.setItem('EditorialLineForm', level);
    localStorage.setItem('BrandVoiceForm', level);

    localStorage.setItem('ContentActions', level);

    localStorage.setItem('VeepletModel', level);

    localStorage.setItem('getColumns', level);
    localStorage.setItem('UtilsForm', level);
    localStorage.setItem('UtilsFormCommon', level);

}
