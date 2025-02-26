import {dirname} from "path";
import {fileURLToPath} from "url";

const currentDir = dirname(fileURLToPath(import.meta.url))


export default defineNuxtConfig({
    future: {
        compatibilityVersion: 4,
    },
    modules: [
        '@nuxtjs/tailwindcss',
        'shadcn-nuxt'
    ],
    tailwindcss: {
        viewer: false,
        cssPath: `${currentDir}/assets/css/tailwind.css`,
    },
    colorMode: {
        classSuffix: ''
    },
    shadcn: {
        /**
         * Prefix for all the imported component
         */
        prefix: '',
        /**
         * Directory that the component lives in.
         * @default "./components/ui"
         */
        componentDir: `${currentDir}/components`,
    }
})