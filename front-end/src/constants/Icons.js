import * as Md from "react-icons/md";
import { GiOrganigram } from "react-icons/gi"
import { IoNewspaperOutline } from "react-icons/io5"
import { TbRobot } from "react-icons/tb";
import { BsTruck } from "react-icons/bs";
import { FcManager } from "react-icons/fc";
import { GrUserWorker } from "react-icons/gr";
import { TbTargetArrow } from "react-icons/tb";
import { GiMoneyStack } from "react-icons/gi";
import { FcSalesPerformance } from "react-icons/fc";
import { HiMiniMagnifyingGlass } from "react-icons/hi2";
import { FaComputer, FaIndustry } from "react-icons/fa6";
import { LiaIndustrySolid } from "react-icons/lia";
import { GoLaw } from "react-icons/go";

//import * as Icon from "react-icons/fc";

export const attr = {className: "d-inline align-text-middle", size: 20};

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

    microphone:         <Md.MdMic {...attr}/>,
    file:               <Md.MdFileUpload {...attr}/>,
    textarea:           <Md.MdTextSnippet {...attr}/>,

    stats:              <Md.MdBarChart {...attr}/>,

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
    appPreferences:     <Md.MdDesignServices {...attr}  />,
    userPreferences:    <Md.MdDesignServices {...attr}  />,
    contents:           <Md.MdOutlineArticle {...attr}  />,
    credits:            <Md.MdEuroSymbol {...attr}  />,
    dashboard:          <Md.MdDashboard {...attr}  />,
    editor:             <Md.MdOutlineModeEdit {...attr}  />,
    portrait:           <Md.MdOutlineCropPortrait {...attr}  />,
    home:               <Md.MdOutlineHome {...attr}  />,
    infos:              <Md.MdOutlinePermDataSetting {...attr} />,
    "brand-voice":      <Md.MdKeyboardVoice {...attr} />,
    "editorial-line":   <IoNewspaperOutline {...attr} />,
    params:             <Md.MdOutlineDesignServices {...attr}  />,
    "add-content":      <Md.MdOutlineModeEdit {...attr}  />,
    "editorial-calendar": <Md.MdOutlineCalendarMonth {...attr} />,
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
    "config-veeplet":   <Md.MdOutlineDisplaySettings {...attr} />,
    workspace:          <GiOrganigram {...attr} />,
//    exit:               <Icon.MdLogout {...attr} />,

    // Organization
    assistant:          <TbRobot {...attr} />,
    digitalTwin:        <Md.MdOutlineChildCare {...attr} />,

    "function-support":     <Md.MdOutlineSupportAgent {...attr} />,
    "function-production":  <LiaIndustrySolid {...attr} />,
    "function-sales":       <FcSalesPerformance {...attr} />,
       
    "dpt-communication":    <Md.MdKeyboardVoice {...attr} />,
    "dpt-finance":          <GiMoneyStack {...attr} />,
    "dpt-HR":               <Md.MdPeopleOutline {...attr} />,
    "dpt-IT":               <FaComputer {...attr} />,
    "dpt-legal":            <GoLaw {...attr} />,
    "dpt-logistics":        <BsTruck {...attr} />,
    "dpt-management":       <FcManager {...attr} />,
    "dpt-marketing":        <TbTargetArrow {...attr} />,
    "dpt-procurement":      <Md.MdOutlineProductionQuantityLimits {...attr} />,
    "dpt-production":       <GrUserWorker {...attr} />,
    "dpt-quality":          <HiMiniMagnifyingGlass {...attr} />,
    "dpt-RandD":            <Md.MdOutlineScience {...attr} />,
    "dpt-sales":            <FcSalesPerformance {...attr} />,

}
