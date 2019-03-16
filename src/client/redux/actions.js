// Action Types
export const UPDATE_PROJECTS = 'UPDATE_PROJECTS';
export const APPEND_PROJECTS = 'APPEND_PROJECTS';
export const UPDATE_SELECTED_PROJECT = 'UPDATE_SELECTED_PROJECT';
export const UPDATE_USERS = 'UPDATE_USERS';
export const APPEND_USERS = 'APPEND_USERS';
export const SELECT_ALL_TAGS = 'SELECT_ALL_TAGS';
export const UPDATE_PROJECT_DETAILS = 'UPDATE_PROJECT_DETAILS';
export const EDIT_PROJECT_OR_PROFILE = 'EDIT_PROJECT_OR_PROFILE';
export const CANCEL_EDIT_PROJECT_OR_PROFILE = 'CANCEL_EDIT_PROJECT_OR_PROFILE';
export const SELECT_PROFILE = 'SELECT_PROFILE';
export const LOGIN_AS_USER = 'LOGIN_AS_USER';

// Action Creators
function fetchProjects(offset, searchQuery, sortBy, followerId, selectedTagId) {
  let url = `/api/projects?offset=${offset}`;
  if (searchQuery) {
    url += `&q=${encodeURIComponent(searchQuery)}`;
  }
  if (sortBy) {
    url += `&sortBy=${sortBy}`;
  }
  if (followerId) {
    url += `&followerId=${followerId}`;
  }
  if (selectedTagId && selectedTagId > 0) {
    url += `&selectedTagId=${selectedTagId}`;
  }
  return fetch(url).then(res => res.json());
}

function fetchUsers(offset, searchQuery) {
  let url = `/api/user/search?offset=${offset}`;
  if (searchQuery) {
    url += `&q=${encodeURIComponent(searchQuery)}`;
  }
  return fetch(url).then(res => res.json());
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

function fetchFeaturedProjects(offset) {
  return fetch(`/api/project/featured?offset=${offset || 0}`).then(res => res.json());
}

function fetchUserByUsername(username) {
  return fetch(`/api/user/${username}`)
    .then(res => res.json())
    .then(res => res.user);
}

function fetchUser() {
  return fetch('/api/user/userInfo').then(res => res.json());
}

function fetchUserByUuid(uuid) {
  return fetch(`/api/user/uuid/${uuid}`)
    .then(res => res.json())
    .then(res => res.user);
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
  screenshots,
) {
  const formData = new FormData();

  if (title) formData.append('title', title);
  formData.append('id', id);
  if (description || description === '') formData.append('description', description);
  if (tutorialUrl || tutorialUrl === '') formData.append('tutorialUrl', tutorialUrl);
  if (credits || credits === '') formData.append('credits', credits);
  if (newImage) formData.append('newImage', newImage);
  formData.append('isDraft', isDraft);
  formData.append('tagIds', JSON.stringify(tagIds));

  const screenshotInfo = [];
  screenshots.forEach((screenshot) => {
    if (screenshot.file) {
      // Each append adds a new file to screenshotFiles field
      formData.append('screenshotFiles', screenshot.file);
      screenshotInfo.push({ src: '', file: true });
    } else {
      screenshotInfo.push(screenshot);
    }
  });
  formData.append('screenshots', JSON.stringify(screenshotInfo));

  return fetch('/api/project/edit', {
    method: 'POST',
    body: formData,
  })
    .then(res => res.json())
    .then(res => res.project);
}

function postUserProfile(id, name, bio, newImage, featuredProject) {
  const formData = new FormData();

  formData.append('id', id);
  if (name || name === '') formData.append('name', name);
  if (bio || bio === '') formData.append('bio', bio);
  if (newImage) formData.append('newImage', newImage);
  if (featuredProject) formData.append('featuredProjectId', featuredProject.id);

  return fetch('/api/user/edit', {
    method: 'POST',
    body: formData,
  }).then(res => res.json())
    .then(res => res.user);
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

function postUpdateFeaturedProject(projectId, featuredLabel) {
  return fetch('/api/project/set_featured_label', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ projectId, featuredLabel }),
  })
    .then(res => res.json())
    .then(res => res.project);
}

function postRemoveProject(projectId) {
  return fetch('/api/project/remove', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ projectId }),
  })
    .then(res => res.json())
    .then(res => res.count);
}

function postAddFollowing(followerId, followeeId) {
  return fetch('/api/user/add_following', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ followerId, followeeId }),
  })
    .then(res => res.json())
    .then(res => res.followee);
}

function postRemoveFollowing(followerId, followeeId) {
  return fetch('/api/user/remove_following', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ followerId, followeeId }),
  })
    .then(res => res.json())
    .then(res => res.followee);
}

