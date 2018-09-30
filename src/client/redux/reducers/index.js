import { UPDATE_PROJECTS, UPDATE_SELECTED_PROJECT } from '../actions';

const initialState = {
  projects: [],
  selectedProject: null,
};

export default function (state = initialState, action) {
  switch (action.type) {
    case UPDATE_PROJECTS:
      return { ...state, projects: action.projects, selectedProject: null };
    case UPDATE_SELECTED_PROJECT:
      return { ...state, projects: [], selectedProject: action.project };
    default:
      return state;
  }
}
