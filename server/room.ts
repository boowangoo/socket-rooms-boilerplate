

export class Room {
    private roomId: string;
    private players: number;
    private capacity: number;

    public static rooms: Map<string, Room>;

    constructor(roomId: string, capacity?: number) {
        this.roomId = roomId;
        this.capacity = capacity && capacity > 0 ? capacity : 10;
        this.players = 0;
    }

    public static createRoom(roomId: string, capacity?: number): void {
        this.rooms.set(roomId, new Room(roomId, capacity));
    }

    public static getRoom(roomId: string): Room {
        return this.rooms.get(roomId);
    }

    public getPlayers(): number {
        return this.capacity;
    }

    public getCapacity(): number {
        return this.capacity;
    }
}