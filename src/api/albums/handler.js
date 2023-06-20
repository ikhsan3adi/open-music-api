const autoBind = require('auto-bind');
const config = require('../../utils/config');

class AlbumsHandler {
  constructor(albumsService, songsService, validator) {
    this._albumsService = albumsService;
    this._songsService = songsService;
    this._validator = validator;

    autoBind(this);
  }

  async postAlbumHandler(request, h) {
    this._validator.validateAlbumPayload(request.payload);

    const albumId = await this._albumsService.addAlbum(request.payload);

    const response = h.response({
      status: 'success',
      message: 'Album berhasil ditambahkan',
      data: {
        albumId,
      },
    });

    response.code(201);
    return response;
  }

  async getAlbumByIdHandler(request) {
    const { id } = request.params;

    const album = await this._albumsService.getAlbumById(id);

    const songs = await this._songsService.getSongByAlbumId(id);

    album.songs = songs;

    album.coverUrl = album.cover
      ? `http://${config.app.host}:${config.app.port}/upload/images/${album.cover}`
      : null;

    delete album.cover;

    return {
      status: 'success',
      data: {
        album,
      },
    };
  }

  async putAlbumByIdHandler(request) {
    this._validator.validateAlbumPayload(request.payload);

    const { id } = request.params;

    await this._albumsService.editAlbumById(id, request.payload);

    return {
      status: 'success',
      message: 'Album berhasil diperbarui',
    };
  }

  async deleteAlbumByIdHandler(request) {
    const { id } = request.params;

    await this._albumsService.deleteAlbumById(id);

    return {
      status: 'success',
      message: 'Album berhasil dihapus',
    };
  }

  async postAlbumLikeHandler(request, h) {
    const { id: credentialId } = request.auth.credentials;
    const { id } = request.params;

    await this._albumsService.addAlbumLike(credentialId, id);

    const response = h.response({
      status: 'success',
      message: 'Berhasil menyukai album',
    });

    response.code(201);
    return response;
  }

  async deleteAlbumLikeHandler(request) {
    const { id: credentialId } = request.auth.credentials;
    const { id } = request.params;

    await this._albumsService.deleteAlbumLike(credentialId, id);

    return {
      status: 'success',
      message: 'Batal menyukai album',
    };
  }

  async getAlbumLikesHandler(request, h) {
    const { id } = request.params;
    const { albumLikes, source } = await this._albumsService.getAlbumLikesById(id);

    const response = h.response({
      status: 'success',
      data: {
        likes: albumLikes.length,
      },
    });

    response.header('X-Data-Source', source);

    return response;
  }
}

module.exports = AlbumsHandler;
