import { BadRequestException, Body, Controller, Delete, Get, Param, Post, Put, Req, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { ImagesService } from './images.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { Multer } from 'multer';
import { AuthGuard } from '../auth/auth.guard';
import { UploadImageDto } from './dto/uploadImage.dto';
import { ApiBearerAuth, ApiConsumes, ApiTags, ApiOperation, ApiParam, ApiResponse, ApiBody } from '@nestjs/swagger';

@ApiTags('Images')
@ApiBearerAuth()
@Controller('api/v1/images')
export class ImagesController {
  constructor(private readonly imagesService: ImagesService) {}

  private readonly verifyTypeFile = (file: Multer.File) => {
    if (!file || !file.mimetype.startsWith('image/')) 
      throw new BadRequestException('Only image files are allowed');
  };

  @ApiOperation({ summary: 'Upload a new image' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: UploadImageDto })
  @ApiResponse({ status: 201, description: 'Image uploaded successfully' })
  @ApiResponse({ status: 400, description: 'Only image files are allowed' })
  @UseGuards(AuthGuard)
  @Post()
  @UseInterceptors(FileInterceptor('url'))
  async uploadImage(@UploadedFile() file: Multer.File, @Req() request: Request) {
    this.verifyTypeFile(file);
    
    const userId = request["user"].sub;
    const imageData: UploadImageDto = { url: file };
    
    return this.imagesService.create.execute(imageData, userId);
  }

  @ApiOperation({ summary: 'Get all images' })
  @ApiResponse({ status: 200, description: 'Return all images' })
  @UseGuards(AuthGuard)
  @Get()
  async findAll(@Req() request: Request) {
    const userId = request["user"].sub;
    return this.imagesService.findAll.execute(userId);
  }

  @ApiOperation({ summary: 'Get image by ID' })
  @ApiParam({ name: 'id', description: 'Image ID' })
  @ApiResponse({ status: 200, description: 'Return image details' })
  @ApiResponse({ status: 404, description: 'Image not found' })
  @UseGuards(AuthGuard)
  @Get(":id")
  async findById(@Param("id") id: string, @Req() request: Request) {
    const userId = request["user"].sub;
    return this.imagesService.findById.execute(id, userId);
  }

  @ApiOperation({ summary: 'Delete image by ID' })
  @ApiParam({ name: 'id', description: 'Image ID' })
  @ApiResponse({ status: 200, description: 'Image deleted successfully' })
  @ApiResponse({ status: 404, description: 'Image not found' })
  @UseGuards(AuthGuard)
  @Delete(":id")
  async delete(@Param("id") id: string, @Req() request: Request) {
    const userId = request["user"].sub;
    return this.imagesService.deleteById.execute(id, userId);
  }

  @ApiOperation({ summary: 'Update image by ID' })
  @ApiParam({ name: 'id', description: 'Image ID' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: UploadImageDto })
  @ApiResponse({ status: 200, description: 'Image updated successfully' })
  @ApiResponse({ status: 400, description: 'Only image files are allowed' })
  @UseGuards(AuthGuard)
  @Put(":id")
  @UseInterceptors(FileInterceptor('url'))
  async update(
    @UploadedFile() file: Multer.File,
    @Param("id") id: string,
    @Req() request: Request
  ) {
    this.verifyTypeFile(file);

    const userId = request["user"].sub;
    const updateImageData: UploadImageDto = {
      url: file,
    };

    return this.imagesService.updateById.execute(id, userId, updateImageData);
  }
}
