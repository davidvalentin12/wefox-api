
import { IsNumber, IsString } from 'class-validator';

export class AddressDto {
  @IsString()
  public street: string

  @IsNumber()
  public streetNumber: number

  @IsString()
  public town: string

  @IsString()
  public postalCode: string

  @IsString()
  public country: string
}
