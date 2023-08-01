import TextareaAutosize from "@mui/material/TextareaAutosize";
import { useEffect, useState } from "react";

interface Block{
    block: JSX.Element
}


export function MainPage() {

    const firstName = "{firstname}"
    const lastName = "{lastname}"
    const company = "{company}"
    const position = "{position}"

    const [arrOfTextBlock, setArrOfTextBlock] = useState<string[]>([])
    const [firstNameValue, setFirstNameValue] = useState(JSON.parse(localStorage.getItem("arrVarNames")!).find((obj : any) => obj.name == firstName).value)
    const [lastNameValue, setLastNameValue] = useState(JSON.parse(localStorage.getItem("arrVarNames")!).find((obj : any) => obj.name == lastName).value)
    const [positionValue, setPositionValue] = useState(JSON.parse(localStorage.getItem("arrVarNames")!).find((obj : any) => obj.name == position).value)
    const [companyValue, setCompanyValue] = useState(JSON.parse(localStorage.getItem("arrVarNames")!).find((obj : any) => obj.name == company).value)
    const [messageTemplateJSX, setMessageTemplateJSX] = useState<Block>()


    const template = JSON.parse(localStorage.getItem("templateObject") || "")


    // изменяем блок с выводом получившегося письма
    useEffect(() => {
        setMessageTemplateJSX({block: updateTemplate()})
    }, [firstNameValue, lastNameValue, positionValue, companyValue])


    // обновляет окно превью
    function updateTemplate(){
        arrOfTextBlock.splice(0, arrOfTextBlock.length)
        setArrOfTextBlock(arrOfTextBlock)
        console.log('firstNameValue, arrOfTextBlock :>> ', firstNameValue, arrOfTextBlock);



        let metaArr = []

        arrOfTextBlock.unshift(template[0].text)

        for (let i = 1; i <= (template.length - 1)/4; i++){
            metaArr.push(template[template.findIndex((obj: any) => obj.id == 4 * i)].text)
        }


        for (let i = 1; i <= (template.length - 1)/4; i++){
            // проверка на то, что было указано при конструировании шаблона {firstname}, {lastName}, {position} или {company} и указано ли значение соотвествующей переменной в окне Preview
            if (template[template.findIndex((obj: any) => obj.id == 4 * i - 3)].text == firstName) {
                if (firstNameValue){                    
                    arrOfTextBlock.push(template[template.findIndex((obj: any) => obj.id == 4 * i - 2)].text.replace(firstName, firstNameValue))
                    console.log('firstNameValue, arrOfTextBlock :>> ', firstNameValue, arrOfTextBlock);
                    setArrOfTextBlock(arrOfTextBlock)
                    if (template.findIndex((obj: any) => obj.id == 4 * i - 1) + 1 == template.findIndex((obj: any) => obj.id == 4 * i + 1)){
                        i++
                    }
                } else {
                    arrOfTextBlock.push(template[template.findIndex((obj: any) => obj.id == 4 * i - 1)].text)
                    if (template.findIndex((obj: any) => obj.id == 4 * i - 2) + 1 == template.findIndex((obj: any) => obj.id == 4 * i + 1)){
                        i++
                    }
                }
            } else if (template[template.findIndex((obj: any) => obj.id == 4 * i - 3)].text == lastName){
                if (lastNameValue){
                    arrOfTextBlock.push(template[template.findIndex((obj: any) => obj.id == 4 * i - 2)].text.replace(lastName, lastNameValue))
                    if (template.findIndex((obj: any) => obj.id == 4 * i - 1) + 1 == template.findIndex((obj: any) => obj.id == 4 * i + 1)){
                        i++
                    }
                } else {
                    arrOfTextBlock.push(template[template.findIndex((obj: any) => obj.id == 4 * i - 1)].text)
                    if (template.findIndex((obj: any) => obj.id == 4 * i - 2) + 1 == template.findIndex((obj: any) => obj.id == 4 * i + 1)){
                        i++
                    }
                }
            }else if (template[template.findIndex((obj: any) => obj.id == 4 * i - 3)].text == position){
                if (positionValue){
                    arrOfTextBlock.push(template[template.findIndex((obj: any) => obj.id == 4 * i - 2)].text.replace(position, positionValue))
                    if (template.findIndex((obj: any) => obj.id == 4 * i - 1) + 1 == template.findIndex((obj: any) => obj.id == 4 * i + 1)){
                        i++
                    }
                } else {
                    arrOfTextBlock.push(template[template.findIndex((obj: any) => obj.id == 4 * i - 1)].text)
                    if (template.findIndex((obj: any) => obj.id == 4 * i - 2) + 1 == template.findIndex((obj: any) => obj.id == 4 * i + 1)){
                        i++
                    }
                }
            } else if(template[template.findIndex((obj: any) => obj.id == 4 * i - 3)].text == company){
                if (companyValue){
                    arrOfTextBlock.push(template[template.findIndex((obj: any) => obj.id == 4 * i - 2)].text.replace(company, companyValue))
                    if (template.findIndex((obj: any) => obj.id == 4 * i - 1) + 1 == template.findIndex((obj: any) => obj.id == 4 * i + 1)){
                        i++
                    }
                } else {
                    arrOfTextBlock.push(template[template.findIndex((obj: any) => obj.id == 4 * i - 1)].text)
                    if (template.findIndex((obj: any) => obj.id == 4 * i - 2) + 1 == template.findIndex((obj: any) => obj.id == 4 * i + 1)){
                        i++
                    }
                }
            } else{
                alert(`Был введен неккоректный аргумент в поле 'IF'. Пожалуйста, введите значение формата: '{company}'. Не добавляя никакого дополнительного текста. Введено: ${template[4 * i - 3].text}`)               
            }
            }
        

        for (let i = metaArr.length - 1; i >= 0; i--){
            arrOfTextBlock.push(metaArr[i])
        }

        for (let i = 0; i < arrOfTextBlock.length - 1; i++){
            if (arrOfTextBlock[i].includes(firstName) && firstNameValue){                
                arrOfTextBlock[i] = arrOfTextBlock[i].replace(firstName, firstNameValue)
            }else{
                arrOfTextBlock[i] = arrOfTextBlock[i].replace(firstName, "")
            }

            if (arrOfTextBlock[i].includes(lastName) && lastNameValue){
                arrOfTextBlock[i] = arrOfTextBlock[i].replace(lastName, lastNameValue)
            }else{
                arrOfTextBlock[i] = arrOfTextBlock[i].replace(lastName, "")
            }

            if (arrOfTextBlock[i].includes(company) && companyValue){
                arrOfTextBlock[i] = arrOfTextBlock[i].replace(company, companyValue)
            }else{
                arrOfTextBlock[i] = arrOfTextBlock[i].replace(company, "")
            }

            if (arrOfTextBlock[i].includes(position) && positionValue){
                arrOfTextBlock[i] = arrOfTextBlock[i].replace(position, positionValue)
            }else{
                arrOfTextBlock[i] = arrOfTextBlock[i].replace(position, "")
            }
        }

        
        setArrOfTextBlock(arrOfTextBlock)
 
 

        return (
            <div className='flex justify-center'>
                <TextareaAutosize 
                className='peer block h-40 w-full rounded border bg-neutral-100 px-3 py-[0.32rem] leading-[1.6] outline-none transition-all duration-200 ease-linear focus:placeholder:opacity-100 peer-focus:text-primary data-[te-input-state-active]:placeholder:opacity-100 motion-reduce:transition-none dark:bg-neutral-700 dark:text-neutral-200 dark:placeholder:text-neutral-200 dark:peer-focus:text-primary [&:not([data-te-input-placeholder-active])]:placeholder:opacity-0'
                value={arrOfTextBlock.join("")}
                onChange={updateTemplate} 
                readOnly   
                minRows={5}       
                />
            </div>

        )
    }



    // сохранение шаблона и переменных и перенправление на основную страницу
    function GoToEditor() {
        window.location.href = '/';
    }



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
    


    return (
    <>  
        <h1 className="mx-auto max-w-2xl pt-2 text-center">Message Template</h1>

        {messageTemplateJSX?.block}

        <div className="flex justify-center">
                <input
                id = {firstName}
                type='text'
                className='ml-10 mr-5 mt-2 min-h-[auto] rounded border bg-transparent px-3 py-[0.32rem] leading-[1.6] duration-200 dark:text-neutral-200 dark:placeholder:text-neutral-200'
                value={firstNameValue}
                placeholder='Enter firstname...'
                onChange={e => setValues(e.target.id, e.target.value)}
                />
                <input
                id = {lastName}
                type='text'
                className='mr-5 mt-2 min-h-[auto] rounded border bg-transparent px-3 py-[0.32rem] leading-[1.6] duration-200 dark:text-neutral-200 dark:placeholder:text-neutral-200'
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
                className='mr-5 mt-2 min-h-[auto] rounded border bg-transparent px-3 py-[0.32rem] leading-[1.6] duration-200 dark:text-neutral-200 dark:placeholder:text-neutral-200'
                value={positionValue}
                placeholder='Enter position...'
                onChange={e => setValues(e.target.id, e.target.value)}
                />
            </div>


        <div  className='flex justify-center'>
            <button className='px-4 py-2 mt-5 border bg-slate-800 hover:bg-slate-600 rounded text-white' onClick={GoToEditor}>Go to Editor</button>
        </div>

    </>
    )
    
}