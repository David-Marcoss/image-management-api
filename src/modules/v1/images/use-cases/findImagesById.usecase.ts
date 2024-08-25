import { Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { ImageDto } from "../dto/image.dto";
import { ImageEntity } from "src/database/entities/images.entyty";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { CloudinaryService } from "../../cloudinary/cloudinary.service";

@Injectable()
export class FindImagesByIdUseCase {
    constructor(
        @InjectRepository(ImageEntity)
        private readonly imageRepository: Repository<ImageEntity>,
    ) { }

    async execute(imageId:string,userLoggedId:string):Promise<ImageDto> {

        try {
            const image = await this.imageRepository.findOne({
                where: {
                    userId: userLoggedId,
                    id: imageId
                }
            });

            if (image) return image;
            
            throw new NotFoundException('Image not found');
            
        } catch (error) {

            console.error(error.message);

            if(error.message.includes('Image not found')) throw new NotFoundException('Image not found');
            
            throw new InternalServerErrorException('Error to get images');
        } 
    }
}
