import { Ticket } from "src/tickets/ticket.entity";
import { Column, Entity, OneToOne, PrimaryColumn } from "typeorm";

@Entity()
export class Field {
    @PrimaryColumn()
    id: number;

    @Column({ nullable: true, default: null })
    value: string;

    @OneToOne(() => Ticket, (ticket: Ticket) => ticket.custom_fields)
    ticket: Ticket;
}
