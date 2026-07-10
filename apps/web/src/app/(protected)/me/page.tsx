"use client";
import api from "@/lib/axiosClient"
import { useAuth } from "@/providers/AuthProvider";
import Image from "next/image";

export default function ProfilePage() {
    const {user} = useAuth();
    if (!user) {
        return <p>something wrong! Please try again later</p>
    }
    return (
        <div>
            <Image
                src={user?.avatar}
                width={200}
                height={200}
                alt="user avatar"
            />

            <h1>{user.name}</h1>
        </div>
    )

}