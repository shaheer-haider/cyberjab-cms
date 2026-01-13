import {
  UsernamePasswordAuthJSProvider,
  TinaUserCollection,
} from "tinacms-authjs/dist/tinacms";
import { defineConfig, LocalAuthProvider } from "tinacms";

import { PageCollection } from "./collections/page";
import Instructor from "./collections/instructor";
import Lab from "./collections/lab";
import Lesson from "./collections/lesson";
import Module from "./collections/module";
import Skill from "./collections/skill";
import Topic from "./collections/topic";
import Track from "./collections/track";

const isLocal = process.env.TINA_PUBLIC_IS_LOCAL === "true";

export default defineConfig({
  authProvider: isLocal
    ? new LocalAuthProvider()
    : new UsernamePasswordAuthJSProvider(),
  contentApiUrlOverride: process.env.NEXT_PUBLIC_TINA_URL || "/api/tina/gql",
  build: {
    publicFolder: "public",
    outputFolder: "admin",
  },
  media: {
    tina: {
      mediaRoot: "",
      publicFolder: "public",
      static: true,
    },
  },
  schema: {
    collections: [
      TinaUserCollection,
      PageCollection,
      Instructor,
      Lab,
      Lesson,
      Module,
      Skill,
      Topic,
      Track,
    ],
  },
});
