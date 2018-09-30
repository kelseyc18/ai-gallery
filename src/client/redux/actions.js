// Action Types
export const UPDATE_PROJECTS = 'UPDATE_PROJECTS';
export const UPDATE_SELECTED_PROJECT = 'UPDATE_SELECTED_PROJECT';

// Action Creators
function fetchProjects() {
  return fetch('/api/projects')
    .then(res => res.json())
    .then(res => res.projects);
}

function fetchProjectById(id) {
  return fetch(`/api/project/${id}`)
    .then(res => res.json())
    .then(res => res.project);
}

function updateProjectsAction(projects) {
  return {
    type: UPDATE_PROJECTS,
    projects,
  };
}

function updateSelectedProjectAction(project) {
  return {
    type: UPDATE_SELECTED_PROJECT,
    project,
  };
}

export function getProjects() {
  return dispatch => fetchProjects().then(projects => dispatch(updateProjectsAction(projects)));
}

export function getProjectById(id) {
  return (dispatch) => {
    fetchProjectById(id).then(project => dispatch(updateSelectedProjectAction(project)));
  };
}
