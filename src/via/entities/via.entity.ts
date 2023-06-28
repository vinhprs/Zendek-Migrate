import { Source } from "src/source/entities/source.entity";
import { Ticket } from "src/tickets/ticket.entity";
import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Via {

    @PrimaryGeneratedColumn()
    id: number;
    
    @Column('varchar', {nullable: true, default: null})
    channel: string;

    // @OneToOne(() => Ticket, (ticket: Ticket) => ticket.via)
    // ticket: Ticket;

    @OneToOne(() => Source, (source: Source) => source.via)
    source: Source;
}
