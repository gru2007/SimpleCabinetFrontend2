export async function request(context, data) {
    var response = await fetch(context.state.url + data.url, {
      "method": data.method,
      "body": data.body ? JSON.stringify(data.body): undefined,
      "headers": {
        "Content-Type": "application/json"
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
    context.commit("update", JSON.parse(data))
    context.dispatch("request", {
      "url": "auth/userinfo",
      "method": "GET"
    }).then((x) => {
       context.commit("updateCurrentUser", x.data)
       context.commit("setAuth", true)
    }).catch((x) => {
       context.commit("setAuth", false)
    })
  } else {
    context.commit("setAuth", false)
  }
}
