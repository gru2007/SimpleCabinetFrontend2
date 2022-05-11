export async function request(context, data) {
    var response = await fetch(context.state.url + data.url, {
      "method": data.method,
      "body": data.body ? JSON.stringify(data.body): undefined,
      "headers": {
        "Content-Type": "application/json",
        "Authorization": data.token ? data.token : ( context.state.authrozation.accessToken ? "Bearer "+context.state.authrozation.accessToken : undefined )
      }
    })
    var body = await response.text()
    var obj = null;
    if(body.length > 0) {
      obj = JSON.parse(body)
    }
    return {
      data: obj,
      ok: response.ok,
      code: response.status
    }
}
export async function setup(context, data) {
  var data = localStorage.getItem("session");
  if(data) {
    data = JSON.parse(data)
    context.commit("update", data)
    context.dispatch("request", {
      "url": "auth/userinfo",
      "method": "GET"
    }).then((x) => {
       if(x.ok) {
        context.commit("updateCurrentUser", x.data)
        context.commit("setAuth", true)
       } else if(x.code == 403) {
        context.dispatch("request", {
         "url": "auth/refresh",
         "method": "POST",
         "body": {
           "refreshToken": data.refreshToken
         }
       }).then((i) => {
         if(i.ok) {
          localStorage.setItem("session", JSON.stringify(i.data))
          context.commit("update", i)
          context.dispatch("request", {
            "url": "auth/userinfo",
            "method": "GET"
          }).then((y) => {
            if(y.ok) {
              context.commit("updateCurrentUser", y.data)
              context.commit("setAuth", true)
            } else {
              context.commit("setAuth", false)
            }
          }).catch((y) => {
            context.commit("setAuth", false)
          })
         }
       })
       } else {
         context.commit("setAuth", false)
       }
    }).catch((x) => {
         context.commit("setAuth", false)
    })
  } else {
    context.commit("setAuth", false)
  }
}
