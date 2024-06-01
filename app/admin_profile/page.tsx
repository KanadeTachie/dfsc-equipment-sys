import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"



const admin_profile = () => {
    return ( 
        <div className="bg-gray-100 min-h-screen flex flex-col sm:flex-row justify-center items-center gap-8">
        <div className="bg-white p-8 rounded-lg shadow-md w-96 flex flex-col">
            <div className="flex flex-col items-center">
                <Avatar className="w-24 h-24 rounded-full mx-auto mb-2">
                    <AvatarImage src="userimg.png"/>
                </Avatar>
                <Badge className="mb-2 bg-green-700">Verified</Badge>
            </div>
            <div className="text-center mt-4">
                <h1 className="text-l font-semibold">Dann Marie del Mundo</h1>
                <p className="text-gray-600 text-sm">Name</p>
                <p className="text-l font-semibold mt-4">cmiscroscope@up.edu.ph</p>
                <p className="text-gray-600 text-sm">Email</p>
                <p className="font-semibold mt-4">2024-001</p>
                <p className="text-gray-600 text-sm">Admin ID</p>
            </div>
            <div className="flex flex-col items-center justify-center mt-8">
                <Link href="/admin_incident"><Button className="px-10 w-60 up-primary-red">Manage Incidents</Button></Link>                   
                <Link href="/admin"><Button className="px-10 w-60 mt-4 up-primary-red">Update Inventory and Users</Button></Link>
            </div>
        </div>

    </div>
     );
};
export default admin_profile