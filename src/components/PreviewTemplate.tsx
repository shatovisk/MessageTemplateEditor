import React, { useEffect, useState } from 'react'
import TextareaAutosize from '@mui/base/TextareaAutosize'; // используется для автосайза полей

interface TextBlock {
    id: number;
    text: string;
}

interface Values {
    name: string;
    value: string;
}

interface TemplateProps{
    template: (TextBlock)[];
    arrValues: (Values)[];
    setArrValues: (arrValues: (Values)[]) => void;
    firstNameValue: string;
    setFirstNameValue: (firstName: string) => void;
    lastNameValue: string;
    setLastNameValue: (lastName: string) => void;
    positionValue: string;
    setPositionValue: (position: string) => void;
    companyValue: string;
    setCompanyValue: (company: string) => void;
    arrOfTextBlock: (string)[]
    updateTemplate: () => (string)[];
}



export function PreviewTemplate({template, arrValues, setArrValues, firstNameValue, setFirstNameValue, lastNameValue, setLastNameValue, positionValue, setPositionValue, companyValue, setCompanyValue, arrOfTextBlock, updateTemplate}: TemplateProps) {

    const firstName = "{firstname}"
    const lastName = "{lastname}"
    const company = "{company}"
    const position = "{position}"

    //записываем значение имя получутеля сообщения в массив, который хранит в себе значения имени, фамилии, названия компании и позиции в компании
    // формат хранение [{name: firstName, value: ""}, {name: lastName, value: ""}, {name: position, value: ""}, {name: company, value: ""}] 
    useEffect(() => {
        arrValues[arrValues.findIndex(obj => obj.name === firstName)].value = firstNameValue

        setArrValues(arrValues)        
    }, [firstNameValue])

    //записываем значение фамилию получутеля сообщения в массив, который хранит в себе значения имени, фамилии, названия компании и позиции в компании
    // формат хранение [{name: firstName, value: ""}, {name: lastName, value: ""}, {name: position, value: ""}, {name: company, value: ""}] 
    useEffect(() => {
        arrValues[arrValues.findIndex(obj => obj.name === lastName)].value = lastNameValue
        setArrValues(arrValues)
    }, [lastNameValue])

    //записываем значение компанию получутеля сообщения в массив, который хранит в себе значения имени, фамилии, названия компании и позиции в компании
    // формат хранение [{name: firstName, value: ""}, {name: lastName, value: ""}, {name: position, value: ""}, {name: company, value: ""}] 
    useEffect(() => {
        arrValues[arrValues.findIndex(obj => obj.name === company)].value = companyValue
        setArrValues(arrValues)
    }, [companyValue])

    //записываем значение позицию в компании получутеля сообщения в массив, который хранит в себе значения имени, фамилии, названия компании и позиции в компании
    // формат хранение [{name: firstName, value: ""}, {name: lastName, value: ""}, {name: position, value: ""}, {name: company, value: ""}] 
    useEffect(() => {
        arrValues[arrValues.findIndex(obj => obj.name === position)].value = positionValue
        setArrValues(arrValues)
    }, [positionValue])


    function setValues(id: string, e: string) {
        if (id === firstName){
            setFirstNameValue(e)
        }

        if (id === lastName){
            setLastNameValue(e)
        }

        if (id === position){
            setPositionValue(e)
        }

        if (id === company){
            setCompanyValue(e)
        }        
    }


    return(
        <>
            <div className='relative mb-3'>
                <TextareaAutosize 
                className='peer block h-40 w-full rounded border bg-neutral-100 px-3 py-[0.32rem] leading-[1.6] outline-none transition-all duration-200 ease-linear focus:placeholder:opacity-100 peer-focus:text-primary data-[te-input-state-active]:placeholder:opacity-100 motion-reduce:transition-none dark:bg-neutral-700 dark:text-neutral-200 dark:placeholder:text-neutral-200 dark:peer-focus:text-primary [&:not([data-te-input-placeholder-active])]:placeholder:opacity-0'
                value={updateTemplate().join(``).replaceAll("  ", " ")}  
                readOnly   
                minRows={5}       
                />
            </div>
            <text className="font-bold mx-2">Variables:</text>
            <div>
                <input
                id = {firstName}
                type='text'
                className='mr-5 mt-2 min-h-[auto] rounded border bg-transparent px-3 py-[0.32rem] leading-[1.6] duration-200 dark:text-neutral-200 dark:placeholder:text-neutral-200'
                value={firstNameValue}
                placeholder='Enter firstname...'
                onChange={e => setValues(e.target.id, e.target.value)}
                />
                <input
                id = {lastName}
                type='text'
                className='min-h-[auto] rounded border bg-transparent px-3 py-[0.32rem] leading-[1.6] duration-200 ease-linear focus:placeholder:opacity-100 peer-focus:text-primary data-[te-input-state-active]:placeholder:opacity-100 motion-reduce:transition-none dark:text-neutral-200 dark:placeholder:text-neutral-200 dark:peer-focus:text-primary '
                value={lastNameValue}
                placeholder='Enter lastname...'
                onChange={e => setValues(e.target.id, e.target.value)}
                />
                <input
                id = {company}
                type='text'
                className='mr-5 mt-2 min-h-[auto] rounded border bg-transparent px-3 py-[0.32rem] leading-[1.6] duration-200 dark:text-neutral-200 dark:placeholder:text-neutral-200'
                value={companyValue}
                placeholder='Enter company...'
                onChange={e => setValues(e.target.id, e.target.value)}
                />
                <input
                id = {position}
                type='text'
                className='min-h-[auto] rounded border bg-transparent px-3 py-[0.32rem] leading-[1.6] duration-200 ease-linear focus:placeholder:opacity-100 peer-focus:text-primary data-[te-input-state-active]:placeholder:opacity-100 motion-reduce:transition-none dark:text-neutral-200 dark:placeholder:text-neutral-200 dark:peer-focus:text-primary '
                value={positionValue}
                placeholder='Enter position...'
                onChange={e => setValues(e.target.id, e.target.value)}
                />
            </div>
        </>
    )
}