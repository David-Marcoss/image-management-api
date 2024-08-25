import { BadRequestException, Injectable, InternalServerErrorException } from "@nestjs/common";
import { UserService } from "../../user/user.service";
import { ImageDto } from "../dto/image.dto";
import { CloudinaryService } from "../../cloudinary/cloudinary.service";
import { UploadImageDto } from "../dto/uploadImage.dto";
import { ImageEntity } from "src/database/entities/images.entyty";
import { Repository, DataSource } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";

@Injectable()
export class CreateImageUseCase {
    constructor(
        private readonly userSerivce: UserService,
        private readonly cloudinaryService: CloudinaryService,
        @InjectRepository(ImageEntity)
        private readonly imageRepository: Repository<ImageEntity>,
        private readonly dataSource: DataSource 
    ) { }

    async execute(imageData: UploadImageDto, userId:string): Promise<ImageDto> {
        const queryRunner = this.dataSource.createQueryRunner();

        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            if (!await this.userSerivce.findUserById.execute(userId)) {
                throw new BadRequestException('User not found');
            }

            const uploadResult = await this.cloudinaryService.uploadImage(imageData.url);

            const imageDataCreate: Omit<ImageDto, "id"> = {
                userId: userId,
                url: uploadResult.url,
                cloudinaryId: uploadResult.public_id,
            };

            const image = this.imageRepository.create(imageDataCreate);
            await queryRunner.manager.save(image);

            await queryRunner.commitTransaction();

            return image;
        
        } catch (error) {
            await queryRunner.rollbackTransaction();

            console.error(error.message);
            throw new InternalServerErrorException('Error uploading and saving image');
        
        } finally {
            await queryRunner.release();
        }
    }
}
