"use server"
import prisma from "../client";


export async function getOrders(storeId: number){
    const store = await prisma.store.findUnique({
        where: {
            id: storeId
        },
        include: {
            currentOrders: true
        }
    })
    return store?.currentOrders
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