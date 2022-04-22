import { ref } from "vue";

export default function () {
  return {
    url: process.env.DEV ? "/api/" : process.env.URL ,
    hcaptcha: {
      sitekey: process.env.HCAPTCHA_SITEKEY
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
