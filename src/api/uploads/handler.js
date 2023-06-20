const autoBind = require('auto-bind');

class UploadsHandler {
  constructor(storageService, albumsService, validator) {
    this._storageService = storageService;
    this._albumsService = albumsService;
    this._validator = validator;

    autoBind(this);
  }

  async postUploadAlbumCoverImageHandler(request, h) {
    const { id } = request.params;
    const { cover } = request.payload;

    this._validator.validateImageHeaders(cover.hapi.headers);

    const oldAlbum = await this._albumsService.getAlbumById(id);

    const filename = await this._storageService.writeFile(cover, cover.hapi);
    await this._albumsService.addAlbumCover(id, filename);

    // delete old album cover if exists
    if (oldAlbum.cover) {
      await this._storageService.deleteFile(oldAlbum.cover);
    }

    const response = h.response({
      status: 'success',
      message: 'Sampul berhasil diunggah',
    });
    response.code(201);

    return response;
  }
}

module.exports = UploadsHandler;
