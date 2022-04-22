export function update(state, data) {
  state.authrozation.accessToken = data.accessToken;
  state.authrozation.refreshToken = data.refreshToken;
}
export function updateCurrentUser(state, data) {
  state.user = data;
}
export function setAuth(state, data) {
  state.isAuth = data;
}
