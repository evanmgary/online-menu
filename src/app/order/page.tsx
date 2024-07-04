"use client"
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch"
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
            time: bigint;
            storeId: number | null;
            orderItems: {
                id: number;
                text: string;
                price: Prisma.Decimal;
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
                getOrdersDB()
            }
        }
        timer.current = setInterval(timerFunc, 5000)
    }, [])
    
    

    function sumOrder(items: {
        id: number;
        text: string;
        price: Prisma.Decimal;
        orderId: number | null;
    }[]){
        return items.reduce((accumulator, current) => accumulator.plus(current.price), new Prisma.Decimal(0)).toFixed(2)

    }

    function getColor(startTime: bigint){
        const timeDiff = time - startTime
        if (timeDiff < (1000 * 60 * 5)){
            return "green"
        }
        else if (timeDiff < (1000 * 60 * 10)){
            return "yellow"
        }
        else{
            return "red"
        }
    }

    async function getOrdersDB(){
        const orders = await getOrders(storeId.current!)
        setOrders(orders!)
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

    return(
        <div>
            <h1>Order Tracking</h1>
            <Switch checked={listening.current} onCheckedChange={() => (listening.current = !listening.current)} className="flex items-center space-x-2">Listen for Orders</Switch>
            <div className="border-1 rounded">
                {orders.map((order) => {
                    return(
                        <Card key={order.id} className="border-3 rounded-sm border-black m-10 p-4" style={{backgroundColor: getColor(order.time)}}>
                            <h2>Order #{order.id}</h2>
                            <p>{order.name}</p>
                            <p>{order.phone}</p>
                            {order.orderItems.map((item: {id: number,text: string, price: Prisma.Decimal, orderId: number | null}) => {
                                return <p key={item.id}><span>{item.text}</span><span>{item.price.toFixed(2)}</span></p>
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