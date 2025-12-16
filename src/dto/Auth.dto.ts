// dto and entites definitions


export interface RegisterDto {
    email: string;
    password: string;
    fullName: string;
    phone: string;
    position: string;
    salary: number;
    hireDate: Date;
    address: string;
    dateOfBirth?: Date;
    gender: string;
    role?: string;
}

export interface LoginDto {
    email: string;
    password: string;
}
