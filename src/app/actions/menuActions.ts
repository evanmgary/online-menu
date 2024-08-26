"use server"
import {prisma} from "../client"
import "./jsonfix"

export async function getStoreId(){
    const store = await prisma.store.findFirst({
        
    })
    return store?.id
}


export async function createOrder(name: string, phone: string, email: string, orderItems: {text: string, price: number}[], storeId: number){
    const time = Date.now()
    
    const order = await prisma.order.create({
        data: {
            name: name,
            email: email, 
            phone: phone,
            time: time,
            store: {
                connect: {
                    id: storeId
                }
            },
            orderItems: {
                createMany: {
                    data: orderItems
                }
            }
        },
        include: {
            orderItems: true
        }
    })
    
}

export async function getData(storeId: number){
    const store = await prisma.store.findUnique({
        where: {
            id: storeId
        },
        include: {
            categories: {
                include: {
                    items: true
                }
            }
        }
    })

    return JSON.parse(JSON.stringify(store?.categories))
}
