"use server"
import {prisma} from "../client";
import "./jsonfix"

export async function getStoreId(){
    const store = await prisma.store.findFirst({
        include: {
            currentOrders: true
        }
    })
    return store?.id
}

export async function getOrders(storeId: number){
    const store = await prisma.store.findUnique({
        where: {
            id: storeId
        },
        include: {
            currentOrders: {
                include: {
                    orderItems: true
                }
            }
        }
    })
    
    
    return JSON.parse(JSON.stringify(store?.currentOrders))
}

export async function deleteOrder(orderId: number, storeId: number){
    const disconnect = await prisma.store.update({
        where: {
            id: storeId
        },
        data: {
            currentOrders: {
                disconnect: {
                    id: orderId
                }
            }
        }

    })
}