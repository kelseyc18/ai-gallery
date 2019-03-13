import {
  UPDATE_PROJECTS,
  UPDATE_SELECTED_PROJECT,
  SELECT_ALL_TAGS,
  EDIT_PROJECT_OR_PROFILE,
  CANCEL_EDIT_PROJECT_OR_PROFILE,
  UPDATE_PROJECT_DETAILS,
  SELECT_PROFILE,
  APPEND_PROJECTS,
  LOGIN_AS_USER,
  UPDATE_USERS,
  APPEND_USERS,
} from '../actions';

const initialState = {
  projects: [],
  projectsTotal: 0,
  searchQuery: null,
  projectsSortBy: '',
  users: [],
  usersTotal: 0,
  selectedTag: undefined,
  selectedProject: null,
  inEditMode: false,
  selectedProfile: null,
  allTags: [],
  loggedInUser: undefined,
  cookie: undefined,
  isAdmin: false,
  isReadOnly: false,
};

const BreakException = {}; // eslint-disable-line

export default function (state = initialState, action) {
  switch (action.type) {
    case UPDATE_PROJECTS:
      return {
        ...state,
        projects: action.projects,
        projectsTotal: action.total,
        projectsSortBy: action.sortBy,
        selectedTag: action.selectedTag,
        searchQuery: action.searchQuery,
        selectedProject: null,
        inEditMode: false,
        selectedProfile: null,
      };
    case APPEND_PROJECTS:
      if (state.searchQuery !== action.searchQuery) {
        return state;
      }

      const newProjects = state.projects.slice(); // eslint-disable-line

      action.projects.forEach((project) => {
        try {
          newProjects.forEach((otherProject) => {
            if (otherProject.id === project.id) {
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
        searchQuery: action.searchQuery,
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
        users: [],
      };
    case UPDATE_USERS:
      return {
        ...state,
        users: action.users,
        usersTotal: action.total,
      };
    case APPEND_USERS:
      const newUsers = state.users.slice(); // eslint-disable-line

      action.users.forEach((user) => {
        try {
          newUsers.forEach((otherUser) => {
            if (otherUser.id === user.id) {
              throw BreakException;
            }
          });
          newUsers.push(user);
        } catch (e) {
          if (e !== BreakException) throw e;
        }
      });
      return {
        ...state,
        users: newUsers,
        usersTotal: action.total,
      };
    case SELECT_ALL_TAGS:
      return {
        ...state,
        allTags: action.allTags,
      };
    case EDIT_PROJECT_OR_PROFILE:
      return {
        ...state,
        inEditMode: true,
      };
    case CANCEL_EDIT_PROJECT_OR_PROFILE:
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
        inEditMode: false,
      };
    }
    case LOGIN_AS_USER: {
      return {
        ...state,
        loggedInUser: action.user,
        isAdmin: action.isAdmin,
        isReadOnly: action.isReadOnly,
      };
    }
    default:
      return state;
  }
}
