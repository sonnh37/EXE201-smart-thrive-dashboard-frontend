// OrderActions.tsx
"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { MoreHorizontal } from "lucide-react";
import Swal from "sweetalert2";
import axios from "axios";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Const } from "@/lib/const";
import { useQueryClient } from "@tanstack/react-query";

interface ActionsProps {
  id: string;
}

const Actions: React.FC<ActionsProps> = ({ id }) => {
  const router = useRouter();
  const queryClient = useQueryClient(); 

  const handleEditClick = () => {
    router.push(`/order/${id}`);
  };

  const handleOrdersClick = () => {
    router.push(`/order/${id}/photos`);
  };

  const handleDeleteClick = async () => {
    try {
      const response = await axios.delete(`${Const.API_ORDER}/${id}`);
      
      if (response.status === 200) {
        Swal.fire({
          title: "Success!",
          text: "Order deleted successfully.",
          icon: "success",
          confirmButtonText: "OK",
        });
        queryClient.invalidateQueries({ queryKey: ["data"] });
      }
    } catch (error) {
      console.error(`Failed to delete order with ID: ${id}`, error);

      Swal.fire({
        title: "Error!",
        text: "Failed to delete order. Please try again later.",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuItem onClick={() => navigator.clipboard.writeText(id)}>
          Copy model ID
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleOrdersClick}>
          View photos
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleEditClick}>Edit</DropdownMenuItem>
        <DropdownMenuItem onClick={handleDeleteClick}>Delete</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default Actions;
