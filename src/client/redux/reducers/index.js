import {
  UPDATE_PROJECTS,
  UPDATE_SELECTED_PROJECT,
  EDIT_PROJECT,
  CANCEL_EDIT_PROJECT,
  UPDATE_PROJECT_DETAILS,
  SELECT_PROFILE,
  APPEND_PROJECTS,
} from '../actions';

const initialState = {
  projects: [],
  projectsTotal: 0,
  selectedProject: null,
  inEditMode: false,
  selectedProfile: null,
};

export default function (state = initialState, action) {
  switch (action.type) {
    case UPDATE_PROJECTS:
      return {
        ...state,
        projects: action.projects,
        projectsTotal: action.total,
        selectedProject: null,
        inEditMode: false,
        selectedProfile: null,
      };
    case APPEND_PROJECTS:
      const newProjects = state.projects.slice(); // eslint-disable-line
      const BreakException = {}; // eslint-disable-line

      action.projects.forEach((project) => {
        try {
          newProjects.forEach((otherProject) => {
            if (otherProject._id === project._id) {
              throw BreakException;
            }
          });
          newProjects.push(project);
        } catch (e) {
          if (e !== BreakException) throw e;
        }
      });
      return {
        ...state,
        projects: newProjects,
        projectsTotal: action.total,
        selectedProject: null,
        inEditMode: false,
        selectedProfile: null,
      };
    case UPDATE_SELECTED_PROJECT:
      return {
        ...state,
        projects: [],
        projectsTotal: 0,
        selectedProject: action.project,
        inEditMode: false,
        selectedProfile: null,
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
