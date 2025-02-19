import { buildConfig } from "payload/config";
import {mongooseAdapter} from "@payloadcms/db-mongodb"
import { slateEditor } from "@payloadcms/richtext-slate";
import {webpackBundler} from '@payloadcms/bundler-webpack'
import path from "path";
import { Users } from "./collections/Users";
import dotenv from 'dotenv';
import { Products } from "./collections/Products/Product";
import { Media } from "./collections/Media";
import { ProductFiles } from "./collections/ProductFile";
import { Orders } from "./collections/Orders";
import { Reviews } from "./collections/Reviews";




dotenv.config({
  path: path.resolve(__dirname, '../.env'),
})

export default buildConfig({
  serverURL: process.env.NEXT_PUBLIC_SERVER_URL || "",
  collections: [Users, Products, Media, ProductFiles, Orders, Reviews ],
  routes: {
    admin: "/dashboard",
  },
  admin: {
    user: "users",
    bundler: webpackBundler(),
    meta: {
        titleSuffix: "- QodeByte Digial World",
        favicon: "/QODEBYTE.png",
        ogImage: '/QODEBYTE.png'
    },
  },
  rateLimit: {
    max: 2000,
  },
  editor: slateEditor({}),
  db: mongooseAdapter({
    url: process.env.MONGODB_URL!
  }),
  typescript: {
    outputFile: path.resolve(__dirname, 'payload-types.ts')
  },
   webpack: (config) => {  // <--- webpack config is HERE, inside buildConfig
        return {
            ...config,
            resolve: {
                fallback: {
                    "stream": require.resolve("stream-browserify"),
                    "url": require.resolve("url"),
                    "querystring": require.resolve("querystring"),
                    "path": require.resolve("path"),
                    "fs": false, // Or require.resolve("fs") if absolutely needed
                },
            },
        };
    },
});
