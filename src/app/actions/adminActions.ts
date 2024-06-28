"use server"
import prisma from "../client";


export async function createCategory(name: string, storeId: number){
    const category = await prisma.category.create({
        data: {
            name: name,
            store: {
                connect: {
                    id: storeId
                }
            }
        }
    })
}


export async function createItem(name: string, code: string, desc: string, basePrice: number, options: [{text: string, price: number}], categoryId: number){
    const item = await prisma.item.create({
        data: {
            name: name,
            code: code,
            desc: desc,
            basePrice: basePrice,
            options: options,
            category: {
                connect: {
                    id: categoryId
                }
            }
        }
    })
}


export async function updateCategory(categoryId: number, name: string){
    const category = await prisma.category.update({
        where: {
            id: categoryId
        },
        data: {
            name: name
        }
    })
}


export async function updateItem(name: string, code: string, desc: string, basePrice: number, options: [{text: string, price: number}], itemId: number){
    const item = await prisma.item.update({
        where: {
            id: itemId
        },
        data: {
            name: name,
            code: code,
            desc: desc,
            basePrice: basePrice,
            options: options,
        }
    })
}


export async function deleteCategory(categoryId: number){
    const deleteItems = prisma.item.deleteMany({
        where: {
            categoryId : categoryId
        }
    })

    const deleteCategory = prisma.category.delete({
        where: {
            id : categoryId
        }
    })
    const transaction = await prisma.$transaction([deleteItems, deleteCategory])
}


export async function deleteItem(itemId: number){
    const deleteItem = await prisma.item.delete({
        where: {
            id: itemId
        }
    })
}

export async function getData(storeId: number){
    "use server"
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

    return store?.categories
}


