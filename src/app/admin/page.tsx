"use client"
import { useState } from "react"
import testData from "@/app/testdata.json"
import { Table, TableCell, TableRow, TableBody } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { getData, createCategory, createItem ,updateCategory, updateItem, deleteCategory, deleteItem } from "../actions/adminActions"


export default function Page(){
    
    const [data, setData] = useState(getData())
    const [category , setCategory] = useState(getCategoryObj("More Items"))
    const [cart, setCart] = useState<CartItem[]>([])
    const [selected, setSelected] = useState<CartItem>()

    //selected object is {code, name, optionName, adjustedPrice}
    interface CartItem{
        id: number;
        name: string;
        code: string;
        adjustedPrice: number;
        option: string
    }

    interface Category{
            name: string;
            items: {
                id: number,
                name: string;
                code: string;
                basePrice: number;
                options: {
                    text: string;
                    adjustment: number;
                }[];
        }[]
    }

    function getData(){
        //fetch("/api")
        return testData
    }
    
    function getCategoryObj(name: string){
        return data.find((item)=> item.name === name) 
    }

    function sumCart(){
        return cart.reduce((accumulator, current) => accumulator + current.adjustedPrice, 0)
    }

    function setItem(name: string, code: string, adjustedPrice: number, option: string){
        setSelected({id: Math.floor(Math.random() * 100000), name: name, code: code, adjustedPrice: adjustedPrice, option: option})
    }

    function addItem(code: string, name: string, itemId: string){
        const optionsText = (document.getElementById(itemId)! as HTMLInputElement).value
    }

    function newCategory(){
        
    }

    function addNewItem(){
        const code = (document.getElementById("new-item-code")! as HTMLInputElement).value
        const name = (document.getElementById("new-item-code")! as HTMLInputElement).value
        const price = (document.getElementById("new-item-code")! as HTMLInputElement).value
        const desc = (document.getElementById("new-item-description")! as HTMLInputElement).value
        const options = (document.getElementById("new-item-options")! as HTMLInputElement).value
    }

    function modifyItem(itemId: number){
        const code = (document.getElementById(itemId + "-code")! as HTMLInputElement).value
        const name = (document.getElementById(itemId + "-code")! as HTMLInputElement).value
        const price = (document.getElementById(itemId + "-code")! as HTMLInputElement).value
        const desc = (document.getElementById(itemId + "-description")! as HTMLInputElement).value
        const options = (document.getElementById(itemId + "-options")! as HTMLInputElement).value
    }

    function removeItem(itemId: number){
        
    }
    
    function parseOptions(opts: string){
        const regex = /^([^:]+):\(([\+\-]?\d+\.\d\d)\)$/g
        const lines = opts.split("\n")
        const optArr = []
        for (let line of lines){
            const parts = Array.from(line.matchAll(regex))
            optArr.push({text: parts[0][1].toString(), adjustment: parseFloat(parts[0][2].toString())})
        }
        
    }

    function chgCategory(catId: number){

    }

    function delCategory(catId: number){
        
    }
  

    return(
        <div>
            <div className="menu-split flex flex-row w-full m-8">
                <div className="menu-categories basis-1/4">
                    <div className="category-box w-80 min-h-48 border-2 border-black rounded-sm">
                        {data && data.map(cat => {
                            return <div className={`category-item text-lg p-4 even:bg-slate-200 odd:bg-white hover:bg-cyan-100`} key={cat.name} onClick={() => setCategory(getCategoryObj(cat.name))}>
                                {cat.name} 
                                <Popover>
                                    <PopoverTrigger>
                                        <Button>Modify/Delete</Button>
                                    </PopoverTrigger>
                                    <PopoverContent>
                                        <Input type="text" placeholder="Category name.."></Input>
                                        <Button onClick={() => chgCategory(cat.id)}>Update Category</Button>
                                        <Button onClick={() => delCategory(cat.id)}>Delete Category</Button>
                                    </PopoverContent>
                                </Popover>
                            </div>
                        })}
                    </div>
                    <div className={`category-item text-lg p-4 even:bg-slate-200 odd:bg-white hover:bg-cyan-100`} onClick={newCategory}>Add New Category</div>
                </div>
                <div className="menu-items basis-3/4 mr-10">
                    <div className="item-box min-h-48 border-2 border-black rounded-sm">
                        <Table>
                            <TableBody>
                                {data && category!.items.map(item => {
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
                                                        <Input type="text" id={`${item.id}-code`} placeholder="Code.." value={item.code}></Input>
                                                        <Input type="text" id= {`${item.id}-name`} placeholder="Name.." value={item.name}></Input>
                                                        <Input type="text" id={`${item.id}-desc`} placeholder="Description.." value={item.desc}></Input>
                                                        <Input type="text" id={`${item.id}-price`}placeholder="Base Price.." value={item.basePrice}></Input>
                                                    </div>
                                                    <div className="opt-Input">
                                                        <Input type="text" id={item.code + "-" + item.name + "-opts"} placeholder="Enter options. Enter one option per line in the format: Option name (1.00)"></Input>
                                                        <Button onClick={() => modifyItem(item.id)}>Add Item to Menu</Button>
                                                        <Button onClick={() => removeItem(item.id)}>Delete Item</Button>
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
                                                        <Input type="text" id="new-item-options" placeholder="Enter options. Enter one option per line in the format: Option name (1.00)"></Input>
                                                        <Button onClick={addNewItem}>Add Item to Menu</Button>
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
            <Popover>
                <PopoverTrigger asChild>
                    <Button className="float-right mr-10">View Cart and Order</Button>
                </PopoverTrigger>
                <PopoverContent>
                    <Table>
                        <TableBody>
                        {
                            cart.length < 1 ? <TableRow><TableCell>No items in cart</TableCell></TableRow> : 
                            cart.map(item => {
                                return <TableRow key={item.name}>
                                    <TableCell>{`${item.code}  ${item.name} - ${item.option}`}</TableCell>
                                    <TableCell>{"$" + (item.adjustedPrice)}</TableCell>
                                    <TableCell><Button onClick={() => removeItem(item.id)}>Remove</Button></TableCell>
                                </TableRow>
                            })
                        }
                        </TableBody>
                    </Table>
                    <div>
                        <p><span>Subtotal: </span><span>${0 + sumCart()}</span></p>
                        <p><span>Tax: </span><span>9%</span></p>
                        <p><span>Subtotal: </span><span>${((0 + sumCart()) * 1.09).toFixed(2)}</span></p>
                        <Button>Place Order</Button>
                    </div>
                </PopoverContent>
            </Popover>
        </div>
    )
}