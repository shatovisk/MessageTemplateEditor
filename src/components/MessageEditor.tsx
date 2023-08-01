import React, { useContext, useEffect, useState, createElement as e} from 'react'
import { ModalContext } from '../context/ModalContext'
import { ModalPreview } from './ModalPreview'
import { PreviewTemplate } from './PreviewTemplate'
import { Textblock } from './TextBlock'

interface MyTextField {
    id: number;
    block: JSX.Element | null;
}

interface TextBlock {
    id: number;
    text: string;
}

interface Values {
    name: string;
    value: string;
}


export function MessageEditor(){
    const firstName = "{firstname}"
    const lastName = "{lastname}"
    const company = "{company}"
    const position = "{position}"
    const some_variable_or_expression = "[{some_variable} or expression]"

    const [template, setTemplate] = useState<TextBlock[]>([{id: 0, text: ""}]) // хранится наполнение каждой textarea
    const [cursorPosition, setCursorPosition] = useState(0) // для отслеживания позиции курсора
    const [idField, setIdField] = useState("") // для отслеживания id textarea, в которой в данный момент находится курсор
    const [counter, setCounter] = useState([0]) // вспомогательный массив для корректного вывода textarea
    const [arrOfRepeatIndexesOfJSXElement, setArrOfRepeatIndexesOfJSXElement] = useState([0]) // нужен чтобы добавлять JSX элементы в нужное место в массиве
    const [reloadPage, setReloadPage] = useState([0]) // вспомогательный массив для корректного вывода textarea

    // массив, в котором хранятся JSX элементы "IF", "THEN" или "ELSE". Пример: <div className={style}><text className=" bg-green-500 font-bold rounded-md py-1 ps-1 pe-1">THEN</text></div>
    const [textField, setTextField] = useState<MyTextField[]>([{id: 0, block: null}]) 
    //массив со значениями переменных из окна превью
    const [arrValues, setArrValues] = useState<Values[]>([{name: firstName, value: ""}, {name: lastName, value: ""}, {name: position, value: ""}, {name: company, value: ""}])
    //вспомогательный массив для корректного вывода сообщения в шаблоне 
    const [arrOfTextBlock, setArrOfTextBlock] = useState<string[]>([])
    const [firstNameValue, setFirstNameValue] = useState("")
    const [lastNameValue, setLastNameValue] = useState("")
    const [positionValue, setPositionValue] = useState("")
    const [companyValue, setCompanyValue] = useState("")


    const {modal, open, close} = useContext(ModalContext)


    //получаем позицию курсора в текстовом поле, а также id текстового поля
    function getCursorPosition(idOfTextField?: string, value?: string) {        
        if (idOfTextField){
            setIdField(idOfTextField)
        }
        var ctl = idOfTextField ? document.getElementById(idOfTextField)! as HTMLInputElement : document.getElementById(idField)! as HTMLInputElement;
        
        // Если курсок не стоит не одном текстовом поле, то автоматически определяется будто он стоит в самом первом поле
        if (ctl === null) {
            ctl = document.getElementById("0")! as HTMLInputElement
        }

        var startPos = ctl.selectionStart;

        var endPos = ctl.selectionEnd;

        setCursorPosition(startPos!)
        setIdField(ctl.id)
        // setCursorPosition(endPos!)
        console.log(startPos, endPos, idField, ctl.id, cursorPosition);
        
        return [startPos, ctl.id, value]       
    }


    // изменяем наполнение текстового поля и получаем позицию курсора и id поля
    function setTemplateAndGetCursor(e: string, id: string) {


        for (let obj of template){
            if (obj.id == Number(id)) {
                obj.text = e 
                break
            }
        }

        setTemplate(template)
        
        setCursorPosition(Number(getCursorPosition(id)[0]!))
        setIdField(String(getCursorPosition(id)[1]!))
    }


    // удаление текстовых блоков
    function deleteIfThenElseBlock(idButton: string){
        const idField = Number(idButton.split(".")[0])
        setReloadPage(reloadPage.slice(0)) 


        for (let i = idField; i < idField + 5; i++){
            if (i == idField){
                counter.splice(counter.indexOf(i), 1, arrOfRepeatIndexesOfJSXElement[arrOfRepeatIndexesOfJSXElement.indexOf(idField) - 1])
            }
            if (counter.indexOf(i) != -1){
                counter.splice(counter.indexOf(i), 1)
            }
        }
        counter.sort()
        setCounter(counter)

        let index = arrOfRepeatIndexesOfJSXElement.indexOf(idField)

        textField.splice(index, textField.slice(index, arrOfRepeatIndexesOfJSXElement.indexOf(idField + 3)).length + 1)
        setTextField(textField)

        template.splice(index, template.slice(index, arrOfRepeatIndexesOfJSXElement.indexOf(idField + 3)).length + 1)
        setTemplate(template)

        arrOfRepeatIndexesOfJSXElement.splice(arrOfRepeatIndexesOfJSXElement.indexOf(idField), arrOfRepeatIndexesOfJSXElement.slice(index, arrOfRepeatIndexesOfJSXElement.indexOf(idField + 3)).length + 1)
        setArrOfRepeatIndexesOfJSXElement(arrOfRepeatIndexesOfJSXElement)
        
        console.log("ID BUTTON", textField, arrOfRepeatIndexesOfJSXElement);
        
    }


    // добавление текстовых блоков по нажатию кнопки "IF-THEN-ELSE"
    function addJSX(){
        let currentIdField = Number(getCursorPosition()[1]!) 
        let currentCursorPosition = Number(getCursorPosition()[0])  

        console.log("COUNTER", counter, idField, currentIdField, textField.slice(currentIdField+1));

        // проверка на то, чтобы уже разделенный блок нельзя было разделить второй раз
        if (counter.includes(currentIdField)){
            arrOfRepeatIndexesOfJSXElement.splice(arrOfRepeatIndexesOfJSXElement.indexOf(currentIdField) + 1, 0, ...[textField.length, textField.length + 1, textField.length + 2, textField.length + 3])
            setArrOfRepeatIndexesOfJSXElement(arrOfRepeatIndexesOfJSXElement)
            setReloadPage(reloadPage.slice(0)) // костыль, чтобы разделение блоков отображалось сразу, никакого другого смысла за собой не несет
            // console.log("REPAET", arrOfRepeatIndexesOfJSXElement);



            let arrOfBlocks = []
            let arrOfText = []

            let helperForFixId = textField.length == 0 ? 1 : textField.length 



            /// Блок для разбиения текста на две части 
            arrOfText.push({id: helperForFixId, text: ""})
            arrOfText.push({id: helperForFixId  + 1, text: ""})
            arrOfText.push({id: helperForFixId  + 2, text: ""})
            arrOfText.push({id: helperForFixId  + 3, text: ""})
            let text = document.getElementById(String(currentIdField)) as HTMLInputElement
            template[template.findIndex(obj => obj.id == currentIdField)].text = text.innerHTML.slice(0, currentCursorPosition)
            arrOfText[arrOfText.findIndex(obj => obj.id == helperForFixId + 3)].text = text.innerHTML.slice(currentCursorPosition)
            template.splice(arrOfRepeatIndexesOfJSXElement.indexOf(currentIdField) + 1, 0, ...arrOfText)
            setTemplate(template)



            const style = `ml-${5 * Math.ceil(helperForFixId/4) <= 10 ? 5 * Math.ceil(helperForFixId/4) : 10} flex items-baseline`

            const blockIF = <div className={style}>
                <text className=" bg-green-500 font-bold rounded-md py-1 ps-1 pe-1">IF</text>
                <button id={String(helperForFixId) + "."} className='ml-3 px-1 mt-5 border bg-slate-400 hover:bg-slate-800 rounded text-white' onClick={event => deleteIfThenElseBlock(event.currentTarget.id)}>delete</button>
            </div>
            

            const blockThen = <div className={style}>
                <text className=" bg-green-500 font-bold rounded-md py-1 ps-1 pe-1">THEN</text>
            </div>


            const blockElse = <div className={style}>
                <text className=" bg-green-500 font-bold rounded-md py-1 ps-1 pe-1">ELSE</text>
            </div>


            const style2 = `ms-${Math.floor(helperForFixId/4) == 0 ? 5 : 20} flex items-baseline`

            const secondPartOfTextField = null 

            arrOfBlocks.push({id: helperForFixId, block: blockIF})
            arrOfBlocks.push({id: helperForFixId + 1, block: blockThen})
            arrOfBlocks.push({id: helperForFixId + 2, block: blockElse})
            arrOfBlocks.push({id: helperForFixId + 3, block: secondPartOfTextField})

            
            textField.splice(arrOfRepeatIndexesOfJSXElement.indexOf(currentIdField) + 1, 0, ...arrOfBlocks)

            setTextField(textField)


            counter.push(textField.length - 4)
            counter.push(textField.length - 3)
            counter.push(textField.length - 2)
            counter.push(textField.length - 1)

            counter.splice(counter.indexOf(currentIdField), 1)


            setCounter(counter)
            console.log("COUNTER", counter);


            arrOfBlocks = []

        }

    }


    // Добавление {firstname} по нажатию соответствующей клавиши на последние место, где был курсор
    function setFirstName(){
        let addFirstName
        for (let obj of template){
            if (obj.id == Number(idField)){
                if (obj.text != ""){
                    addFirstName = [obj.text.slice(0, cursorPosition), firstName, obj.text.slice(cursorPosition)].join("")
                } else {
                    addFirstName = firstName
                }
                obj.text = addFirstName
                break
            }
        }
        setTemplate(template)
        setCursorPosition(cursorPosition + firstName.length)
    }

    // Добавление {lastName} по нажатию соответствующей клавиши на последние место, где был курсор
    function setLastName(){
        let addLastName
        for (let obj of template){
            if (obj.id == Number(idField)){
                if (obj.text != ""){
                    addLastName = [obj.text.slice(0, cursorPosition), lastName, obj.text.slice(cursorPosition)].join("")
                } else {
                    addLastName = lastName
                }
                obj.text = addLastName
                break
            }
        }
        setTemplate(template)
        setCursorPosition(cursorPosition + lastName.length)
    }
    
    // Добавление {position} по нажатию соответствующей клавиши на последние место, где был курсор
    function setPositionAtCompany(){
        let addPosition
        for (let obj of template){
            if (obj.id == Number(idField)){
                if (obj.text != ""){
                    addPosition = [obj.text.slice(0, cursorPosition), position, obj.text.slice(cursorPosition)].join("")
                } else {
                    addPosition = position
                }
                obj.text = addPosition
                break
            }
        }
        setTemplate(template)
        setCursorPosition(cursorPosition + position.length)
    }

    // Добавление {company} по нажатию соответствующей клавиши на последние место, где был курсор
    function setCompany(){
        let addCompany
        for (let obj of template){
            if (obj.id == Number(idField)){
                if (obj.text != ""){
                    addCompany = [obj.text.slice(0, cursorPosition), company, obj.text.slice(cursorPosition)].join("")
                } else {
                    addCompany = company
                }
                obj.text = addCompany
                break
            }
        }
        setTemplate(template)
        setCursorPosition(cursorPosition + company.length)
    }

    // обновляет окно превью
    function updateTemplate(){
        arrOfTextBlock.splice(0, arrOfTextBlock.length)
        setArrOfTextBlock(arrOfTextBlock)
        console.log('firstNameValue, arrOfTextBlock :>> ', firstNameValue, arrOfTextBlock);



        let metaArr = []

        arrOfTextBlock.unshift(document.getElementById("0")?.innerHTML || "")

        for (let i = 1; i <= (template.length - 1)/4; i++){
            metaArr.push(template[template.findIndex(obj => obj.id == 4 * i)].text)
        }


        for (let i = 1; i <= (template.length - 1)/4; i++){
            // проверка на то, что было указано при конструировании шаблона {firstname}, {lastName}, {position} или {company} и указано ли значение соотвествующей переменной в окне Preview
            if (template[template.findIndex(obj => obj.id == 4 * i - 3)].text == firstName) {
                if (firstNameValue){                    
                    arrOfTextBlock.push(template[template.findIndex(obj => obj.id == 4 * i - 2)].text.replace(firstName, firstNameValue))
                    console.log('firstNameValue, arrOfTextBlock :>> ', firstNameValue, arrOfTextBlock);
                    setArrOfTextBlock(arrOfTextBlock)
                    if (template.findIndex(obj => obj.id == 4 * i - 1) + 1 == template.findIndex(obj => obj.id == 4 * i + 1)){
                        i++
                    }
                } else {
                    arrOfTextBlock.push(template[template.findIndex(obj => obj.id == 4 * i - 1)].text)
                    if (template.findIndex(obj => obj.id == 4 * i - 2) + 1 == template.findIndex(obj => obj.id == 4 * i + 1)){
                        i++
                    }
                }
            } else if (template[template.findIndex(obj => obj.id == 4 * i - 3)].text == lastName){
                if (lastNameValue){
                    arrOfTextBlock.push(template[template.findIndex(obj => obj.id == 4 * i - 2)].text.replace(lastName, lastNameValue))
                    if (template.findIndex(obj => obj.id == 4 * i - 1) + 1 == template.findIndex(obj => obj.id == 4 * i + 1)){
                        i++
                    }
                } else {
                    arrOfTextBlock.push(template[template.findIndex(obj => obj.id == 4 * i - 1)].text)
                    if (template.findIndex(obj => obj.id == 4 * i - 2) + 1 == template.findIndex(obj => obj.id == 4 * i + 1)){
                        i++
                    }
                }
            }else if (template[template.findIndex(obj => obj.id == 4 * i - 3)].text == position){
                if (positionValue){
                    arrOfTextBlock.push(template[template.findIndex(obj => obj.id == 4 * i - 2)].text.replace(position, positionValue))
                    if (template.findIndex(obj => obj.id == 4 * i - 1) + 1 == template.findIndex(obj => obj.id == 4 * i + 1)){
                        i++
                    }
                } else {
                    arrOfTextBlock.push(template[template.findIndex(obj => obj.id == 4 * i - 1)].text)
                    if (template.findIndex(obj => obj.id == 4 * i - 2) + 1 == template.findIndex(obj => obj.id == 4 * i + 1)){
                        i++
                    }
                }
            } else if(template[template.findIndex(obj => obj.id == 4 * i - 3)].text == company){
                if (companyValue){
                    arrOfTextBlock.push(template[template.findIndex(obj => obj.id == 4 * i - 2)].text.replace(company, companyValue))
                    if (template.findIndex(obj => obj.id == 4 * i - 1) + 1 == template.findIndex(obj => obj.id == 4 * i + 1)){
                        i++
                    }
                } else {
                    arrOfTextBlock.push(template[template.findIndex(obj => obj.id == 4 * i - 1)].text)
                    if (template.findIndex(obj => obj.id == 4 * i - 2) + 1 == template.findIndex(obj => obj.id == 4 * i + 1)){
                        i++
                    }
                }
            } else{
                close()
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
 

        return arrOfTextBlock
    }



    // открывает модалку и собирает шаблон
    function openModalAndGetTemplate(){
        console.log('template :>> ', template);
        open()
        
        arrOfTextBlock.splice(0, arrOfTextBlock.length)
        setArrOfTextBlock(arrOfTextBlock)


        let metaArr = []

        arrOfTextBlock.unshift(document.getElementById("0")?.innerHTML || "")
        
        for (let i = 1; i <= (template.length - 1)/4; i++){
            metaArr.push(template[template.findIndex(obj => obj.id == 4 * i)].text)
        }


        for (let i = 1; i <= (template.length - 1)/4; i++){
            // проверка на то, что было указано при конструировании шаблона {firstname}, {lastName}, {position} или {company} и указано ли значение соотвествующей переменной в окне Preview
            if (template[template.findIndex(obj => obj.id == 4 * i - 3)].text == firstName) {
                if (firstNameValue){                    
                    arrOfTextBlock.push(template[template.findIndex(obj => obj.id == 4 * i - 2)].text.replace(firstName, firstNameValue))
                    console.log('firstNameValue, arrOfTextBlock :>> ', firstNameValue, arrOfTextBlock);
                    setArrOfTextBlock(arrOfTextBlock)
                    if (template.findIndex(obj => obj.id == 4 * i - 1) + 1 == template.findIndex(obj => obj.id == 4 * i + 1)){
                        i++
                    }
                } else {
                    arrOfTextBlock.push(template[template.findIndex(obj => obj.id == 4 * i - 1)].text)
                    if (template.findIndex(obj => obj.id == 4 * i - 2) + 1 == template.findIndex(obj => obj.id == 4 * i + 1)){
                        i++
                    }
                }
            } else if (template[template.findIndex(obj => obj.id == 4 * i - 3)].text == lastName){
                if (lastNameValue){
                    arrOfTextBlock.push(template[template.findIndex(obj => obj.id == 4 * i - 2)].text.replace(lastName, lastNameValue))
                    if (template.findIndex(obj => obj.id == 4 * i - 1) + 1 == template.findIndex(obj => obj.id == 4 * i + 1)){
                        i++
                    }
                } else {
                    arrOfTextBlock.push(template[template.findIndex(obj => obj.id == 4 * i - 1)].text)
                    if (template.findIndex(obj => obj.id == 4 * i - 2) + 1 == template.findIndex(obj => obj.id == 4 * i + 1)){
                        i++
                    }
                }
            }else if (template[template.findIndex(obj => obj.id == 4 * i - 3)].text == position){
                if (positionValue){
                    arrOfTextBlock.push(template[template.findIndex(obj => obj.id == 4 * i - 2)].text.replace(position, positionValue))
                    if (template.findIndex(obj => obj.id == 4 * i - 1) + 1 == template.findIndex(obj => obj.id == 4 * i + 1)){
                        i++
                    }
                } else {
                    arrOfTextBlock.push(template[template.findIndex(obj => obj.id == 4 * i - 1)].text)
                    if (template.findIndex(obj => obj.id == 4 * i - 2) + 1 == template.findIndex(obj => obj.id == 4 * i + 1)){
                        i++
                    }
                }
            } else if(template[template.findIndex(obj => obj.id == 4 * i - 3)].text == company){
                if (companyValue){
                    arrOfTextBlock.push(template[template.findIndex(obj => obj.id == 4 * i - 2)].text.replace(company, companyValue))
                    if (template.findIndex(obj => obj.id == 4 * i - 1) + 1 == template.findIndex(obj => obj.id == 4 * i + 1)){
                        i++
                    }
                } else {
                    arrOfTextBlock.push(template[template.findIndex(obj => obj.id == 4 * i - 1)].text)
                    if (template.findIndex(obj => obj.id == 4 * i - 2) + 1 == template.findIndex(obj => obj.id == 4 * i + 1)){
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

    }



    // сохранение шаблона и переменных и перенправление на основную страницу
    function saveTemplateAndValues() {
        localStorage.setItem("template", arrOfTextBlock.join(""))
        localStorage.setItem("templateObject", JSON.stringify(template))
        localStorage.setItem("arrVarNames", JSON.stringify(arrValues))
        window.location.href = '/template';
    }


    //переходит на новую страницу без перезаписи localStorage
    function closeTemplateEditor() {
        window.location.href = '/template';
    }
    


    return (
    <>
        <h1 className="mx-auto max-w-2xl pt-2 text-center">Message Template Editor</h1>
        <button className='ml-2 font-sans border bg-green-300 hover:text-white mt-5 rounded' onClick={setFirstName}>{firstName} </button>
        <text className='mr-3'>,</text>
        <button className='border bg-green-300 hover:text-white mt-5 rounded' onClick={setLastName}>{lastName}</button>
        <text className='mr-3'>,</text>
        <button className='border bg-green-300 hover:text-white mt-5 rounded' onClick={setCompany}>{company}</button>
        <text className='mr-3'>,</text>
        <button className='border bg-green-300 hover:text-white mt-5 rounded' onClick={setPositionAtCompany}>{position}</button>
        <p>
            <button className='ml-10 py-2 mt-5 border bg-gray-400 hover:text-white rounded' onClick={addJSX}>
                <text className="ps-2 font-bold">Click to add: </text>
                <text className=' bg-green-500 font-bold rounded-md py-1 ps-1 pe-1'>IF </text>
                <text className='ps-2 pe-2'>{some_variable_or_expression}</text>
                <text className=' bg-green-500 font-bold rounded-md py-1 ps-1 pe-1'>THEN </text>
                <text className='ps-2 pe-2'>[then_value]</text>
                <text className=' bg-green-500 font-bold rounded-md py-1 ps-1 pe-1 text-center'>ELSE </text>
                <text className='ps-2 pe-2'>[else_value]</text>
            </button>
        </p>

        {textField.map((el, index) => 
        <div key={index}>
        <Textblock 
            template={template} 
            id={el.id} 
            element={el.block} 
            setCursorPosition={setCursorPosition} 
            setTemplateAndGetCursor={setTemplateAndGetCursor} 
            getCursorPosition={getCursorPosition}
            textField={textField}/> 
        </div>)}


        <div  className='flex justify-center'>
            <button className='mr-3 px-4 py-2 mt-5 border bg-slate-800 hover:bg-slate-600 rounded text-white' onClick={openModalAndGetTemplate}>Preview</button>
            <button className='mr-3 px-4 py-2 mt-5 border bg-slate-800 hover:bg-slate-600 rounded text-white' onClick={saveTemplateAndValues}>Save</button>
            <button className='px-4 py-2 mt-5 border bg-slate-800 hover:bg-slate-600 rounded text-white' onClick={closeTemplateEditor}>Close</button>
        </div>

        {modal && <ModalPreview title='Template Preview' onClose={close}>
            <PreviewTemplate 
            template={template} 
            arrValues={arrValues} 
            setArrValues={setArrValues} 
            arrOfTextBlock={arrOfTextBlock}
            firstNameValue={firstNameValue}
            lastNameValue={lastNameValue}
            positionValue={positionValue}
            companyValue={companyValue}
            setFirstNameValue={setFirstNameValue}
            setLastNameValue={setLastNameValue}
            setPositionValue={setPositionValue}
            setCompanyValue={setCompanyValue}
            updateTemplate={updateTemplate}/>
        </ModalPreview>}
    </>
    )
} 