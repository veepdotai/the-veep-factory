import * as Md from "react-icons/md";
import { GiOrganigram } from "react-icons/gi"
import { IoNewspaperOutline } from "react-icons/io5"
import { TbRobot } from "react-icons/tb";
import { BsTruck } from "react-icons/bs";
import { FcManager, FcVoicePresentation, FcBusinesswoman } from "react-icons/fc";
import { GrUserWorker } from "react-icons/gr";
import { TbTargetArrow } from "react-icons/tb";
import { GiMoneyStack } from "react-icons/gi";
import { FcSalesPerformance } from "react-icons/fc";
import { HiMiniMagnifyingGlass } from "react-icons/hi2";
import { FaComputer, FaIndustry } from "react-icons/fa6";
import { LiaIndustrySolid } from "react-icons/lia";
import { GoLaw } from "react-icons/go";
import { FiUser, FiUserPlus, FiUserCheck } from "react-icons/fi";
import { BiWorld } from "react-icons/bi";
import { LuLoader } from "react-icons/lu";

export const attr = {className: "d-inline align-text-middle", size: 20}

export const Icons = {
    chat:               <Md.MdOutlineChatBubbleOutline {...attr} />,
    clipboard:          <Md.MdCopyAll {...attr} />,
    config:             <Md.MdDesignServices {...attr} />,
    copy:               <Md.MdCopyAll {...attr} />,
    delete:             <Md.MdDelete {...attr} />,
    star:               <Md.MdStar {...attr} />,
    save:               <Md.MdOutlineSave {...attr} />,
    volume:             <Md.MdVolumeUp {...attr} />,
    share:              <Md.MdOutlineIosShare {...attr} />,
    terminal:           <Md.MdTerminal {...attr} />,

    menu:               <Md.MdMenu {...attr}/>,
    micro:              <Md.MdMic {...attr}/>,
    microphone:         <Md.MdMic {...attr}/>,
    file:               <Md.MdFileUpload {...attr}/>,
    textarea:           <Md.MdTextSnippet {...attr}/>,
    text:               <Md.MdTextSnippet {...attr}/>,
    url:                <Md.MdLink {...attr}/>,
    stats:              <Md.MdBarChart {...attr}/>,

    spin:                <Md.MdRotateRight {...attr} className="m-0 p-0" size="32"/>,
    loading:            <div {...attr}>
                            <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                        </div>,

    pdf:                <Md.MdOutlinePictureAsPdf {...attr}/>,
    settings:           <Md.MdOutlineSettings {...attr}/>,
    up:                 <Md.MdOutlineThumbUp {...attr}/>,
    down:               <Md.MdOutlineThumbDown {...attr}/>,
    publish:            <Md.MdOutlinePublish {...attr}/>,
    "pub-target":       <Md.MdAltRoute {...attr}/>,
    //generate:           <Md.MdOutlineGeneratingTokens {...attr}/>,
    //generate:           <Md.MdBolt {...attr}/>,
    generate:           <Md.MdAutoFixHigh {...attr}/>,
    schedule:           <Md.MdOutlineSchedule {...attr}/>,
    about:              <Md.MdPermDeviceInformation {...attr} />,
    avatar:             <Md.MdPerson {...attr} />,
    "app-parameters":     <Md.MdDesignServices {...attr}  />,
    "user-parameters":    <Md.MdDesignServices {...attr}  />,
    appPreferences:     <Md.MdDesignServices {...attr}  />,
    userPreferences:    <Md.MdDesignServices {...attr}  />,
    contents:           <Md.MdOutlineArticle {...attr}  />,
    credits:            <Md.MdEuroSymbol {...attr}  />,
    dashboard:          <Md.MdDashboard {...attr}  />,
    editor:             <Md.MdOutlineModeEdit {...attr}  />,
    right:              <Md.MdKeyboardDoubleArrowRight {...attr}  />,
    world: (size) => <BiWorld {...attr} size={size}  />,    
    portrait:           <Md.MdOutlineCropPortrait {...attr}  />,
    home:               <Md.MdOutlineHome {...attr}  />,
    infos:              <Md.MdOutlinePermDataSetting {...attr} />,
    "brand-voice":      <Md.MdKeyboardVoice {...attr} />,
    "editorial-line":   <IoNewspaperOutline {...attr} />,
    params:             <Md.MdOutlineDesignServices {...attr}  />,
    "add-content":      <Md.MdOutlineModeEdit {...attr}  />,
    "editorial-calendar": <Md.MdOutlineCalendarMonth {...attr} />,
    help:               <Md.MdOutlineLiveHelp {...attr}  />,
    support:            <Md.MdOutlineForum {...attr}  />,
    tour:               <Md.MdOutlineLiveHelp {...attr} />,
    exit:               <Md.MdExitToApp {...attr} />,
    refresh:            <Md.MdRefresh {...attr}  />,

    moreVertical:       <Md.MdMoreVert {...attr} />,
    thumbUp:            <Md.MdThumbUp {...attr} />,
    thumbDown:          <Md.MdThumbDown {...attr} />,

    aggregatedView:     <Md.MdOutlineArticle {...attr} />,
    comparedView:       <Md.MdOutlineDifference {...attr} />,
    metadataView:       <Md.MdOutlineSchema {...attr} />,
    transcriptionView:  <Md.MdOutlineTranscribe {...attr} />,
    PDFView:            <Md.MdPictureAsPdf {...attr} />,
    "pdf-export":       <Md.MdPictureAsPdf {...attr} />,
    "config-pdf":       <Md.MdPictureAsPdf {...attr} />,
    "pdf-config":       <Md.MdPictureAsPdf {...attr} />,
    "config-veeplet":   <Md.MdOutlineDisplaySettings {...attr} />,
    workspace:          <GiOrganigram {...attr} />,
//    exit:               <Icon.MdLogout {...attr} />,

    "user-normal":      <FiUser {...attr} />,
    "user-advanced":    <FiUserPlus {...attr} />,
    "user-expert":      <FiUserCheck {...attr} />,


    // Organization
    assistant:          <TbRobot {...attr} />,
    digitalTwin:        <Md.MdOutlineChildCare {...attr} />,

    "function-support":     <Md.MdOutlineSupportAgent {...attr} />,
    "function-production":  <LiaIndustrySolid {...attr} />,
    "function-sales":       <FcSalesPerformance {...attr} />,
       
    "dpt-communication":    <Md.MdKeyboardVoice {...attr} />,
    "dpt-finance":          <GiMoneyStack {...attr} />,
    "dpt-hr":               <Md.MdPeopleOutline {...attr} />,
    "dpt-it":               <FaComputer {...attr} />,
    "dpt-legal":            <GoLaw {...attr} />,
    "dpt-logistics":        <BsTruck {...attr} />,
    "dpt-management":       <FcManager {...attr} />,
    "dpt-marketing":        <TbTargetArrow {...attr} />,
    "dpt-procurement":      <Md.MdOutlineProductionQuantityLimits {...attr} />,
    "dpt-consulting":       <FcVoicePresentation {...attr} />,
    "dpt-production":       <GrUserWorker {...attr} />,
    "dpt-service":          <FcBusinesswoman {...attr} />,
    "dpt-quality":          <HiMiniMagnifyingGlass {...attr} />,
    "dpt-randd":            <Md.MdOutlineScience {...attr} />,
    "dpt-sales":            <FcSalesPerformance {...attr} />,

}
