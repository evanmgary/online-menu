"use client"
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import prisma from "../client";
import { initializeDB } from "../actions/initActions"

export default function Page(){

    function initDB(){
        const name = (document.getElementById("store-name") as HTMLInputElement).value
        initializeDB(name)
    }
    
    return(
        <div>
            <Input id="store-name" type="text" placeholder="Store Name"></Input>
            <Button onClick={initDB}>Initialize DB</Button>
        </div>
    )
}