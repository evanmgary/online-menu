"use client"
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch"
import { useState, useEffect, useRef } from "react"
import { getOrders, deleteOrder } from "../actions/orderActions"


export default function Page(){

    const [listening, setListening] = useState<boolean>(false)
    const [orders, setOrders] = useState<Array<any>>([])
    const [completedOrders, setCompletedOrders] = useState<Array<any>>([])
    const timer = useRef<NodeJS.Timer>()
    const [time, setTime] = useState(Date.now())

    useEffect(() => {
        timer.current = setInterval(timerFunc, 1000)
    }, [])
    
    function timerFunc(){
        setTime(Date.now())
    }

    function getColor(startTime: number){
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

    return(
        <div>
            <h1>Order Tracking</h1>
            <Switch checked={listening} onCheckedChange={() => setListening(!listening)} className="flex items-center space-x-2">Listen for Orders</Switch>
            <div className="border-1 rounded">
                {orders.map((order) => {
                    return(
                        <Card key={order.id} className="border-3 rounded-sm border-black m-10 p-4" style={{backgroundColor: getColor(order.time)}}>
                            <h2>Order #{order.id}</h2>
                            <p>{order.name}</p>
                            <p>{order.phone}</p>
                            {order.items.map((item: {text: string, price: number}) => {
                                <p><span>{item.text}</span><span>{item.price}</span></p>
                            })}
                            <h3>${order.price}</h3>
                            <Button>Complete Order</Button>
                        </Card>
                    )
                })}
            </div>
        </div>
    )
}