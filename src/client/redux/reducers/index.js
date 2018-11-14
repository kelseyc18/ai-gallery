import {
  UPDATE_PROJECTS,
  UPDATE_SELECTED_PROJECT,
  SELECT_ALL_TAGS,
  EDIT_PROJECT,
  CANCEL_EDIT_PROJECT,
  UPDATE_PROJECT_DETAILS,
  SELECT_PROFILE,
} from '../actions';

const initialState = {
  projects: [],
  selectedProject: null,
  inEditMode: false,
  selectedProfile: null,
  allTags: [],
};

export default function (state = initialState, action) {
  switch (action.type) {
    case UPDATE_PROJECTS:
      return {
        ...state,
        projects: action.projects,
        selectedProject: null,
        inEditMode: false,
        selectedProfile: null,
      };
    case UPDATE_SELECTED_PROJECT:
      return {
        ...state,
        projects: [],
        selectedProject: action.project,
        inEditMode: false,
        selectedProfile: null,
      };
    case SELECT_ALL_TAGS:
      return {
        ...state,
        allTags: action.allTags,
      };
    case EDIT_PROJECT:
      return {
        ...state,
        inEditMode: true,
      };
    case CANCEL_EDIT_PROJECT:
      return {
        ...state,
        inEditMode: false,
      };
    case UPDATE_PROJECT_DETAILS: {
      return {
        ...state,
        selectedProject: action.project,
        inEditMode: false,
      };
    }
    case SELECT_PROFILE: {
      return {
        ...state,
        selectedProfile: action.user,
      };
    }
    default:
      return state;
  }
}
