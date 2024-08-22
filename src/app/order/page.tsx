"use client"
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label";
import { useState, useEffect, useRef } from "react"
import { getStoreId, getOrders, deleteOrder } from "../actions/orderActions"
import { Prisma } from "@prisma/client";


export default function Page(){

    const listening = useRef<boolean>(false)
    const [orders, setOrders] = useState<Order[]>([])
    const [completedOrders, setCompletedOrders] = useState<Order[]>([])
    const timer = useRef<NodeJS.Timer>()
    const [time, setTime] = useState(BigInt(Date.now()))
    const storeId = useRef<number>()

    interface Order{
            id: number;
            name: string;
            phone: string | null;
            email: string;
            time: string;
            storeId: number | null;
            orderItems: {
                id: number;
                text: string;
                price: string;
                orderId: number | null;
            }[];
    }
    

    useEffect(() => {
        (async () => {
            storeId.current = await getStoreId()
            console.log(storeId.current)
        })()
    }, [])

    useEffect(() => {
        async function timerFunc(){
            if (listening.current){
                setTime(BigInt(Date.now()))
                console.log("Polling...")
                getOrdersDB()
            }
        }
        timer.current = setInterval(timerFunc, 5000)
    }, [])
    
    

    function sumOrder(items: {
        id: number;
        text: string;
        price: string;
        orderId: number | null;
    }[]){
        return items.reduce((accumulator, current) => accumulator.plus(new Prisma.Decimal(parseFloat(current.price))), new Prisma.Decimal(0)).toFixed(2)

    }

    function getColor(startTime: bigint){
        const timeDiff = time - startTime
        if (timeDiff < BigInt(1000 * 60 * 5)){
            return "green"
        }
        else if (timeDiff < BigInt(1000 * 60 * 10)){
            return "yellow"
        }
        else{
            return "red"
        }
    }

    async function getOrdersDB(){
        try{
            const dbOrders = await getOrders(storeId.current!) 
            setOrders(dbOrders!)
        }
        catch(e){
            console.log(e)
        }
        
        
    }

    async function completeOrder(order: Order){
        setCompletedOrders([...completedOrders, order])
        try{
            deleteOrder(order.id, storeId.current!)
        }
        catch(e){
            console.log(e)
        }
    }

    function changeSwitch(){
        console.log("Flip switch")
        listening.current = !listening.current
    }

    return(
        <div>
            <h1 className="flex flex-col text-lg font-bold text-center items-center mb-10">Order Tracking</h1>
            <div className="flex items-center space-x-2 justify-center">
               <Switch id="orders-listen" checked={listening.current} onCheckedChange={changeSwitch}></Switch>
               <Label htmlFor="orders-listen">Listen for Orders</Label>
            </div>
            <div className="border-1 rounded">
                {orders.map((order) => {
                    console.log(order)
                    return(
                        <Card key={order.id} className="border-3 rounded-sm border-black m-10 p-4 h-auto w-4/6" style={{backgroundColor: getColor(BigInt(order.time))}}>
                            <h2>Order #{order.id}</h2>
                            <p>{order.name}</p>
                            <p>{order.phone}</p>
                            {order.orderItems.map((item: {id: number,text: string, price: string, orderId: number | null}) => {
                                return <p key={item.id}><span>{item.text}</span><span>{new Prisma.Decimal(parseFloat(item.price)).toFixed(2)}</span></p>
                            })}
                            <h3>${sumOrder(order.orderItems)}</h3>
                            <Button onClick={() => completeOrder(order)}>Complete Order</Button>
                        </Card>
                    )
                })}
            </div>
        </div>
    )
}