export function update(state, data) {
  state.authrozation.accessToken = data.accessToken;
  state.authrozation.refreshToken = data.refreshToken;
}
export function updateCurrentUserAsset(state, data) {
  state.user.assets[data.name] = data.value;
}
export function updateCurrentUser(state, data) {
  state.user = data;
}
export function setAuth(state, data) {
  state.isAuth = data;
}
