import { BadRequestException, Body, Controller, Delete, Get, Param, Post, Put, Req, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { ImagesService } from './images.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { Multer } from 'multer';
import { AuthGuard } from '../auth/auth.guard';
import { UploadImageDto } from './dto/uploadImage.dto';

@Controller('api/v1/images')
export class ImagesController {
  constructor(private readonly imagesService: ImagesService) { }

  private readonly verifyTypeFile = (file: Multer.File) => {
    if (!file || !file.mimetype.startsWith('image/')) 
      throw new BadRequestException('Only image files are allowed');
  };

  // @UseGuards(AuthGuard)
  // @Get("/verify-data")
  // async verifyData() {
  //   return this.imagesService.CheckImageDataConsistency.execute();
  // }

  @UseGuards(AuthGuard)
  @Post()
  @UseInterceptors(FileInterceptor('url'))
  async uploadImage(@UploadedFile() file: Multer.File, @Req() request: Request) {
  
    this.verifyTypeFile(file);
    
    const userId = request["user"].sub;
    const imageData: UploadImageDto = {url: file,};
    
    return this.imagesService.create.execute(imageData,userId);
  }

  @UseGuards(AuthGuard)
  @Get()
  async findAll(@Req() request: Request) {
    const userId = request["user"].sub;

    return this.imagesService.findAll.execute(userId);
  }

  @UseGuards(AuthGuard)
  @Get(":id")
  async findById(@Param("id") id: string, @Req() request: Request) {
    const userId = request["user"].sub;

    return this.imagesService.findById.execute(id, userId);
  }

  @UseGuards(AuthGuard)
  @Delete(":id")
  async delete(@Param("id") id: string, @Req() request: Request) {
    const userId = request["user"].sub;

    return this.imagesService.deleteById.execute(id, userId);
  }

  @UseGuards(AuthGuard)
  @Put(":id")
  @UseInterceptors(FileInterceptor('url'))
  async update(
    @UploadedFile() file: Multer.File,
    @Param("id") id: string,
    @Req() request: Request) {

    this.verifyTypeFile(file);
    
    const userId = request["user"].sub;
    const updateImageData: UploadImageDto = {
      url: file,
    };

    return this.imagesService.updateById.execute(id, userId, updateImageData);
  }


}
