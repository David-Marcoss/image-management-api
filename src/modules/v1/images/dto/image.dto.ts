import { IsOptional, IsString, IsUUID } from "class-validator";
import { Multer } from 'multer'; 

export class ImageDto {
    @IsUUID()
    @IsOptional()
    id: string
    
    @IsString()
    cloudinaryId: string

    @IsString()
    url: Multer.File

    @IsString()
    userId: string
}
