import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import * as Clipboard from 'expo-clipboard'
import { showError } from './toast/error';
import { showSuccess } from './toast/success';
import { EAN13Regex } from '@/constants';

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

export const copy = async (text: string) => {
  try {
    await Clipboard.setStringAsync(text)
    showSuccess('Copied!')
  } catch (error) {
    showError('Failed to copy!')
  }
}


export const needPendingState = async () => {
  await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()))
}

export const isStartWith = (word: string, startsWith: string) => {
  return word.toLowerCase().startsWith(startsWith.toLowerCase())
}




export const isValidEAN13 = (barcode: string) => {
  if (!barcode.startsWith('25') || !EAN13Regex.test(barcode)) return false

  let sum: number = 0
  for (let i = 0; i < 12; i++) {
    sum += i % 2 === 0 ? Number(barcode[i]) : Number(barcode[i]) * 3
  }

  const checkSum = (10 - (sum % 10)) % 10

  return checkSum === Number(barcode[12])
}

export const parseEAN13 = (barcode: string) => {
  return `${barcode.slice(2, 7)}`.replace("0", "9")
}
