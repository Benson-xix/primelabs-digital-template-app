"use client";

import {
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@radix-ui/react-dropdown-menu";
import { Button } from "./ui/button";
import { DropdownMenu, DropdownMenuTrigger } from "./ui/dropdown-menu";

import { LogOut } from "lucide-react";
import { User } from "@/payload-types";
import Link from "next/link";
import { useAuth } from "@/hooks/use-auth";

interface UserAccountNavProps {
  user: User | null;
}

const UserAccountNav: React.FC<UserAccountNavProps> = ({ user }) => {
  const { signOut } = useAuth();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild className="overflow-visible">
        <Button variant="ghost" size="sm" className="relative">
          My Account
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        className="bg-blue-900 text-white rounded-md px-3 py-3 flex flex-col md:w-[300px] w-[500px] gap-3 h-[230px]  "
        align="end"
      >
        <div className="flex items-center justify-start gap-2 p-2">
          <div className="flex flex-col  space-y-0.5 gap-3  leading-none">
            <p className="font-medium text-sm capitalize text-white ">{user?.email}</p>
            <p className="font-medium text-sm text-white ">{user?.role}</p>
            <DropdownMenuSeparator />

            <DropdownMenuItem asChild>
              <Link href="/dashboard">Dashboard</Link>
            </DropdownMenuItem>

            <DropdownMenuSeparator />
            <DropdownMenuSeparator />

            <DropdownMenuItem asChild>
              <Button
                variant="destructive"
                onClick={signOut}
                type="button"
                className="w-1/4"
              >
                <LogOut />
              </Button>
            </DropdownMenuItem>
          </div>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserAccountNav;
