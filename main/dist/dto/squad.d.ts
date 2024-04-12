export declare class CreateSquadDto {
    name: string;
}
export declare class SubmitJoinSquadDto {
    id: number;
}
export declare class UpdateSquadNameDto {
    id: number;
    name: string;
}
export declare class SquadInfoDto {
    id: number;
}
export declare class ExitSquadDto {
}
export declare class DisbandSquadDto {
    id: string;
}
export declare class ListSquadUserDto {
    squadId: string;
}
export declare class KickSquadUserDto {
    squadId: number;
    userId: number;
}
export declare class TransferSquadCaptainDto {
    squadId: number;
    userId: number;
}
export declare class AddOrDeleteSquadViceCaptainDto {
    squadId: number;
    userId: number;
    action: string;
}
export declare class ListSquadJoinRequestDto {
    squadId: string;
}
export declare class ProcessSquadJoinRequestDto {
    id: number;
    control: string;
}
