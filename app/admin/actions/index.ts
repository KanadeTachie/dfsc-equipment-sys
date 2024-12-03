"use server"

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { Equipment } from "../components/equipments/equipment-columns"
import useUser from "@/app/hook/useUser";
import { useQueryClient } from "@tanstack/react-query";





export async function createEquipment(dt: any) {
    const supbase = await createClient() 
    const result = await supbase.from("equipments").insert([dt]).single()
    revalidatePath("/admin")
    return JSON.stringify(result)
  }


export async function deleteEquipment(id:string) {
    const supbase = await createClient()
    await supbase.from('equipments').delete().eq("eq_id", id)
    revalidatePath("/admin")
}

export async function deleteIncident(id:number) {
    const supbase = await createClient()
    await supbase.from('incidentform').delete().eq("id", id)
    revalidatePath("/admin")
}

export async function verifyUser(id:string, isVerified:boolean, data:any) {
    // const { isFetching, data } = useUser();
    // const queryClient = useQueryClient();

    const supbase = await createClient()
    const result = await supbase.from('profiles').update({
        isVerified,
        age: (data?.age) ? data.age : null,
        jobtitle: (data?.jobtitle) ? data.jobtitle : null,
        degprog: (data?.degprog) ? data.degprog : null,
        sex: (data?.sex) ? data.sex : null,
        education: (data?.education) ? data.education : null,
        organization: (data?.organization) ? data.organization : null
    }).eq('id', id).single()
    revalidatePath("/admin")
    return JSON.stringify(result)
}







