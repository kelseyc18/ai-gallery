// Action Types
export const UPDATE_PROJECTS = 'UPDATE_PROJECTS';
export const UPDATE_SELECTED_PROJECT = 'UPDATE_SELECTED_PROJECT';
export const UPDATE_PROJECT_DETAILS = 'UPDATE_PROJECT_DETAILS';
export const EDIT_PROJECT = 'EDIT_PROJECT';
export const CANCEL_EDIT_PROJECT = 'CANCEL_EDIT_PROJECT';

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

function postProjectDetails(title, id, description, tutorialUrl, credits) {
  return fetch('/api/project/edit', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      title,
      id,
      description,
      tutorialUrl,
      credits,
    }),
  })
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

function updateProjectDetailsAction(project) {
  return {
    type: UPDATE_PROJECT_DETAILS,
    project,
  };
}

export function editProject() {
  return {
    type: EDIT_PROJECT,
  };
}

export function cancelEditProject() {
  return {
    type: CANCEL_EDIT_PROJECT,
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

export function updateProjectDetails(title, id, description, tutorialUrl, credits) {
  return (dispatch) => {
    postProjectDetails(title, id, description, tutorialUrl, credits).then((project) => {
      dispatch(updateProjectDetailsAction(project));
    });
  };
}
