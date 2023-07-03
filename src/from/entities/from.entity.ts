import { Source } from "src/source/entities/source.entity";
import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class From {
    @PrimaryGeneratedColumn()
    id: number;
    
    @Column('varchar', {nullable: true, default: null})
    address: string;

    @Column('varchar', {nullable: true, default: null})
    name: string;

    @ManyToMany(() => Source, (source: Source) => source.from)
    @JoinTable()
    source: any;
}