function updateProjectsAction(projects, total, searchQuery, sortBy, selectedTag) {
  return {
    type: UPDATE_PROJECTS,
    projects,
    total,
    searchQuery,
    sortBy,
    selectedTag,
  };
}

function appendProjectsAction(projects, total, searchQuery, sortBy, selectedTag) {
  return {
    type: APPEND_PROJECTS,
    projects,
    total,
    searchQuery,
    sortBy,
    selectedTag,
  };
}

function updateUsersAction(users, total, searchQuery) {
  return {
    type: UPDATE_USERS,
    users,
    total,
    searchQuery,
  };
}

function appendUsersAction(users, total, searchQuery) {
  return {
    type: APPEND_USERS,
    users,
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
  return {
    type: SELECT_PROFILE,
    user,
  };
}

export function editProjectOrProfile() {
  return {
    type: EDIT_PROJECT_OR_PROFILE,
  };
}

export function cancelEditProjectOrProfile() {
  return {
    type: CANCEL_EDIT_PROJECT_OR_PROFILE,
  };
}

export function getProjects(offset, searchQuery, sortBy, followerId, selectedTag) {
  return (dispatch) => {
    fetchProjects(offset, searchQuery, sortBy, followerId, selectedTag && selectedTag.id)
      .then((res) => {
        if (res.offset === 0) {
          dispatch(updateProjectsAction(
            res.projects, res.total, searchQuery, res.sortBy, selectedTag,
          ));
        } else {
          dispatch(appendProjectsAction(res.projects, res.total, searchQuery, res.sortBy, selectedTag));
        }
      });
  };
}

export function getUsers(offset, searchQuery) {
  return (dispatch) => {
    fetchUsers(offset, searchQuery).then((res) => {
      if (res.offset === 0) {
        dispatch(updateUsersAction(res.users, res.total, searchQuery));
      } else {
        dispatch(appendUsersAction(res.users, res.total, searchQuery));
      }
    });
  };
}

export function getProjectById(id) {
  return (dispatch) => {
    fetchProjectById(id).then(project => dispatch(updateSelectedProjectAction(project)));
  };
}

export function getAllTags() {
  return dispatch => fetchAllTags().then(allTags => dispatch(selectAllTagsAction(allTags)));
}

export function getFeaturedProjects(offset) {
  return dispatch => fetchFeaturedProjects(offset).then((res) => {
    if (res.offset === 0) {
      dispatch(updateProjectsAction(res.projects, res.total));
    } else {
      dispatch(appendProjectsAction(res.projects, res.total));
    }
  });
}

export function getUserByUsername(username) {
  return (dispatch) => {
    fetchUserByUsername(username).then((user) => {
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
  screenshots,
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
      screenshots,
    ).then((project) => {
      dispatch(updateProjectDetailsAction(project));
    });
  };
}

function loginAsUser(user, cookie, isAdmin, isReadOnly) {
  return {
    type: LOGIN_AS_USER,
    user,
    cookie,
    isAdmin,
    isReadOnly,
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

export function loginAsUserWithUUID(uuid) {
  return (dispatch) => {
    fetchUserByUuid(uuid).then((user) => {
      dispatch(loginAsUser(user));
    });
  };
}

export function loginAsUserWithCookie(cookie) {
  return (dispatch) => {
    fetchUser().then(({ user, userInfo }) => {
      if (user && userInfo) {
        dispatch(loginAsUser(user, cookie, userInfo.isAdmin, userInfo.isReadOnly));
      }
    });
  };
}

export function logoutUser() {
  return (dispatch) => {
    dispatch(loginAsUser(undefined, undefined, false, false));
  };
}

export function updateFeaturedProject(projectId, featuredLabel) {
  return (dispatch) => {
    postUpdateFeaturedProject(projectId, featuredLabel).then((project) => {
      dispatch(updateSelectedProjectAction(project));
    });
  };
}

export function removeProject(projectId) {
  return (dispatch) => {
    postRemoveProject(projectId).then((count) => {
      if (count > 0) dispatch(updateSelectedProjectAction(null));
    });
  };
}

export function addUserFollowing(followerId, followeeId) {
  return (dispatch) => {
    postAddFollowing(followerId, followeeId).then((followee) => {
      dispatch(selectProfileAction(followee));
    });
  };
}

export function removeUserFollowing(followerId, followeeId) {
  return (dispatch) => {
    postRemoveFollowing(followerId, followeeId).then((followee) => {
      dispatch(selectProfileAction(followee));
    });
  };
}

export function updateUserProfile(id, name, bio, newImage, featuredProject) {
  return (dispatch) => {
    postUserProfile(id, name, bio, newImage, featuredProject).then((user) => {
      dispatch(selectProfileAction(user));
    });
  };
}
