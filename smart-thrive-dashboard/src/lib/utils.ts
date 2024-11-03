import {type ClassValue, clsx} from "clsx"
import {twMerge} from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export function getEnumOptions(enumObject: any) {
    return Object.keys(enumObject)
      .filter((key) => isNaN(Number(key))) // Lọc để chỉ lấy tên (không lấy số index)
      .map((key) => ({
        label: key,
        value: enumObject[key].toString(),
      }));
  }
  