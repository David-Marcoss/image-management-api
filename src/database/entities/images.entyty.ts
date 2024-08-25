import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { UserEntity } from './user.entity'; // Certifique-se de ter o caminho correto para a entidade User

@Entity({ name: 'images' })
export class ImageEntity {

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'cloudinary_id', type: 'varchar', length: 256 })
  cloudinaryId: string;

  @Column({ type: 'varchar', length: 256 })
  url: string;

  @Column({ name: 'user_id', type: 'uuid' })
  userId: string;

  @ManyToOne(() => UserEntity, user => user.images, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;
}
