import { mainDarkMode } from './preload'

declare global {
    interface Window {
        mainDarkMode: typeof mainDarkMode
    }
}