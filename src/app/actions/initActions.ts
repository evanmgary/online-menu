"use server"
import {prisma} from "../client"

export async function initializeDB(name: string){
    const store = await prisma.store.create({
        data:{
            name: name,
        }
    }
    )
}