"use client"
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import prisma from "../client";

export default function Page(){

    async function initializeDB(){
        "use server"
        const name = (document.getElementById("store-text") as HTMLInputElement).value
        const store = await prisma.store.create({
            data:{
                name: name,
            }
        }
        )
    }
    return(
        <div>
            <Input id="store-name" type="text" placeholder="Store Name"></Input>
            <Button onClick={initializeDB}>Initialize DB</Button>
        </div>
    )
}