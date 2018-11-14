// Action Types
export const UPDATE_PROJECTS = 'UPDATE_PROJECTS';
export const UPDATE_SELECTED_PROJECT = 'UPDATE_SELECTED_PROJECT';
export const SELECT_ALL_TAGS = 'SELECT_ALL_TAGS';
export const UPDATE_PROJECT_DETAILS = 'UPDATE_PROJECT_DETAILS';
export const EDIT_PROJECT = 'EDIT_PROJECT';
export const CANCEL_EDIT_PROJECT = 'CANCEL_EDIT_PROJECT';
export const SELECT_PROFILE = 'SELECT_PROFILE';

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

function fetchAllTags() {
  return fetch('/api/project/alltags')
    .then(res => res.json())
    .then(res => res.allTags);
}

function fetchUserByUsername(username) {
  return fetch(`/api/user/${username}`)
    .then(res => res.json())
    .then(res => res.user);
}

function postProjectDetails(title, id, description, tutorialUrl, credits, newImage, isDraft, tags) {
  const formData = new FormData();

  if (title) formData.append('title', title);
  if (id) formData.append('id', id);
  if (description) formData.append('description', description);
  if (tutorialUrl) formData.append('tutorialUrl', tutorialUrl);
  if (credits) formData.append('credits', credits);
  if (newImage) formData.append('newImage', newImage);
  formData.append('isDraft', isDraft);
  if (tags) formData.append('tags', JSON.stringify(tags));

  return fetch('/api/project/edit', {
    method: 'POST',
    body: formData,
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

function selectAllTagsAction(allTags) {
  return {
    type: SELECT_ALL_TAGS,
    allTags,
  };
}

function updateProjectDetailsAction(project) {
  return {
    type: UPDATE_PROJECT_DETAILS,
    project,
  };
}

function selectProfileAction(user) {
  return {
    type: SELECT_PROFILE,
    user,
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

export function getAllTags() {
  return dispatch => fetchAllTags().then(allTags => dispatch(selectAllTagsAction(allTags)));
}

export function getUserByUsername(username) {
  return (dispatch) => {
    fetchUserByUsername(username).then(user => dispatch(selectProfileAction(user)));
  };
}

export function updateProjectDetails(
  title,
  id,
  description,
  tutorialUrl,
  credits,
  newImage,
  isDraft,
  tags,
) {
  return (dispatch) => {
    postProjectDetails(title, id, description, tutorialUrl, credits, newImage, isDraft, tags).then(
      (project) => {
        dispatch(updateProjectDetailsAction(project));
      },
    );
  };
}
