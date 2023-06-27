import { Channel } from "src/channel/entities/channel.entity";
import { Source } from "src/source/entities/source.entity";
import { Ticket } from "src/tickets/ticket.entity";
import { Entity, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Via {

    @PrimaryGeneratedColumn()
    id: number;
    
    @OneToOne(() => Channel, (channel: Channel) => channel.via)
    channel: Channel;

    @OneToOne(() => Ticket, (ticket: Ticket) => ticket.via)
    ticket: Ticket;

    @OneToOne(() => Source, (source: Source) => source.via)
    source: Source;
}
