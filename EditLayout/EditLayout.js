import React,{ useContext, useEffect } from "react";
import GlobalContext from "../../react-core/GlobalContext";

const EditLayout = ({children}) => {
    const [, setIsEditMode]  = useContext(GlobalContext);

    useEffect(()=>{
        setIsEditMode(true);
    }, [setIsEditMode])

    return (
        <div>
            {children}
            <div id="htmlqueues" />
        </div>
    )
}

export default EditLayout;