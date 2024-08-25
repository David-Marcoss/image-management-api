import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { UploadApiErrorResponse, UploadApiResponse, v2 } from 'cloudinary';
import { Multer } from 'multer';
import toStream = require('buffer-to-stream');

@Injectable()
export class CloudinaryService {
  // Método para fazer upload de imagens
  async uploadImage(file: Multer.File): Promise<UploadApiResponse | UploadApiErrorResponse> {
    return new Promise((resolve, reject) => {
      const upload = v2.uploader.upload_stream((error, result) => {
        if (error) return reject(error);
        resolve(result);
      });

      toStream(file.buffer).pipe(upload);
    });
  }

  // Método para verificar se uma imagem existe
  async imageExists(publicId: string): Promise<boolean> {
    try {
      const result = await v2.api.resource(publicId);
      return result ? true : false;
    
    } catch (error) {
      if (error?.error.http_code === 404) {
        return false; // Imagem não encontrada
      }
      throw new InternalServerErrorException('Error checking image existence');
    }
  }

  async getAllImages() {
    try {
      const images = await v2.api.resources({
        type: 'upload',
        max_results: 500,
      });

      return images.resources;
    } catch (error) {
      throw new InternalServerErrorException('Error getting images');
    }
  }

  async updateImage(publicId: string, newFile: Multer.File): Promise<UploadApiResponse | UploadApiErrorResponse> {
    try {
      
      await this.deleteImage(publicId);
      
      return this.uploadImage(newFile);

    } catch (error) {
      throw new InternalServerErrorException('Error updating image');
    }
  }

  // Método para excluir uma imagem
  async deleteImage(publicId: string): Promise<void> {
    try {
      await v2.uploader.destroy(publicId);
    } catch (error) {
      throw new InternalServerErrorException('Error deleting image');
    }
  }
}
