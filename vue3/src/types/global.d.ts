import { ComponentCustomProperties } from "vue";
import request from "@/utils/request";

declare module "@vue/runtime-core" {
  interface ComponentCustomProperties {
    request: typeof request;
  }
}
