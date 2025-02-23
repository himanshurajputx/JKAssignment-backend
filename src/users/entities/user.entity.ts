import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn,
  BeforeInsert, BeforeUpdate,  OneToMany, Index } from 'typeorm';
import { Blogs } from 'src/blogs/entities/blogs.entity';
import * as bcrypt from 'bcryptjs';
import { Exclude } from 'class-transformer';


@Entity('users')
export class User {
  @Index()
  @PrimaryGeneratedColumn('uuid') // Automatically generate UUID as the primary key
  userId: string;

  @Index()
  @Column({ type: 'varchar', length: 50, unique: true })
  email: string; // Email of the user

  @Column({ type: 'varchar', length: 50 })
  name: string; // Name of the user

  @Column({ type: 'varchar', length: 50, nullable: true })
  profilePicture?: string; // Profile picture URL

  @CreateDateColumn()
  createdAt: Date; // Date the user account was created

  @UpdateDateColumn()
  updatedAt: Date; // Date the user account was updated

  @OneToMany(() => Blogs, (blogs) => blogs.author)
  blogs: Blogs[]; // Posts created by the user


  @Column()
  @Exclude()
  password: string;

  constructor(data: Partial<User> = {}) {
    Object.assign(this, data);
  }

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword(): Promise<void> {
    const salt = await bcrypt.genSalt();
    if (!/^\$2[abxy]?\$\d+\$/.test(this.password)) {
      this.password = await bcrypt.hash(this.password, salt);
    }
  }

  async checkPassword(plainPassword: string): Promise<boolean> {
    return await bcrypt.compare(plainPassword, this.password);
  }
}
