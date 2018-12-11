// Action Types
export const UPDATE_PROJECTS = 'UPDATE_PROJECTS';
export const APPEND_PROJECTS = 'APPEND_PROJECTS';
export const UPDATE_SELECTED_PROJECT = 'UPDATE_SELECTED_PROJECT';
export const SELECT_ALL_TAGS = 'SELECT_ALL_TAGS';
export const UPDATE_PROJECT_DETAILS = 'UPDATE_PROJECT_DETAILS';
export const EDIT_PROJECT = 'EDIT_PROJECT';
export const CANCEL_EDIT_PROJECT = 'CANCEL_EDIT_PROJECT';
export const SELECT_PROFILE = 'SELECT_PROFILE';
export const LOGIN_AS_USER = 'LOGIN_AS_USER';

// Action Creators
function fetchProjects(offset, searchQuery) {
  if (searchQuery) {
    return fetch(`/api/projects?offset=${offset}&q=${encodeURIComponent(searchQuery)}`).then(res => res.json());
  }
  return fetch(`/api/projects?offset=${offset}`).then(res => res.json());
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
  console.log(`about to fetch /api/user/${username}`);
  return fetch(`/api/user/${username}`)
    .then(res => res.json())
    .then((res) => {
      console.log(res);
      return res.user;
    });
}

function postProjectDetails(
  title,
  id,
  description,
  tutorialUrl,
  credits,
  newImage,
  isDraft,
  tagIds,
) {
  const formData = new FormData();

  if (title) formData.append('title', title);
  if (id) formData.append('id', id);
  if (description) formData.append('description', description);
  if (tutorialUrl) formData.append('tutorialUrl', tutorialUrl);
  if (credits) formData.append('credits', credits);
  if (newImage) formData.append('newImage', newImage);
  formData.append('isDraft', isDraft);
  if (tagIds) formData.append('tagIds', JSON.stringify(tagIds));

  return fetch('/api/project/edit', {
    method: 'POST',
    body: formData,
  })
    .then(res => res.json())
    .then(res => res.project);
}

function postAddDownload(id) {
  return fetch(`/api/project/download/${id}`, {
    method: 'POST',
  })
    .then(res => res.json())
    .then(res => res.project);
}

function postAddFavorite(projectId, userId) {
  return fetch('/api/project/add_favorite', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ projectId, userId }),
  })
    .then(res => res.json())
    .then(res => res.project);
}

function postRemoveFavorite(projectId, userId) {
  return fetch('/api/project/remove_favorite', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ projectId, userId }),
  })
    .then(res => res.json())
    .then(res => res.project);
}

function updateProjectsAction(projects, total, searchQuery) {
  return {
    type: UPDATE_PROJECTS,
    projects,
    total,
    searchQuery,
  };
}

function appendProjectsAction(projects, total, searchQuery) {
  return {
    type: APPEND_PROJECTS,
    projects,
    total,
    searchQuery,
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
  console.log('new user', user);
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

export function getProjects(offset, searchQuery) {
  return dispatch => fetchProjects(offset, searchQuery).then((res) => {
    if (res.offset === 0) {
      dispatch(updateProjectsAction(res.projects, res.total, searchQuery));
    } else {
      dispatch(appendProjectsAction(res.projects, res.total, searchQuery));
    }
  });
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
  console.log('getUserByUsername', username);
  return (dispatch) => {
    console.log('dispatching');
    fetchUserByUsername(username).then((user) => {
      console.log(user);
      dispatch(selectProfileAction(user));
    });
  };
}

export function getUserProjects(username) {
  return (dispatch) => {
    fetchUserByUsername(username).then(user => dispatch(updateProjectsAction(user.projects, user.projects.length, '')));
  };
}

export function getUserFavoriteProjects(username) {
  return (dispatch) => {
    fetchUserByUsername(username).then(user => dispatch(updateProjectsAction(user.FavoriteProjects, user.FavoriteProjects.length, '')));
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
  tagIds,
) {
  return (dispatch) => {
    postProjectDetails(
      title,
      id,
      description,
      tutorialUrl,
      credits,
      newImage,
      isDraft,
      tagIds,
    ).then((project) => {
      dispatch(updateProjectDetailsAction(project));
    });
  };
}

export function loginAsUser(userId) {
  return {
    type: LOGIN_AS_USER,
    userId,
  };
}

export function incrementDownloadCount(id) {
  return (dispatch) => {
    postAddDownload(id).then(project => dispatch(updateSelectedProjectAction(project)));
  };
}

export function addFavorite(projectId, userId) {
  return (dispatch) => {
    postAddFavorite(projectId, userId).then((project) => {
      dispatch(updateSelectedProjectAction(project));
    });
  };
}

export function removeFavorite(projectId, userId) {
  return (dispatch) => {
    postRemoveFavorite(projectId, userId).then((project) => {
      dispatch(updateSelectedProjectAction(project));
    });
  };
}
