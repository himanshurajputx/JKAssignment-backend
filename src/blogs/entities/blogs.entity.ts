import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  Index, JoinColumn,
} from 'typeorm';
import { User } from 'src/users/entities/user.entity';

@Entity('blogs')
export class Blogs {
  @Index()
  @PrimaryGeneratedColumn('uuid') // Automatically generate UUID as the primary key
  blogId: string;

  @Column()
  blogTitle: string; // blog title

  @Column()
  blogDescription: string; // blog description

  @Column('boolean', { default: false })
  isDeleted: string; // blog deleted

  @Column()
  blogSlug: string; // blog slug for URL

  @Column()
  blogAuthor: string; // author of the blog and relationship with User entity

  @ManyToOne(() => User)
  @JoinColumn({ name: 'blogAuthor' }) // This should match your foreign key column name
  author: User; // Note: we're using 'author' instead of 'user'

  @CreateDateColumn()
  createdAt: Date; // timestamp when the blog is created

  @UpdateDateColumn()
  updatedAt: Date; // timestamp when the blog is updated
}
