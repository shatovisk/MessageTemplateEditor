import React, { useEffect, useRef, useState } from "react";
import TextareaAutosize from '@mui/base/TextareaAutosize'; // используется для автосайза полей

interface TextBlock {
    id: number;
    text: string;
}

interface CreateTextBlock {
    template: (TextBlock)[];
    id: number;
    element: JSX.Element | null;
    setCursorPosition: (position: number) => void;
    setTemplateAndGetCursor: (message: string, id: string) => void;
    getCursorPosition: (idOfTextField?: string, value?: string) => (string | number | null | undefined)[];
    textField: (MyTextField)[];
}

interface MyTextField {
    id: number;
    block: JSX.Element | null;
}


export function Textblock ({template, id, element, setCursorPosition, setTemplateAndGetCursor, getCursorPosition, textField} : CreateTextBlock) {

    // данные переменные необходимы для создания отступа для textarea от левого края страницы 
    let helperForFixId = textField.length == 0 ? 1 : textField.length

    let style = `ml-${5 * Math.ceil(helperForFixId/4) <= 10 ? 5 * Math.ceil(helperForFixId/4) : 10} flex items-baseline mt-2 mb-5`

    let style2 = `ml-${5 * Math.ceil(helperForFixId/4) <= 10 ? 5 * Math.ceil(helperForFixId/4) : 10} flex items-baseline mt-2 mb-5 bg-yellow-100 rounded-md me-20`
    

    return (
        <>


            {id !== 0 ? 
            <div className="bg-slate-100 mx-10 rounded">
                { element?.props.children[1]?.props.id.split(".")[0] != id ?
                <div className={style}>
                {element}
                <TextareaAutosize
                        id={String(id)}
                        className="border ps-1 mt-2 mb-5 w-4/5 rounded-md ms-20"
                        placeholder='Enter any word...'
                        value={template.find(obj => obj.id === id)?.text}
                        onClick={event => setCursorPosition(Number(getCursorPosition(event.currentTarget.id)[0]!))}
                        onChange={event => setTemplateAndGetCursor(event.target.value, event.target.id)}
                        minRows={2}       
                /> </div>: 
                <div  className={style2}>
                    {element}
                <TextareaAutosize
                        id={String(id)}
                        className="border ps-1 mt-2 mb-5 w-4/5 mx-10 bg-yellow-100 rounded-md"
                        placeholder='Enter any word...'
                        value={template.find(obj => obj.id === id)?.text}
                        onClick={event => setCursorPosition(Number(getCursorPosition(event.currentTarget.id)[0]!))}
                        onChange={event => setTemplateAndGetCursor(event.target.value, event.target.id)}   
                        minRows={2}     
                /></div>}
            </div> :
            <TextareaAutosize
            id={String(id)}
            className="border ps-1 mt-2 mb-5 w-3/5 rounded-md mx-10 ms-20"
            placeholder='Enter any word...'
            value={template.find(obj => obj.id === id)?.text}
            onClick={event => setCursorPosition(Number(getCursorPosition(event.currentTarget.id)[0]!))}
            onChange={event => setTemplateAndGetCursor(event.target.value, event.target.id)}  
            minRows={2}      
            />
            }
        </>
    );
}