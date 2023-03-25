import { ref } from "vue";

export default function () {
  return {
    url: process.env.DEV ? "/api/" : process.env.URL,
    recaptcha: {
      sitekey: process.env.RECAPTCHA_SITEKEY
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
