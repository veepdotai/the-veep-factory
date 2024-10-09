import { Logger } from 'react-logger-lib';


export default function Chat() {
  const log = Logger.of(Chat.name);

  return (
    <>
    <iframe src="https://chat.veep.ai" style={{width:'100%',height:'100%'}} allowFullScreen={true} />
    {/*
    <iframe src="https://chat.veep.ai" 
    width="100%"
    height="100%"
    id="my-chat"
    className=""
    display="block"
    position="relative"/>
    */}
    </>
)
}