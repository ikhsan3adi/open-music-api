const autoBind = require('auto-bind');

class PlaylistsHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    autoBind(this);
  }

  async postPlaylistHandler(request, h) {
    this._validator.validatePlaylistPayload(request.payload);

    const { name = '' } = request.payload;
    const { id: credentialId } = request.auth.credentials;

    const playlistId = await this._service.addPlaylist({ name, owner: credentialId });

    const response = h.response({
      status: 'success',
      message: 'Playlist berhasil ditambahkan',
      data: {
        playlistId,
      },
    });
    response.code(201);
    return response;
  }

  async getPlaylistsHandler(request, h) {
    const { id: credentialId } = request.auth.credentials;

    const { playlists, source } = await this._service.getPlaylists(credentialId);

    const response = h.response({
      status: 'success',
      data: {
        playlists,
      },
    });

    response.header('X-Data-Source', source);
    response.code(200);

    return response;
  }

  async deletePlaylistByIdHandler(request) {
    const { id } = request.params;
    const { id: credentialId } = request.auth.credentials;

    await this._service.verifyPlaylistOwner(id, credentialId);
    await this._service.deletePlaylistById(id);

    return {
      status: 'success',
      message: 'Playlist berhasil dihapus',
    };
  }

  async postPlaylistSongHandler(request, h) {
    this._validator.validatePlaylistSongPayload(request.payload);
    const { songId } = request.payload;

    const { id: playlistId } = request.params;
    const { id: credentialId } = request.auth.credentials;

    await this._service.verifyPlaylistAccess(playlistId, credentialId);
    await this._service.addPlaylistSong(playlistId, songId);

    const activities = {
      playlistId,
      songId,
      userId: credentialId,
      action: 'add',
      time: new Date().toISOString(),
    };

    await this._service.addPlaylistActivities(activities);

    const response = h.response({
      status: 'success',
      message: 'Playlist berhasil ditambahkan',
    });
    response.code(201);
    return response;
  }

  async getPlaylistSongsHandler(request, h) {
    const { id: playlistId } = request.params;
    const { id: credentialId } = request.auth.credentials;

    await this._service.verifyPlaylistAccess(playlistId, credentialId);

    const {
      playlistWithSongs,
      source,
    } = await this._service.getPlaylistSongsByPlaylistId(playlistId);

    const response = h.response({
      status: 'success',
      data: {
        playlist: playlistWithSongs,
      },
    });

    response.header('X-Data-Source', source);
    response.code(200);

    return response;
  }

  async deletePlaylistSongByIdHandler(request) {
    this._validator.validatePlaylistSongPayload(request.payload);
    const { songId } = request.payload;

    const { id: playlistId } = request.params;
    const { id: credentialId } = request.auth.credentials;

    await this._service.verifyPlaylistAccess(playlistId, credentialId);
    await this._service.deletePlaylistSongById(songId, playlistId);

    const activities = {
      playlistId,
      songId,
      userId: credentialId,
      action: 'delete',
      time: new Date().toISOString(),
    };

    await this._service.addPlaylistActivities(activities);

    return {
      status: 'success',
      message: 'Lagu berhasil dihapus dari playlist',
    };
  }

  async getPlaylistActivitiesHandler(request, h) {
    const { id: playlistId } = request.params;
    const { id: credentialId } = request.auth.credentials;

    await this._service.verifyPlaylistAccess(playlistId, credentialId);

    const { activities, source } = await this._service.getPlaylistActivitiesById(playlistId);

    const response = h.response({
      status: 'success',
      data: {
        playlistId,
        activities,
      },
    });

    response.header('X-Data-Source', source);
    response.code(200);

    return response;
  }
}

module.exports = PlaylistsHandler;
