"use client"
import { useState, useEffect, useRef } from "react"
import testData from "@/app/testdata.json"
import { Table, TableCell, TableRow, TableBody } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { getStoreId, getData, createOrder } from "../actions/menuActions"

export default function Page(){
    
    const [data, setData] = useState<any>(testData)
    const [category , setCategory] = useState(getCategoryObj("More Items"))
    const [cart, setCart] = useState<CartItem[]>([])
    const [selected, setSelected] = useState<CartItem>()
    const storeId = useRef<number>()

    useEffect(() => {
        (async () => {
            storeId.current = await getStoreId()
            console.log(storeId.current)
            getDataDB()
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
            console.log(dataDB)
            setData(dataDB)
        }
        catch(e){
            console.log(e)
            toast("Error getting data")
        }
    }
    
    function getCategoryObj(name: string){
        return data.find((item: any)=> item.name === name) 
    }

    function sumCart(){
        return cart.reduce((accumulator, current) => accumulator + current.adjustedPrice, 0)
    }

    function setItem(name: string, code: string, adjustedPrice: number, option: string){
        setSelected({id: Math.floor(Math.random() * 100000), name: name, code: code, adjustedPrice: adjustedPrice, option: option})
    }

    function addItem(){
        if (!selected){
            toast("Please select an option to add item.")
            return
        }
        toast("Item added successfully.")
        setCart([...cart, selected!])
    }

    function removeItem(id: number){
        const toRemove = cart.find((item) => item.id === id)
        const cartCopy = structuredClone(cart)
        cartCopy.splice(cartCopy.indexOf(toRemove!), 1)
        setCart(cartCopy)
    }

    async function completeOrder(){
        const name = "NA"
        const phone = "555-555-5555"
        const email = "test@test.com"
        const orderItems = cart.map((item: CartItem) => {return {text: `${item.code} ${item.name} (${item.adjustedPrice})`, price: item.adjustedPrice}})
        try{
            createOrder(name, phone, email, orderItems, storeId.current!)
            setCart([])
            toast("Order placed")
        }
        catch(e){
            console.log(e)
            toast("Error placing order.")
        }
    }
  
    return(
        <div>
            <div className="menu-split flex flex-row w-full m-8">
                <div className="menu-categories basis-1/4">
                    <div className="category-box w-80 min-h-48 border-2 border-black rounded-sm">
                        {data && data.map((item: any) => {
                            return <div className={`category-item text-lg p-4 even:bg-slate-200 odd:bg-white hover:bg-cyan-100`} key={item.name} onClick={() => setCategory(getCategoryObj(item.name))}>{item.name} </div>
                        })}
                    </div>
                </div>
                <div className="menu-items basis-3/4 mr-10">
                    <div className="item-box min-h-48 border-2 border-black rounded-sm">
                        <Table>
                            <TableBody>
                                {data && category!.items.map((item: any) => {
                                    return <TableRow key={item.name} className={`even:bg-slate-200 odd:bg-white hover:bg-cyan-100`}>
                                        <TableCell>{item.code}</TableCell>
                                        <TableCell>{item.name}</TableCell>
                                        <TableCell className="text-right">${item.basePrice}</TableCell>
                                        <TableCell className="w-20">
                                            <Popover>
                                                <PopoverTrigger asChild>
                                                    <Button onClick={() => setSelected(undefined)} >Details</Button>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-90 m-l-6">
                                                    <div className="opt-header">
                                                        <h1 className="opt-code-name">{item.code} {item.name} <span>${item.basePrice}</span></h1>
                                                        <p className="opt-desc">{item.desc}</p>
                                                    </div>
                                                    <div className="opt-radio">
                                                        <RadioGroup>
                                                            {
                                                                item.options.map((opt: {text: string, adjustment: number}, index: number) => {
                                                                    return(
                                                                        <div key={opt.text} className="flex items-center space-x-2">
                                                                            <RadioGroupItem value={`${opt.text} (${opt.adjustment})`} onClick={() => setItem(item.name, item.code, opt.adjustment, opt.text)} id={"radio-options-" + index} />
                                                                            <Label htmlFor={"radio-options-" + index}>{`${opt.text} (${opt.adjustment})`}</Label>
                                                                        </div>
                                                                    )
                                                                })
                                                            
                                                            }
                                                        </RadioGroup>
                                                        <Button className="mt-5" onClick={addItem}>Add to Cart</Button>
                                                    </div>
                                                </PopoverContent>
                                            </Popover>
                                        </TableCell>
                                    </TableRow>
                                })}
                            </TableBody>
                        </Table> 
                    </div>
                </div>
            </div>
            <Popover>
                <PopoverTrigger asChild>
                    <Button className="float-right mr-10">View Cart and Order</Button>
                </PopoverTrigger>
                <PopoverContent className="mr-10 w-100">
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