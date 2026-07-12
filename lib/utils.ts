import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const capitalizeFirstLetter = (str: string[]) => {
  return str.map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
}

export const splitWord = (str: string, separator: string) => {
  if (!str.includes(separator)) return [str];
  return str.split(separator)
}


export const saveOrder = (name: string = 'order') => {
  const current = new Date()
  const date = current.getDate()
  const month = (current.getMonth() + 1) < 10 ? `0${(current.getMonth() + 1)}` : (current.getMonth() + 1)
  const year = current.getFullYear()
  const hours = current.getHours()
  const min = current.getMinutes()
  const sec = current.getSeconds()

  const fileName = `${name}_${date}-${month}-${year}_${hours}:${min}:${sec}`
  console.log({ name, fileName })
}


