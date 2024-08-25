import { Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { ImageEntity } from "src/database/entities/images.entyty";
import { Repository, DataSource } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { CloudinaryService } from "../../cloudinary/cloudinary.service";
import { UploadImageDto } from "../dto/uploadImage.dto";
import { ImageDto } from "../dto/image.dto";

@Injectable()
export class UpdateImagesByIdUseCase {
    constructor(
        @InjectRepository(ImageEntity)
        private readonly imageRepository: Repository<ImageEntity>,
        private readonly cloudinaryService: CloudinaryService,
        private readonly dataSource: DataSource
    ) { }

    async execute(
        imageId: string, 
        userLoggedId: string, 
        updateImageData: UploadImageDto)
        : Promise<ImageDto> {

        const queryRunner = this.dataSource.createQueryRunner();

        const { url } = updateImageData;

        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            // Find the image in the database
            const image = await queryRunner.manager.findOne(ImageEntity, {
                where: {
                    userId: userLoggedId,
                    id: imageId
                }
            });

            if (!image) {
                throw new NotFoundException('Image not found');
            }
            
            const updatedImage = await this.cloudinaryService.updateImage(image.cloudinaryId, url);

            const imageUpdateData = {
                cloudinaryId: updatedImage.public_id,
                url: updatedImage.url,
            }

            await queryRunner.manager.update(ImageEntity, { id: imageId }, imageUpdateData);
            await queryRunner.commitTransaction();

            return await queryRunner.manager.findOne(ImageEntity, { where: { id: imageId } });


        } catch (error) {
            
            await queryRunner.rollbackTransaction();
            console.error(error.message);

            if (error.message.includes('Image not found')) {
                throw new NotFoundException('Image not found');
            }

            throw new InternalServerErrorException('Error updating image');

        } finally {
            
            await queryRunner.release();
        }
    }
}
