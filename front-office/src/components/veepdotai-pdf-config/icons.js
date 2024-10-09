import { MdOutlineAdd } from "react-icons/md";
import { MdOutlineRestoreFromTrash } from "react-icons/md";
import { MdOutlineRefresh } from "react-icons/md";
import { MdSettingsBackupRestore } from "react-icons/md";


let size = 25

const icones = {
    add : (<MdOutlineAdd size={size}/>),
    trash : (<MdOutlineRestoreFromTrash size={size}/>),
    refresh : (<MdOutlineRefresh size={size}/>),
    reset : (<MdSettingsBackupRestore size={size}/>)
}

export default icones