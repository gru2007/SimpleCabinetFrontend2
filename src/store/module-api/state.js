import { ref } from "vue";

export default function () {
  return {
    url: "https://mc-api.r-artemev.ru",
    hcaptcha: {
      sitekey: "b266dbb6-d8b2-4608-b076-dfaaefb68e9c"
    },
    authrozation: {
      accessToken: "",
      refreshToken: "",
      expire: 0
    },
    user: ref({}),
    isAuth: ref({}),
  }
}
