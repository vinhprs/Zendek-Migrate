import { Source } from "src/source/entities/source.entity";
import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class To {
    @PrimaryGeneratedColumn()
    id: number;
    
    @Column('varchar', {nullable: true, default: null})
    address: string;

    @Column('varchar', {nullable: true, default: null})
    name: string;

    @OneToOne(() => Source, (source: Source) => source.to)
    source: any;
}