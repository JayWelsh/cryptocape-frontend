interface ILoadingProgress {
  type: string;
  loadingProgress: number;
}
const loadingProgress = (state = 0, action: ILoadingProgress) => {
  switch (action.type) {
      case 'SET_LOADING_PROGRESS':
          return action.loadingProgress
      default:
          return state
  }
}

export default loadingProgress;