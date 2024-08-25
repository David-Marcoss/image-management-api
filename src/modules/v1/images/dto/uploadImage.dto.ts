import { Multer } from 'multer';
import { ApiProperty } from '@nestjs/swagger';

export class UploadImageDto {
  @ApiProperty({ type: 'string', format: 'binary' })
  url: Multer.File;
}
