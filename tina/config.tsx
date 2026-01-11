import { defineConfig } from "tinacms";
import nextConfig from '../next.config'

// Core Collections
import Page from "./collection/page";
import Author from "./collection/author";
import Tag from "./collection/tag";

// LMS Collections
import Instructor from "./collection/instructor";
import Topic from "./collection/topic";
import Skill from "./collection/skill";
import Module from "./collection/module";
import Lesson from "./collection/lesson";
import Lab from "./collection/lab";
import Track from "./collection/track";

const config = defineConfig({
  clientId: process.env.NEXT_PUBLIC_TINA_CLIENT_ID!,
  branch:
    process.env.NEXT_PUBLIC_TINA_BRANCH! || // custom branch env override
    process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_REF! || // Vercel branch env
    process.env.HEAD!, // Netlify branch env
  token: process.env.TINA_TOKEN!,
  media: {
    // If you wanted cloudinary do this
    // loadCustomStore: async () => {
    //   const pack = await import("next-tinacms-cloudinary");
    //   return pack.TinaCloudCloudinaryMediaStore;
    // },
    // this is the config for the tina cloud media store
    tina: {
      publicFolder: "public",
      mediaRoot: "uploads",
    },
  },
  build: {
    publicFolder: "public", // The public asset folder for your framework
    outputFolder: "admin", // within the public folder
    basePath: nextConfig.basePath?.replace(/^\//, '') || '', // The base path of the app (could be /blog)
  },
  schema: {
    collections: [
      Page,
      Author,
      Tag,
      Instructor,
      Topic,
      Skill,
      Module,
      Lesson,
      Lab,
      Track,
    ],
  },
});

export default config;
