"use client"
import { useState, useEffect, useRef } from "react"
import testData from "@/app/testdata.json"
import { Table, TableCell, TableRow, TableBody } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover"
import { toast } from "sonner"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { unlock, getStoreId, getData, createCategory, createItem ,updateCategory, updateItem, deleteCategory, deleteItem } from "../actions/adminActions"


export default function Page(){
    
    const [data, setData] = useState<any>(() => {return testData})
    const [category , setCategory] = useState(getCategoryObj("More Items"))
    const storeId = useRef<number>()
    const [lockVisible, setLockVisible] = useState({display: "inline"})

    useEffect(() => {
        (async () => {
            storeId.current = await getStoreId()
            const dataDB = await getDataDB()
            if (data.length > 0){
                setCategory(dataDB![0])
            }
            console.log(data)
        })()
    }, [])

    //selected object is {code, name, optionName, adjustedPrice}
    interface CartItem{
        id: number;
        name: string;
        code: string;
        adjustedPrice: number;
        option: string
    }

    async function getDataDB(){
        try{
            const dataDB = await getData(storeId.current!)
            //console.log(dataDB)
            setData(dataDB)
            return dataDB
        }
        catch(e){
            console.log(e)
            toast("Error getting data")
        }
    }

    function getFirstCategory(){
        return data[0]
    }
    
    function getCategoryObj(name: string){
        return data.find((item: any)=> item.name === name) 
    }

    async function newCategory(){
        try{
            const name = (document.getElementById("category-name")! as HTMLInputElement).value
            createCategory(name, storeId.current!)
            getDataDB()
            toast("Category created.")
        }
        catch(e){
            console.log(e)
            toast("Error")
        }
    }

    async function updCategory(catId: number){
        try{
            const name = (document.getElementById("category-name")! as HTMLInputElement).value
            updateCategory(catId, name)
            getDataDB()
            toast("Category changed.")
        }
        catch(e){
            console.log(e)
            toast("Database error.")
        }
    }

    async function delCategory(catId: number){
        try{
            deleteCategory(catId)
            getDataDB()
            toast("Category deleted.")
        }
        catch(e){
            console.log(e)
            toast("Database error.")
        }
    }

    async function addNewItem(catId: number){
        try{
            const code = (document.getElementById("new-item-code")! as HTMLInputElement).value
            const name = (document.getElementById("new-item-name")! as HTMLInputElement).value
            const price = parseFloat((document.getElementById("new-item-price")! as HTMLInputElement).value)
            const desc = (document.getElementById("new-item-description")! as HTMLInputElement).value
            const options = parseOptions((document.getElementById("new-item-options")! as HTMLInputElement).value)
            createItem(name, code, desc, price, options, catId)
            getDataDB()
            toast("Item added.")
        }
        catch(e){
            console.log(e)
            toast("Database error.")
        }
    }

    async function modifyItem(itemId: number){
        try{
            const code = (document.getElementById(itemId + "-code")! as HTMLInputElement).value
            const name = (document.getElementById(itemId + "-name")! as HTMLInputElement).value
            const price = parseFloat((document.getElementById(itemId + "-price")! as HTMLInputElement).value)
            const desc = (document.getElementById(itemId + "-description")! as HTMLInputElement).value
            const options = parseOptions((document.getElementById(itemId + "-options")! as HTMLInputElement).value)
            updateItem(name, code, desc, price, options, itemId)
            getDataDB()
            toast("Item changed.")
        }
        catch(e){
            console.log(e)
            toast("Database error")
        }
    }

    async function removeItem(itemId: number){
        try {
            deleteItem(itemId)
            getDataDB()
            toast("Item removed.")
        } catch (error) {
            toast("Database error")
        }
        
    }
    
  
    function parseOptions(opts: string){
        console.log(opts)
            const regex = /^([^:]+):\(([\+\-]?\d+\.\d\d)\)$/g
            const lines = opts.split("\n")
            const optArr = []
            for (let line of lines){
                const parts = Array.from(line.matchAll(regex))
                optArr.push({text: parts[0][1].toString(), adjustment: parseFloat(parts[0][2].toString())})
            }
            return optArr
        }

    async function unlockAdmin(){
        if (await unlock((document.getElementById("pass-text") as HTMLInputElement).value)){
            setLockVisible({display: "none"})
        }
    }

    return(
        <div>
            <div id="lock-screen" className="absolute w-screen h-screen bg-white z-10" style={lockVisible}>
                <div className="flex items-center justify-center m-40">
                    <Input id="pass-text" className="w-100 mr-10" type="text" placeholder="Enter password"></Input>
                    <Button onClick={unlockAdmin}>Unlock</Button>
                </div>
            </div>
            <div className="menu-split flex flex-row w-full m-8">
                <div className="menu-categories basis-1/4">
                    <div className="category-box w-80 min-h-48 border-2 border-black rounded-sm">
                        {data && data.map((cat: any) => {
                            return <div className={`category-item text-lg p-4 even:bg-slate-200 odd:bg-white hover:bg-cyan-100`} key={cat.name} onClick={() => setCategory(getCategoryObj(cat.name))}>
                                {cat.name} 
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button className="m-4">Modify/Delete</Button>
                                    </PopoverTrigger>
                                    <PopoverContent>
                                        <Input id="category-name" type="text" placeholder="Category name.."></Input>
                                        <Button onClick={() => updCategory(cat.id)}>Update Category</Button>
                                        <Button className="mt-4" onClick={() => delCategory(cat.id)}>Delete Category</Button>
                                    </PopoverContent>
                                </Popover>
                            </div>
                        })}
                    </div>
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button className="mt-4">Add New Category</Button>
                        </PopoverTrigger>
                        <PopoverContent>
                            <Input id="category-name" type="text" placeholder="Category name.."></Input>
                            <Button className="mt-4" onClick={newCategory}>Add Category</Button>
                        </PopoverContent>
                    </Popover>
                </div>
                <div className="menu-items basis-3/4 mr-10">
                    <div className="item-box min-h-48 border-2 border-black rounded-sm">
                        <Table>
                            <TableBody>
                                {(data.length > 0) && category!.items.map((item: any) => {
                                    return <TableRow key={item.name} className={`even:bg-slate-200 odd:bg-white hover:bg-cyan-100`}>
                                        <TableCell>{item.code}</TableCell>
                                        <TableCell>{item.name}</TableCell>
                                        <TableCell className="text-right">${item.basePrice}</TableCell>
                                        <TableCell className="w-20">
                                            <Popover>
                                                <PopoverTrigger asChild>
                                                    <Button>Details</Button>
                                                </PopoverTrigger>
                                                <PopoverContent>
                                                    <div className="opt-header">
                                                        <h2>Modify Item</h2>
                                                        <Input type="text" id={`${item.id}-code`} placeholder="Code.." defaultValue={item.code}></Input>
                                                        <Input type="text" id= {`${item.id}-name`} placeholder="Name.." defaultValue={item.name}></Input>
                                                        <Input type="text" id={`${item.id}-desc`} placeholder="Description.." defaultValue={item.desc}></Input>
                                                        <Input type="text" id={`${item.id}-price`}placeholder="Base Price.." defaultValue={item.basePrice}></Input>
                                                    </div>
                                                    <div className="opt-Input">
                                                        <Textarea id={item.code + "-" + item.name + "-opts"} placeholder="Enter options. Enter one option per line in the format: Option name (1.00)" defaultValue={item.options.reduce((acc: string, val: {text: string, adjustment: number}) => acc + val.text + ":" + val.adjustment + "\n", "")}></Textarea>
                                                        <Button className="mt-4" onClick={() => modifyItem(item.id)}>Add Item to Menu</Button>
                                                        <Button className="mt-4" onClick={() => removeItem(item.id)}>Delete Item</Button>
                                                    </div>
                                                </PopoverContent>
                                            </Popover> 
                                        </TableCell>
                                    </TableRow>
                                })}
                                <TableRow>
                                <TableCell className="w-20">
                                            <Popover>
                                                <PopoverTrigger asChild>
                                                    <Button>New Item</Button>
                                                </PopoverTrigger>
                                                <PopoverContent>
                                                    <div className="opt-header">
                                                        <h2>Add Item</h2>
                                                        <Input type="text" id="new-item-code" placeholder="Code.."></Input>
                                                        <Input type="text" id="new-item-name"placeholder="Name.."></Input>
                                                        <Input type="text" id="new-item-description"placeholder="Description.."></Input>
                                                        <Input type="text" id="new-item-price"placeholder="Base Price.."></Input>
                                                    </div>
                                                    <div className="opt-Input">
                                                        <Textarea id="new-item-options" placeholder="Enter options. Enter one option per line in the format: Option name (1.00)"></Textarea>
                                                        <Button onClick={() => addNewItem(category!.id)}>Add Item to Menu</Button>
                                                    </div>
                                                </PopoverContent>
                                            </Popover>
                                        </TableCell>
                                </TableRow>
                            </TableBody>
                        </Table> 
                    </div>
                </div>
            </div>
        </div>
    )
}