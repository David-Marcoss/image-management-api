
import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { ImageDto } from "../dto/image.dto";
import { ImageEntity } from "src/database/entities/images.entyty";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";


@Injectable()
export class FindAllImagesUseCase {
    constructor(
        @InjectRepository(ImageEntity)
        private readonly imageRepository: Repository<ImageEntity>,
    ) { }

    async execute(userLoggedId:string):Promise<ImageDto[]> {

        try {
            return await this.imageRepository.find({
                where: {
                    userId: userLoggedId
                }
            });
            
        } catch (error) {

            console.error(error.message);
            throw new InternalServerErrorException('Error to get images');
        } 
    }
}
