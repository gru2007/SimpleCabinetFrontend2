export function isAdmin (state) {
  if(!state.user || !state.user.groups) {
    return false;
  }
  for(var index in state.user.groups) {
    if(state.user.groups[index].groupName == "ADMIN") {
      return true;
    }
  }
  return false;
}
